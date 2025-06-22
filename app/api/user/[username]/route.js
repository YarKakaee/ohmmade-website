import { NextResponse } from 'next/server';
import prisma from '@/prisma/client';

export async function GET(request, { params }) {
	try {
		const { username } = params;

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
				// Add bio field if it exists in your schema
				// bio: true,
			},
		});

		if (!user) {
			return NextResponse.json(
				{ error: 'User not found' },
				{ status: 404 }
			);
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

		// Get follower/following counts (if you have these tables)
		// For now, we'll return 0 as placeholders
		const followerCount = 0;
		const followingCount = 0;

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
