import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/client.js';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request, { params }) {
	const { id } = params;

	if (!id) {
		return NextResponse.json(
			{ error: 'Discussion ID is required' },
			{ status: 400 }
		);
	}

	try {
		// Get user session from Supabase
		const cookieStore = cookies();
		const supabase = createRouteHandlerClient({
			cookies: () => cookieStore,
		});
		const {
			data: { session },
		} = await supabase.auth.getSession();

		// Fetch the discussion with author and answer count
		const discussion = await prisma.discussion.findUnique({
			where: { id },
			include: {
				author: {
					select: {
						id: true,
						name: true,
						image: true,
					},
				},
				_count: {
					select: {
						answers: true,
					},
				},
			},
		});

		if (!discussion) {
			return NextResponse.json(
				{ error: 'Discussion not found' },
				{ status: 404 }
			);
		}

		let viewAdded = false;
		if (session?.user) {
			const userId = session.user.id;
			try {
				await prisma.discussionView.create({
					data: {
						userId,
						discussionId: id,
					},
				});
				// Only increment if a new view was created
				await prisma.discussion.update({
					where: { id },
					data: { views: { increment: 1 } },
				});
				viewAdded = true;
			} catch (e) {
				if (e.code !== 'P2002') throw e; // Only ignore unique constraint error
				// If already exists, do nothing
			}
		}

		return NextResponse.json({ ...discussion, viewAdded });
	} catch (error) {
		console.error('Error fetching discussion:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch discussion' },
			{ status: 500 }
		);
	}
}
