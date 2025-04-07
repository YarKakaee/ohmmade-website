// app/api/projects/[slug]/liked/route.js
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import prisma from '@/prisma/client';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
	const { slug } = await params;
	const cookieStore = await cookies();
	const supabase = createRouteHandlerClient({
		cookies: () => cookieStore,
	});

	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session?.user) {
		return NextResponse.json({ liked: false });
	}

	const userId = session.user.id;
	const project = await prisma.project.findUnique({ where: { slug } });
	if (!project) return NextResponse.json({ liked: false });

	const like = await prisma.userLike.findUnique({
		where: {
			userId_projectId: {
				userId,
				projectId: project.id,
			},
		},
	});

	return NextResponse.json({ liked: !!like });
}
