// app/api/projects/[slug]/like/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import prisma from '@/prisma/client';

export async function POST(req, { params }) {
	const { slug } = await params;
	const cookieStore = await cookies();
	const supabase = createRouteHandlerClient({
		cookies: () => cookieStore,
	});

	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session?.user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const userId = session.user.id;
	const { email, user_metadata } = session.user;
	const name = user_metadata?.name || '';
	const image = user_metadata?.avatar_url || '';

	const project = await prisma.project.findUnique({ where: { slug } });
	if (!project)
		return NextResponse.json(
			{ error: 'Project not found' },
			{ status: 404 }
		);

	// Make sure user exists
	await prisma.user.upsert({
		where: { email },
		update: { name, image },
		create: { id: userId, email, name, image },
	});

	// Check if already liked
	const existingLike = await prisma.userLike.findUnique({
		where: {
			userId_projectId: {
				userId,
				projectId: project.id,
			},
		},
	});

	if (existingLike) {
		// Unlike
		await prisma.userLike.delete({
			where: { userId_projectId: { userId, projectId: project.id } },
		});
		await prisma.project.update({
			where: { id: project.id },
			data: { likes: { decrement: 1 } },
		});
		return NextResponse.json({ liked: false });
	} else {
		// Like
		await prisma.userLike.create({
			data: { userId, projectId: project.id },
		});
		await prisma.project.update({
			where: { id: project.id },
			data: { likes: { increment: 1 } },
		});
		return NextResponse.json({ liked: true });
	}
}
