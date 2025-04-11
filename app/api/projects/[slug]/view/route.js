import { NextResponse } from 'next/server';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import prisma from '@/prisma/client';

export async function POST(req, { params }) {
	try {
		const { slug } = await params;
		const cookieStore = await cookies();
		const supabase = createServerActionClient({
			cookies: () => cookieStore,
		});

		// Get user session from Supabase
		const {
			data: { session },
		} = await supabase.auth.getSession();

		if (!session?.user) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const { id: userId, email, user_metadata } = session.user;
		const name = user_metadata?.name || '';
		const image = user_metadata?.avatar_url || '';

		// Get the project by slug
		const project = await prisma.project.findUnique({ where: { slug } });
		if (!project) {
			return NextResponse.json(
				{ error: 'Project not found' },
				{ status: 404 }
			);
		}

		// Upsert user into DB if not already there (by email)
		await prisma.user.upsert({
			where: { id: userId },
			update: { name, image },
			create: {
				id: userId,
				email,
				name,
				image,
			},
		});

		// Check if view already exists and increment view count in a single transaction
		const result = await prisma.$transaction(async (tx) => {
			const existingView = await tx.userView.findUnique({
				where: {
					userId_projectId: {
						userId,
						projectId: project.id,
					},
				},
			});

			if (!existingView) {
				await tx.userView.create({
					data: {
						userId,
						projectId: project.id,
					},
				});

				await tx.project.update({
					where: { id: project.id },
					data: { views: { increment: 1 } },
				});
				return { viewAdded: true };
			}

			return { viewAdded: false };
		});

		return NextResponse.json(result);
	} catch (err) {
		console.error('View insert error:', err);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		);
	}
}
