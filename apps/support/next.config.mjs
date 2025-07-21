/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 't4.ftcdn.net',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'avatars.githubusercontent.com',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'platform-lookaside.fbsbx.com',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'graph.facebook.com',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'ujaylejhopvncyjvduvj.supabase.co',
				port: '',
				pathname: '/**',
			},
		],
	},
};

export default nextConfig;
