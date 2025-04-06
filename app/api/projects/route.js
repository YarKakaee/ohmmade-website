// /app/api/projects/route.js

import prisma from '@/prisma/client';
import { NextResponse } from 'next/server';

export async function GET() {
	const projects = await prisma.project.findMany({
		where: { status: 'published' },
		orderBy: { createdAt: 'desc' },
		include: {
			author: {
				select: {
					name: true,
					image: true,
					email: true,
				},
			},
		},
	});

	return NextResponse.json(projects, {
		headers: {
			'Cache-Control': 'no-store',
		},
	});
}
