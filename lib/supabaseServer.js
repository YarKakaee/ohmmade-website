// utils/supabaseServer.js
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const supabaseServer = () => {
	return createServerComponentClient({ cookies });
};

export default supabaseServer;
