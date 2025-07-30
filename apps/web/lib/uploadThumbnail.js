// utils/uploadThumbnail.js
import { createClient } from '@supabase/supabase-js';

export async function uploadThumbnail(file, userId) {
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
	);
	const fileExt = file.name.split('.').pop();
	const filePath = `thumbnails/${userId}-${Date.now()}.${fileExt}`;

	const { data, error } = await supabase.storage
		.from('project-thumbnails')
		.upload(filePath, file, {
			cacheControl: '3600',
			upsert: false,
			contentType: file.type,
		});

	if (error) throw error;

	// Get public URL
	const { data: publicUrlData } = supabase.storage
		.from('project-thumbnails')
		.getPublicUrl(filePath);

	return publicUrlData.publicUrl;
}
