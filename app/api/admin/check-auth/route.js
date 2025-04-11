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

		return new Response(JSON.stringify({ success: true }));
	} catch (error) {
		console.error('Error checking auth:', error);
		return new Response(
			JSON.stringify({ error: 'Internal Server Error' }),
			{
				status: 500,
			}
		);
	}
}
