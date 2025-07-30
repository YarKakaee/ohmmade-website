// app/api/projects/[slug]/like/route.js
import getPrismaClient from '@/prisma/client';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { createActivity } from '@/lib/activity';
import { generateUsername } from '@/lib/usernameUtils';
import { awardWatts, canPerformAction } from '@/lib/watts';

export const dynamic = 'force-dynamic';

export async function POST(req, { params }) {
	try {
		const prisma = getPrismaClient();
		const cookieStore = await cookies();
		const supabase = createRouteHandlerClient({
			cookies: () => cookieStore,
		});

		const {
			data: { session },
		} = await supabase.auth.getSession();

		if (!session?.user) {
			return new Response('Unauthorized', { status: 401 });
		}

		const { slug } = await params;
		const { id: userId, email, user_metadata } = session.user;
		const name = user_metadata?.name || '';
		const image = user_metadata?.avatar_url || '';
		let username = user_metadata?.username;
		if (!username) {
			username = await generateUsername(name || email.split('@')[0]);
		}

		// Get project by slug
		const project = await prisma.project.findUnique({ where: { slug } });
		if (!project) {
			return new Response('Project not found', { status: 404 });
		}

		// Make sure user exists (upsert by userId, never update username)
		await prisma.user.upsert({
			where: { id: userId },
			update: { name, image }, // DO NOT update username
			create: { id: userId, email, name, image, username },
		});

		// Fetch the user to get the correct id
		const user = await prisma.user.findUnique({
			where: { id: userId },
		});

		// Check if already liked and perform like/unlike in a single transaction
		const result = await prisma.$transaction(async (tx) => {
			const existingLike = await tx.userLike.findUnique({
				where: {
					userId_projectId: {
						userId: user.id,
						projectId: project.id,
					},
				},
			});

			if (existingLike) {
				// Unlike
				await tx.userLike.delete({
					where: {
						userId_projectId: {
							userId: user.id,
							projectId: project.id,
						},
					},
				});
				await tx.project.update({
					where: { id: project.id },
					data: { likes: { decrement: 1 } },
				});
				return { liked: false };
			} else {
				// Like
				await tx.userLike.create({
					data: { userId: user.id, projectId: project.id },
				});
				await tx.project.update({
					where: { id: project.id },
					data: { likes: { increment: 1 } },
				});
				// Track the activity only when liking, not when unliking
				await createActivity(user.id, 'PROJECT_LIKED', project.id);

				// Award watts for liking a project (with cooldown check)
				try {
					const canLike = await canPerformAction(
						user.id,
						'like_project',
						tx
					);
					if (canLike) {
						await awardWatts(user.id, 2, 'Liked a project', tx);
					}
				} catch (error) {
					console.error('Error awarding watts for liking:', error);
				}

				// Award watts to project author for receiving a like
				try {
					await awardWatts(
						project.authorId,
						5,
						'Project received a like',
						tx
					);
				} catch (error) {
					console.error(
						'Error awarding watts to project author:',
						error
					);
				}

				return { liked: true };
			}
		});

		return new Response(JSON.stringify(result), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error('Error liking project:', error);
		return new Response('Error liking project', { status: 500 });
	}
}
