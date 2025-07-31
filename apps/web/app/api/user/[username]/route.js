import { NextResponse } from 'next/server';
import getPrismaClient from '@/prisma/client';
import { awardWatts, canPerformAction } from '@/lib/watts';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
	try {
		const prisma = await getPrismaClient();
		const { username } = await params;

		if (!username) {
			return NextResponse.json(
				{ error: 'Username is required' },
				{ status: 400 }
			);
		}

		// Fetch user by username with public data only
		const user = await prisma.user.findUnique({
			where: { username },
			select: {
				id: true,
				name: true,
				username: true,
				email: true,
				image: true,
				createdAt: true,
				bio: true,
				linkedin: true,
				github: true,
				instagram: true,
				twitter: true,
				watts: true,
				level: true,
				nextLevelWatts: true,
			},
		});

		if (!user) {
			return NextResponse.json(
				{ error: 'User not found' },
				{ status: 404 }
			);
		}

		// Award watts for profile visit (if authenticated)
		try {
			const supabase = createServerComponentClient({ cookies });
			const {
				data: { session },
			} = await supabase.auth.getSession();

			if (session?.user?.email) {
				const visitor = await prisma.user.findUnique({
					where: { email: session.user.email },
				});

				if (visitor && visitor.id !== user.id) {
					const canVisit = await canPerformAction(
						visitor.id,
						'profile_visit',
						prisma
					);
					if (canVisit) {
						await awardWatts(user.id, 1, 'Profile visited', prisma);
					}
				}
			}
		} catch (error) {
			console.error('Error awarding watts for profile visit:', error);
		}

		// Fetch user's published projects
		const projects = await prisma.project.findMany({
			where: {
				authorId: user.id,
				status: 'published',
			},
			select: {
				id: true,
				title: true,
				description: true,
				thumbnailUrl: true,
				category: true,
				slug: true,
				views: true,
				likes: true,
				createdAt: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		// Get follower/following counts
		const followerCount = await prisma.follow.count({
			where: { followingId: user.id },
		});
		const followingCount = await prisma.follow.count({
			where: { followerId: user.id },
		});

		// Calculate total project stats
		const totalViews = projects.reduce(
			(sum, project) => sum + project.views,
			0
		);
		const totalLikes = projects.reduce(
			(sum, project) => sum + project.likes,
			0
		);

		return NextResponse.json({
			user: {
				...user,
				joinedDate: user.createdAt,
			},
			projects,
			stats: {
				projectCount: projects.length,
				followerCount,
				followingCount,
				totalViews,
				totalLikes,
			},
		});
	} catch (error) {
		console.error('Error fetching user profile:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
