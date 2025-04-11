import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import prisma from '@/prisma/client';

export async function GET() {
	try {
		const cookieStore = cookies();
		const supabase = createRouteHandlerClient({
			cookies: () => cookieStore,
		});

		const {
			data: { session },
		} = await supabase.auth.getSession();
		if (!session) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const likedProjects = await prisma.userLike.findMany({
			where: {
				userId: session.user.id,
			},
			include: {
				project: {
					select: {
						id: true,
						title: true,
						description: true,
						thumbnailUrl: true,
						views: true,
						likes: true,
						createdAt: true,
						slug: true,
						author: {
							select: {
								name: true,
								image: true,
								email: true,
							},
						},
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		const projects = likedProjects.map((like) => ({
			...like.project,
			imageUrl: like.project.thumbnailUrl,
			authorName: like.project.author.name,
			authorImage: like.project.author.image,
			authorEmail: like.project.author.email,
		}));

		return NextResponse.json(projects);
	} catch (error) {
		console.error('Error fetching liked projects:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch liked projects' },
			{ status: 500 }
		);
	}
}
