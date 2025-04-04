/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'cms-assets.unrealengine.com',
			},
			{
				protocol: 'https',
				hostname: 't4.ftcdn.net',
			},
			{
				protocol: 'https',
				hostname: 'pimylifeup.com',
			},
			{
				protocol: 'https',
				hostname: 'projects.arduinocontent.cc',
			},
			{
				protocol: 'https',
				hostname: 'toptechboy.com',
			},
			{
				protocol: 'https',
				hostname: 'raphaelkabo.com',
			},
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
			},
			{
				protocol: 'https',
				hostname: 'ujaylejhopvncyjvduvj.supabase.co',
			},
		],
	},
};

export default nextConfig;
