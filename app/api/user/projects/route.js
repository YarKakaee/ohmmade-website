import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import prisma from '@/prisma/client';

export async function GET() {
	try {
		const cookieStore = cookies();
		const supabase = createRouteHandlerClient({
			cookies: () => cookieStore,
		});

		const {
			data: { session },
		} = await supabase.auth.getSession();
		if (!session) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const projects = await prisma.project.findMany({
			where: {
				authorId: session.user.id,
			},
			select: {
				id: true,
				title: true,
				description: true,
				thumbnailUrl: true,
				views: true,
				likes: true,
				createdAt: true,
				category: true,
				slug: true,
				author: {
					select: {
						name: true,
						image: true,
						email: true,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		// Transform the projects to match the ProjectCard component's expectations
		const transformedProjects = projects.map((project) => ({
			...project,
			imageUrl: project.thumbnailUrl,
			authorName: project.author.name,
			authorImage: project.author.image,
			authorEmail: project.author.email,
		}));

		return NextResponse.json(transformedProjects);
	} catch (error) {
		console.error('Error fetching user projects:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch user projects' },
			{ status: 500 }
		);
	}
}
