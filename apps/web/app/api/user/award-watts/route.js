import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import getPrismaClient from '@/prisma/client';
import { awardWatts, canPerformAction } from '@/lib/watts';

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

		const { actionType, targetUserId, amount, reason } =
			await request.json();

		if (!actionType || !targetUserId || !amount || !reason) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
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

		// Check cooldown for certain actions
		if (actionType === 'profile_visit' || actionType === 'like_project') {
			const canPerform = await canPerformAction(
				currentUser.id,
				actionType,
				prisma
			);
			if (!canPerform) {
				return NextResponse.json(
					{ error: 'Action on cooldown' },
					{ status: 429 }
				);
			}
		}

		// Award watts
		const result = await awardWatts(targetUserId, amount, reason, prisma);

		return NextResponse.json({
			success: true,
			watts: result.watts,
			level: result.level,
			leveledUp: result.leveledUp,
			levelData: result.levelData,
		});
	} catch (error) {
		console.error('Error awarding watts:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
