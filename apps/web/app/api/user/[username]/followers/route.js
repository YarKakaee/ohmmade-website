import { NextResponse } from 'next/server';
import getPrismaClient from '@/prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
	try {
		const prisma = getPrismaClient();
		const { username } = await params;

		if (!username) {
			return NextResponse.json(
				{ error: 'Username is required' },
				{ status: 400 }
			);
		}

		// Get user by username
		const user = await prisma.user.findUnique({
			where: { username },
			select: { id: true },
		});

		if (!user) {
			return NextResponse.json(
				{ error: 'User not found' },
				{ status: 404 }
			);
		}

		// Get followers
		const followers = await prisma.follow.findMany({
			where: { followingId: user.id },
			include: {
				follower: {
					select: {
						id: true,
						name: true,
						username: true,
						image: true,
					},
				},
			},
			orderBy: { createdAt: 'desc' },
		});

		return NextResponse.json({
			followers: followers.map((follow) => follow.follower),
		});
	} catch (error) {
		console.error('Error fetching followers:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
