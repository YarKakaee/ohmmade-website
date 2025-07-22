import { NextResponse } from 'next/server';
import prisma from '@/prisma/client';

export async function GET(request) {
	const { searchParams } = new URL(request.url);
	const q = searchParams.get('q')?.trim();
	if (!q) {
		return NextResponse.json([], { status: 200 });
	}
	const users = await prisma.user.findMany({
		where: {
			OR: [
				{ username: { contains: q, mode: 'insensitive' } },
				{ name: { contains: q, mode: 'insensitive' } },
			],
		},
		select: {
			id: true,
			name: true,
			username: true,
			image: true,
		},
		take: 10,
	});
	return NextResponse.json(users, { status: 200 });
}
