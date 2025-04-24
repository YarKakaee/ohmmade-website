import prisma from '@/prisma/client';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { createActivity } from '@/lib/activity';

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

		const { slug } = params;

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

			// Upsert user into DB if not already there (by email)
			await prisma.user.upsert({
				where: { id: userId },
				update: { name, image },
				create: {
					id: userId,
					email,
					name,
					image,
				},
			});

			// Check if view already exists and increment view count in a single transaction
			const result = await prisma.$transaction(async (tx) => {
				const existingView = await tx.userView.findUnique({
					where: {
						userId_projectId: {
							userId,
							projectId: project.id,
						},
					},
				});

				if (!existingView) {
					await tx.userView.create({
						data: {
							userId,
							projectId: project.id,
						},
					});

					await tx.project.update({
						where: { id: project.id },
						data: { views: { increment: 1 } },
					});

					// Track the activity only for new views
					await createActivity(userId, 'PROJECT_VIEWED', project.id);
					return { viewAdded: true };
				}

				return { viewAdded: false };
			});

			return new Response(JSON.stringify(result), {
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
