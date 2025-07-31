import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import getPrismaClient from '@/prisma/client';
import { awardWatts } from '@/lib/watts';

export const dynamic = 'force-dynamic';

export async function POST(request) {
	try {
		const prisma = getPrismaClient();
		const supabase = createServerComponentClient({ cookies });
		const {
			data: { session },
		} = await supabase.auth.getSession();

		if (!session) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const { targetUserId } = await request.json();

		if (!targetUserId) {
			return NextResponse.json(
				{ error: 'Target user ID is required' },
				{ status: 400 }
			);
		}

		// Get current user
		const currentUser = await prisma.user.findUnique({
			where: { email: session.user.email },
		});

		if (!currentUser) {
			return NextResponse.json(
				{ error: 'User not found' },
				{ status: 404 }
			);
		}

		// Check if already following
		const existingFollow = await prisma.follow.findUnique({
			where: {
				followerId_followingId: {
					followerId: currentUser.id,
					followingId: targetUserId,
				},
			},
		});

		if (existingFollow) {
			// Unfollow
			await prisma.follow.delete({
				where: {
					followerId_followingId: {
						followerId: currentUser.id,
						followingId: targetUserId,
					},
				},
			});

			return NextResponse.json({ following: false });
		} else {
			// Follow
			await prisma.follow.create({
				data: {
					followerId: currentUser.id,
					followingId: targetUserId,
				},
			});

			// Award watts to the user being followed
			try {
				await awardWatts(targetUserId, 20, 'Gained a follower', prisma);
			} catch (error) {
				console.error(
					'Error awarding watts for gaining follower:',
					error
				);
			}

			return NextResponse.json({ following: true });
		}
	} catch (error) {
		console.error('Error in follow/unfollow:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

export async function GET(request) {
	try {
		const supabase = createServerComponentClient({ cookies });
		const {
			data: { session },
		} = await supabase.auth.getSession();

		if (!session) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const { searchParams } = new URL(request.url);
		const targetUserId = searchParams.get('targetUserId');

		if (!targetUserId) {
			return NextResponse.json(
				{ error: 'Target user ID is required' },
				{ status: 400 }
			);
		}

		// Get current user
		const currentUser = await prisma.user.findUnique({
			where: { email: session.user.email },
		});

		if (!currentUser) {
			return NextResponse.json(
				{ error: 'User not found' },
				{ status: 404 }
			);
		}

		// Check if following
		const existingFollow = await prisma.follow.findUnique({
			where: {
				followerId_followingId: {
					followerId: currentUser.id,
					followingId: targetUserId,
				},
			},
		});

		return NextResponse.json({ following: !!existingFollow });
	} catch (error) {
		console.error('Error checking follow status:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
