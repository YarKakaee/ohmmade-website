export default function robots() {
	return {
		rules: [
			{
				userAgent: '*',
				disallow: '/',
			},
			{
				userAgent: 'Googlebot',
				disallow: '/',
			},
			{
				userAgent: 'Bingbot',
				disallow: '/',
			},
			{
				userAgent: 'Slurp',
				disallow: '/',
			},
			{
				userAgent: 'DuckDuckBot',
				disallow: '/',
			},
			{
				userAgent: 'Baiduspider',
				disallow: '/',
			},
			{
				userAgent: 'YandexBot',
				disallow: '/',
			},
		],
		host: 'https://admin.ohmmade.ca',
	};
}
