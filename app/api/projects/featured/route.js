// app/api/projects/featured/route.ts
import prisma from '@/prisma/client';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const projects = await prisma.project.findMany({
			where: {
				featured: true,
				status: 'published',
			},
			orderBy: {
				createdAt: 'desc',
			},
			take: 4,
		});
		return NextResponse.json(projects);
	} catch (error) {
		console.error(error);
		return new NextResponse('Failed to fetch featured projects', {
			status: 500,
		});
	}
}
