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

		const blogs = await prisma.blog.findMany({
			select: {
				id: true,
				title: true,
				content: true,
				imageUrl: true,
				views: true,
				published: true,
				createdAt: true,
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

		return new Response(JSON.stringify(blogs));
	} catch (error) {
		console.error('Error fetching blogs:', error);
		return new Response(
			JSON.stringify({ error: 'Internal Server Error' }),
			{
				status: 500,
			}
		);
	}
}
