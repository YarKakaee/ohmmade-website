// /app/api/projects/route.js

import prisma from '@/prisma/client';
import { NextResponse } from 'next/server';

export async function GET(request) {
	const { searchParams } = new URL(request.url);
	const page = parseInt(searchParams.get('page')) || 1;
	const limit = parseInt(searchParams.get('limit')) || 12;
	const skip = (page - 1) * limit;
	const searchQuery = searchParams.get('q') || '';
	const sortBy = searchParams.get('sort') || 'trending';

	// Get filter parameters
	const category =
		searchParams.get('category')?.split(',').filter(Boolean) || [];
	const difficulty =
		searchParams.get('difficulty')?.split(',').filter(Boolean) || [];
	const components =
		searchParams.get('components')?.split(',').filter(Boolean) || [];
	const tags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
	const author = searchParams.get('author')?.split(',').filter(Boolean) || [];

	// Build where clause
	const where = {
		status: 'published',
		...(searchQuery && {
			OR: [
				{ title: { contains: searchQuery, mode: 'insensitive' } },
				{ description: { contains: searchQuery, mode: 'insensitive' } },
			],
		}),
		...(category.length > 0 && { category: { in: category } }),
		...(difficulty.length > 0 && { difficultyLevel: { in: difficulty } }),
		...(components.length > 0 && {
			componentsUsed: { hasSome: components },
		}),
		...(tags.length > 0 && { tags: { hasSome: tags } }),
		...(author.length > 0 && {
			OR: author.map((authorType) => {
				if (authorType === 'ohmmade') {
					return { author: { email: 'info@ohmmade.ca' } };
				} else if (authorType === 'community') {
					return { author: { email: { not: 'info@ohmmade.ca' } } };
				}
				return {};
			}),
		}),
	};

	// Build orderBy clause
	let orderBy = [];
	switch (sortBy) {
		case 'newest':
			orderBy = [{ createdAt: 'desc' }];
			break;
		case 'most_liked':
			orderBy = [{ likes: 'desc' }];
			break;
		case 'most_viewed':
			orderBy = [{ views: 'desc' }];
			break;
		case 'trending':
		default:
			orderBy = [
				{ views: 'desc' },
				{ likes: 'desc' },
				{ createdAt: 'desc' },
			];
			break;
	}

	try {
		const [projects, total] = await Promise.all([
			prisma.project.findMany({
				where,
				orderBy,
				skip,
				take: limit,
				include: {
					author: {
						select: {
							name: true,
							image: true,
							email: true,
						},
					},
				},
			}),
			prisma.project.count({ where }),
		]);

		return NextResponse.json(
			{
				projects,
				total,
			},
			{
				headers: {
					'Cache-Control': 'no-store',
				},
			}
		);
	} catch (error) {
		console.error('Error fetching projects:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch projects' },
			{ status: 500 }
		);
	}
}
