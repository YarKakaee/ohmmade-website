import prisma from '@/prisma/client';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { createActivity } from '@/lib/activity';
import { generateUsername } from '@/lib/usernameUtils';

export async function POST(req, { params }) {
	try {
		const cookieStore = await cookies();
		const supabase = createRouteHandlerClient({
			cookies: () => cookieStore,
		});

		// Get user session from Supabase
		const {
			data: { session },
		} = await supabase.auth.getSession();

		// Await params before using its properties
		const { slug } = await params;

		// Get project by slug
		const project = await prisma.project.findUnique({ where: { slug } });
		if (!project) {
			return new Response('Project not found', { status: 404 });
		}

		// If user is logged in, track the view and activity
		if (session?.user) {
			const { id: userId, email, user_metadata } = session.user;
			const name = user_metadata?.name || '';
			const image = user_metadata?.avatar_url || '';
			let username = user_metadata?.username;
			if (!username) {
				username = await generateUsername(name || email.split('@')[0]);
			}

			// Upsert user into DB if not already there (by email)
			await prisma.user.upsert({
				where: { email },
				update: { name, image, username },
				create: {
					id: userId,
					email,
					name,
					image,
					username,
				},
			});

			// Fetch the user to get the correct id
			const user = await prisma.user.findUnique({
				where: { email },
			});

			let viewAdded = false;
			try {
				await prisma.userView.create({
					data: {
						userId: user.id,
						projectId: project.id,
					},
				});
				// Only increment and track if a new view was created
				await prisma.project.update({
					where: { id: project.id },
					data: { views: { increment: 1 } },
				});
				await createActivity(user.id, 'PROJECT_VIEWED', project.id);
				viewAdded = true;
			} catch (e) {
				if (e.code !== 'P2002') throw e; // Only ignore unique constraint error
				// If already exists, do nothing
			}
			return new Response(JSON.stringify({ viewAdded }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// If no user is logged in, just increment the view count
		await prisma.project.update({
			where: { id: project.id },
			data: {
				views: {
					increment: 1,
				},
			},
		});

		return new Response(JSON.stringify({ viewAdded: true }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error('Error tracking view:', error);
		return new Response('Error tracking view', { status: 500 });
	}
}
