import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function uploadImage(file) {
	try {
		const fileExt = file.name.split('.').pop();
		const fileName = `${Math.random()}.${fileExt}`;
		const filePath = `avatars/${fileName}`;

		const { data, error } = await supabase.storage
			.from('public')
			.upload(filePath, file, {
				cacheControl: '3600',
				upsert: false,
			});

		if (error) {
			throw error;
		}

		// Get the public URL
		const {
			data: { publicUrl },
		} = supabase.storage.from('public').getPublicUrl(filePath);

		return publicUrl;
	} catch (error) {
		console.error('Error uploading to Supabase:', error);
		throw new Error('Failed to upload image');
	}
}
