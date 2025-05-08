import { NextResponse } from 'next/server';
import prisma from '@/prisma/client';

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const userId = searchParams.get('userId');

		if (!userId) {
			return NextResponse.json(
				{ error: 'User ID is required' },
				{ status: 400 }
			);
		}

		const projects = await prisma.project.findMany({
			where: {
				authorId: userId,
			},
			orderBy: {
				createdAt: 'desc',
			},
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

		return NextResponse.json(projects);
	} catch (error) {
		console.error('Error fetching user projects:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch projects' },
			{ status: 500 }
		);
	}
}
