import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(file) {
	try {
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		const result = await new Promise((resolve, reject) => {
			cloudinary.uploader
				.upload_stream(
					{
						folder: 'ohmmade/avatars',
						resource_type: 'auto',
					},
					(error, result) => {
						if (error) reject(error);
						resolve(result);
					}
				)
				.end(buffer);
		});

		return result.secure_url;
	} catch (error) {
		console.error('Error uploading to Cloudinary:', error);
		throw new Error('Failed to upload image');
	}
}
