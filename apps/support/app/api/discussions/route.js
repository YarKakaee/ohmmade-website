import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const query = searchParams.get('q') || '';
		const page = parseInt(searchParams.get('page') || '1');
		const limit = parseInt(searchParams.get('limit') || '10');
		const status = searchParams.get('status') || undefined;

		const skip = (page - 1) * limit;

		// Build where clause
		const where = {};

		if (query) {
			where.OR = [
				{ title: { contains: query, mode: 'insensitive' } },
				{ tags: { hasSome: [query] } },
			];
		}

		if (status) {
			where.status = status;
		}

		// Get discussions with pagination
		const [discussions, total] = await Promise.all([
			prisma.discussion.findMany({
				where,
				include: {
					author: {
						select: {
							id: true,
							username: true,
							name: true,
							image: true,
						},
					},
					answers: {
						select: {
							id: true,
						},
					},
					_count: {
						select: {
							answers: true,
						},
					},
				},
				orderBy: { createdAt: 'desc' },
				skip,
				take: limit,
			}),
			prisma.discussion.count({ where }),
		]);

		const totalPages = Math.ceil(total / limit);

		return NextResponse.json({
			discussions,
			pagination: {
				page,
				limit,
				total,
				totalPages,
				hasNext: page < totalPages,
				hasPrev: page > 1,
			},
		});
	} catch (error) {
		console.error('Error fetching discussions:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
