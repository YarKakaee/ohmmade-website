import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
	try {
		const supabase = createRouteHandlerClient({ cookies });
		const {
			data: { session },
		} = await supabase.auth.getSession();

		if (!session) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const body = await request.json();
		const { title, content, tags } = body;

		// Validation
		if (!title || !content) {
			return NextResponse.json(
				{ error: 'Title and content are required' },
				{ status: 400 }
			);
		}

		if (title.length > 200) {
			return NextResponse.json(
				{ error: 'Title must be less than 200 characters' },
				{ status: 400 }
			);
		}

		// Get user from database
		const user = await prisma.user.findUnique({
			where: { id: session.user.id },
		});

		if (!user) {
			return NextResponse.json(
				{ error: 'User not found' },
				{ status: 404 }
			);
		}

		// Create discussion
		const discussion = await prisma.discussion.create({
			data: {
				title: title.trim(),
				content: content,
				tags: tags || [],
				authorId: user.id,
			},
			include: {
				author: {
					select: {
						id: true,
						username: true,
						name: true,
						image: true,
					},
				},
			},
		});

		return NextResponse.json({
			success: true,
			discussion,
		});
	} catch (error) {
		console.error('Error creating discussion:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
