import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma/client.js';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request, { params }) {
	try {
		const { id: discussionId } = params;
		const { content } = await request.json();

		if (!content) {
			return NextResponse.json(
				{ error: 'Answer content is required' },
				{ status: 400 }
			);
		}

		// Get user session from Supabase
		const cookieStore = cookies();
		const supabase = createRouteHandlerClient({
			cookies: () => cookieStore,
		});
		const {
			data: { session },
		} = await supabase.auth.getSession();

		if (!session?.user) {
			return NextResponse.json(
				{ error: 'Authentication required' },
				{ status: 401 }
			);
		}

		// Check if discussion exists
		const discussion = await prisma.discussion.findUnique({
			where: { id: discussionId },
		});

		if (!discussion) {
			return NextResponse.json(
				{ error: 'Discussion not found' },
				{ status: 404 }
			);
		}

		// Create the answer
		const answer = await prisma.discussionAnswer.create({
			data: {
				content,
				authorId: session.user.id,
				discussionId,
			},
			include: {
				author: {
					select: {
						id: true,
						name: true,
						image: true,
					},
				},
			},
		});

		// Update discussion status to answered if it was open
		if (discussion.status === 'open') {
			await prisma.discussion.update({
				where: { id: discussionId },
				data: { status: 'answered' },
			});
		}

		return NextResponse.json(answer);
	} catch (error) {
		console.error('Error creating answer:', error);
		return NextResponse.json(
			{ error: 'Failed to create answer' },
			{ status: 500 }
		);
	}
}

export async function GET(request, { params }) {
	try {
		const { id: discussionId } = params;

		// Get answers for the discussion
		const answers = await prisma.discussionAnswer.findMany({
			where: { discussionId },
			include: {
				author: {
					select: {
						id: true,
						name: true,
						image: true,
					},
				},
			},
			orderBy: { createdAt: 'asc' },
		});

		return NextResponse.json(answers);
	} catch (error) {
		console.error('Error fetching answers:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch answers' },
			{ status: 500 }
		);
	}
}
