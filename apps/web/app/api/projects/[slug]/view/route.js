import getPrismaClient from '@/prisma/client';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { createActivity } from '@/lib/activity';
import { generateUsername } from '@/lib/usernameUtils';

export const dynamic = 'force-dynamic';

export async function POST(req, { params }) {
	try {
		const prisma = getPrismaClient();
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

			// Upsert user into DB if not already there (by userId, never update username)
			await prisma.user.upsert({
				where: { id: userId },
				update: { name, image }, // DO NOT update username
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
				where: { id: userId },
			});

			let viewAdded = false;
			try {
				// Check if user has already viewed this project
				const existingView = await prisma.userView.findUnique({
					where: {
						userId_projectId: {
							userId: user.id,
							projectId: project.id,
						},
					},
				});

				if (!existingView) {
					// This is a new view - create the record and increment count
					await prisma.userView.create({
						data: {
							userId: user.id,
							projectId: project.id,
						},
					});

					// Increment project views for new views
					await prisma.project.update({
						where: { id: project.id },
						data: { views: { increment: 1 } },
					});
					await createActivity(user.id, 'PROJECT_VIEWED', project.id);
					viewAdded = true;
				} else {
					// User has already viewed this project - update timestamp but don't increment count
					await prisma.userView.update({
						where: {
							userId_projectId: {
								userId: user.id,
								projectId: project.id,
							},
						},
						data: {
							createdAt: new Date(),
						},
					});
				}
			} catch (e) {
				console.error('Error handling user view:', e);
				// If there's still an error, don't fail the request
			}
			return new Response(JSON.stringify({ viewAdded }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// If no user is logged in, do not track the view
		return new Response(JSON.stringify({ viewAdded: false }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error('Error tracking view:', error);
		return new Response('Error tracking view', { status: 500 });
	}
}
