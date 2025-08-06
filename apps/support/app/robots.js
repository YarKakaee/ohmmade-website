export default function robots() {
	return {
		rules: [
			{
				userAgent: '*',
				allow: '/',
				disallow: [
					'/api/',
					'/auth/',
					'/admin/',
					'/_next/',
					'/favicon.ico',
				],
			},
			{
				userAgent: 'Googlebot',
				allow: '/',
				disallow: ['/api/', '/auth/', '/admin/'],
			},
		],
		sitemap: 'https://support.ohmmade.ca/sitemap.xml',
		host: 'https://support.ohmmade.ca',
	};
}
