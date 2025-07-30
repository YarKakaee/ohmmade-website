// /app/api/projects/route.js

import getPrismaClient from '@/prisma/client';
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { createActivity } from '@/lib/activity';
import { generateUsername } from '@/lib/usernameUtils';
import { Prisma } from '@prisma/client';

export async function GET(request) {
	const prisma = await getPrismaClient();
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
		if (searchQuery) {
			// Use raw SQL for partial tag search
			const projectsRaw = await prisma.$queryRaw`
				SELECT * FROM "Project"
				WHERE status = 'published'
				  AND (
					  title ILIKE ${'%' + searchQuery + '%'}
					  OR description ILIKE ${'%' + searchQuery + '%'}
					  OR EXISTS (
						  SELECT 1 FROM jsonb_array_elements_text("tags") AS tag
						  WHERE tag ILIKE ${'%' + searchQuery + '%'}
					  )
				  )
				ORDER BY ${Prisma.raw(
					orderBy
						.map((o) =>
							Object.entries(o)
								.map(([k, v]) => `"${k}" ${v.toUpperCase()}`)
								.join(', ')
						)
						.join(', ')
				)}
				LIMIT ${limit} OFFSET ${skip}
			`;
			// For total count
			const totalResult = await prisma.$queryRaw`
				SELECT COUNT(*) FROM "Project"
				WHERE status = 'published'
				  AND (
					  title ILIKE ${'%' + searchQuery + '%'}
					  OR description ILIKE ${'%' + searchQuery + '%'}
					  OR EXISTS (
						  SELECT 1 FROM jsonb_array_elements_text("tags") AS tag
						  WHERE tag ILIKE ${'%' + searchQuery + '%'}
					  )
				  )
			`;
			const total = parseInt(totalResult[0]?.count || 0, 10);

			// Fetch full project objects with author info
			const projectIds = projectsRaw.map((p) => p.id);
			let projects = [];
			if (projectIds.length > 0) {
				projects = await prisma.project.findMany({
					where: { id: { in: projectIds } },
					include: {
						author: {
							select: { name: true, image: true, email: true },
						},
					},
				});
				// Preserve the original order from the raw query
				const idToProject = Object.fromEntries(
					projects.map((p) => [p.id, p])
				);
				projects = projectIds
					.map((id) => idToProject[id])
					.filter(Boolean);
			}

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
		}
		// ... fallback to original Prisma query if no searchQuery ...
		const [projects, total] = await Promise.all([
			prisma.project.findMany({
				where: {
					status: 'published',
					...(category.length > 0 && { category: { in: category } }),
					...(difficulty.length > 0 && {
						difficultyLevel: { in: difficulty },
					}),
					...(components.length > 0 && {
						componentsUsed: { hasSome: components },
					}),
					...(author.length > 0 && {
						OR: author.map((authorType) => {
							if (authorType === 'ohmmade') {
								return { author: { email: 'info@ohmmade.ca' } };
							} else if (authorType === 'community') {
								return {
									author: {
										email: { not: 'info@ohmmade.ca' },
									},
								};
							}
							return {};
						}),
					}),
				},
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
			prisma.project.count({
				where: {
					status: 'published',
					...(category.length > 0 && { category: { in: category } }),
					...(difficulty.length > 0 && {
						difficultyLevel: { in: difficulty },
					}),
					...(components.length > 0 && {
						componentsUsed: { hasSome: components },
					}),
					...(author.length > 0 && {
						OR: author.map((authorType) => {
							if (authorType === 'ohmmade') {
								return { author: { email: 'info@ohmmade.ca' } };
							} else if (authorType === 'community') {
								return {
									author: {
										email: { not: 'info@ohmmade.ca' },
									},
								};
							}
							return {};
						}),
					}),
				},
			}),
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

export async function POST(req) {
	try {
		const prisma = await getPrismaClient();
		const cookieStore = await cookies();
		const supabase = createRouteHandlerClient({
			cookies: () => cookieStore,
		});

		const {
			data: { session },
		} = await supabase.auth.getSession();

		if (!session?.user) {
			return new Response('Unauthorized', { status: 401 });
		}

		const data = await req.json();
		const { id: userId, email, user_metadata } = session.user;
		const name = user_metadata?.name || '';
		const image = user_metadata?.avatar_url || '';
		let username = data.username;
		if (!username) {
			username = await generateUsername(name || email.split('@')[0]);
		}

		// Make sure user exists
		await prisma.user.upsert({
			where: { email },
			update: {},
			create: { id: userId, email, name, image, username },
		});

		const project = await prisma.project.create({
			data: {
				...data,
				authorId: userId,
			},
		});

		// Track publishing activity if the project is published
		if (project.status === 'published') {
			await createActivity(userId, 'PROJECT_PUBLISHED', project.id);
		}

		return new Response(JSON.stringify(project), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error('Error creating project:', error);
		return new Response('Error creating project', { status: 500 });
	}
}

export async function PUT(req) {
	try {
		const prisma = await getPrismaClient();
		const cookieStore = await cookies();
		const supabase = createRouteHandlerClient({
			cookies: () => cookieStore,
		});

		const {
			data: { session },
		} = await supabase.auth.getSession();

		if (!session?.user) {
			return new Response('Unauthorized', { status: 401 });
		}

		const data = await req.json();
		const userId = session.user.id;

		// Verify project ownership
		const existingProject = await prisma.project.findUnique({
			where: { id: data.id },
			select: { authorId: true, status: true },
		});

		if (!existingProject || existingProject.authorId !== userId) {
			return new Response('Unauthorized', { status: 401 });
		}

		const project = await prisma.project.update({
			where: { id: data.id },
			data: {
				...data,
				tags: data.tags ? JSON.stringify(data.tags) : undefined,
				updatedAt: new Date(),
			},
		});

		// Track publishing activity if the project status changed to published
		if (
			existingProject.status !== 'published' &&
			project.status === 'published'
		) {
			await createActivity(userId, 'PROJECT_PUBLISHED', project.id);
		}

		return new Response(JSON.stringify(project), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error('Error updating project:', error);
		return new Response('Error updating project', { status: 500 });
	}
}
