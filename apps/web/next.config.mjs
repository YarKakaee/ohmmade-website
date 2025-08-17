/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: [
		'@blocknote/core',
		'@blocknote/react',
		'@blocknote/mantine',
	],
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
				hostname: 'edc-cdn.net',
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
			{
				protocol: 'https',
				hostname: 'images.unsplash.com',
			},
		],
	},
};

export default nextConfig;
