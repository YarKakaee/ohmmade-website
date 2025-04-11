import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
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
			return new Response(JSON.stringify({ error: 'Unauthorized' }), {
				status: 401,
			});
		}

		const user = await prisma.user.findUnique({
			where: { email: session.user.email },
		});

		if (user?.email !== 'info@ohmmade.ca') {
			return new Response(JSON.stringify({ error: 'Forbidden' }), {
				status: 403,
			});
		}

		const projects = await prisma.project.findMany({
			select: {
				id: true,
				title: true,
				description: true,
				thumbnailUrl: true,
				views: true,
				likes: true,
				createdAt: true,
				status: true,
				category: true,
				author: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		return new Response(JSON.stringify(projects));
	} catch (error) {
		console.error('Error fetching projects:', error);
		return new Response(
			JSON.stringify({ error: 'Internal Server Error' }),
			{
				status: 500,
			}
		);
	}
}
