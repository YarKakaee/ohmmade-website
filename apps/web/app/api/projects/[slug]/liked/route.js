// app/api/projects/[slug]/liked/route.js
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import getPrismaClient from '@/prisma/client';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
	const prisma = getPrismaClient();
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

	// Always use the user's id from the database (looked up by email)
	const dbUser = await prisma.user.findUnique({
		where: { email: session.user.email },
	});
	if (!dbUser) return NextResponse.json({ liked: false });

	const project = await prisma.project.findUnique({ where: { slug } });
	if (!project) return NextResponse.json({ liked: false });

	const likeCount = await prisma.userLike.count({
		where: {
			userId: dbUser.id,
			projectId: project.id,
		},
	});

	return NextResponse.json({ liked: likeCount > 0 });
}
