import { NextResponse } from 'next/server';
import getPrismaClient from '@/prisma/client';

export async function GET(request) {
	try {
		const prisma = getPrismaClient();
		const { searchParams } = new URL(request.url);
		const userId = searchParams.get('userId');
		const page = parseInt(searchParams.get('page')) || 1;
		const limit = 6; // 6 items per page
		const skip = (page - 1) * limit;

		if (!userId) {
			return NextResponse.json(
				{ error: 'User ID is required' },
				{ status: 400 }
			);
		}

		const [projects, total] = await Promise.all([
			prisma.project.findMany({
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
				skip,
				take: limit,
			}),
			prisma.project.count({
				where: {
					authorId: userId,
				},
			}),
		]);

		return NextResponse.json({ projects, total });
	} catch (error) {
		console.error('Error fetching user projects:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch projects' },
			{ status: 500 }
		);
	}
}
