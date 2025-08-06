export default function robots() {
	return {
		rules: [
			{
				userAgent: '*',
				allow: '/',
				disallow: [
					'/api/',
					'/auth/',
					'/dashboard/',
					'/signin',
					'/signup',
					'/admin/',
					'/_next/',
					'/favicon.ico',
				],
			},
			{
				userAgent: 'Googlebot',
				allow: '/',
				disallow: [
					'/api/',
					'/auth/',
					'/dashboard/',
					'/signin',
					'/signup',
					'/admin/',
				],
			},
		],
		sitemap: 'https://ohmmade.ca/sitemap.xml',
		host: 'https://ohmmade.ca',
	};
}
