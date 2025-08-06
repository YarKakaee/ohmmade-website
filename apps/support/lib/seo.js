// SEO Configuration and Metadata Generators for Support App
export const siteConfig = {
	name: 'OhmMade Support',
	description:
		'Need help with OhmMade? Explore our support center for FAQs, documentation, and guidance on using the OhmMade platform.',
	url: 'https://support.ohmmade.ca',
	ogImage: '/assets/support-og-image.png',
	creator: '@ohmmade',
	keywords: [
		'OhmMade Support',
		'OhmMade Help Center',
		'OhmMade Documentation',
		'OhmMade FAQ',
		'project publishing help',
		'OhmMade account issues',
		'how to use OhmMade',
		'support.ohmmade.ca',
	],
	authors: [
		{
			name: 'OhmMade Support Team',
			url: 'https://support.ohmmade.ca',
		},
	],
	creator: '@ohmmade',
	openGraph: {
		type: 'website',
		locale: 'en_US',
		url: 'https://support.ohmmade.ca',
		title: 'OhmMade Support | Help Center, Docs & FAQ',
		description:
			'Need help with OhmMade? Explore our support center for FAQs, documentation, and guidance on using the OhmMade platform.',
		siteName: 'OhmMade Support',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'OhmMade Support | Help Center, Docs & FAQ',
		description:
			'Find answers and guidance for using OhmMade. Learn how to publish projects, manage your profile, and get the most out of the platform.',
		creator: '@ohmmade',
		images: ['/assets/support-og-image.png'],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
};

// Generate metadata for different page types
export function generateMetadata({
	title,
	description,
	keywords = [],
	image,
	url,
	type = 'website',
	publishedTime,
	modifiedTime,
	authors,
	section,
	tags = [],
}) {
	const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
	const fullDescription = description || siteConfig.description;
	const fullKeywords = [...siteConfig.keywords, ...keywords];
	const fullUrl = url ? `${siteConfig.url}${url}` : siteConfig.url;
	const fullImage = image
		? `${siteConfig.url}${image}`
		: `${siteConfig.url}${siteConfig.ogImage}`;

	return {
		title: fullTitle,
		description: fullDescription,
		keywords: fullKeywords,
		authors: authors || siteConfig.authors,
		creator: siteConfig.creator,
		metadataBase: new URL(siteConfig.url),
		icons: {
			icon: '/favicon.ico',
		},
		openGraph: {
			title: fullTitle,
			description: fullDescription,
			url: fullUrl,
			siteName: siteConfig.name,
			images: [
				{
					url: fullImage,
					width: 1200,
					height: 630,
					alt: `${fullTitle} - ${siteConfig.name}`,
				},
			],
			type,
			publishedTime,
			modifiedTime,
			authors: authors || siteConfig.authors,
			section,
			tags,
		},
		twitter: {
			card: 'summary_large_image',
			title: fullTitle,
			description: fullDescription,
			creator: siteConfig.creator,
			images: [fullImage],
		},
		robots: siteConfig.robots,
		alternates: {
			canonical: fullUrl,
		},
	};
}

// Metadata generators for different page types
export const metadataGenerators = {
	// Home page
	home: () =>
		generateMetadata({
			title: 'Help Center, Docs & FAQ',
			description:
				'Need help with OhmMade? Explore our support center for FAQs, documentation, and guidance on using the OhmMade platform, publishing projects, and troubleshooting common issues.',
			url: '/',
			keywords: [
				'help center',
				'FAQ',
				'documentation',
				'support',
				'troubleshooting',
			],
		}),

	// Watts and Leveling Guide
	wattsGuide: () =>
		generateMetadata({
			title: 'Watts & Leveling Guide',
			description:
				'Learn how to earn Watts, level up, and unlock achievements on OhmMade. Understand the gamification system and maximize your impact in the maker community.',
			url: '/articles/watts-and-leveling',
			keywords: [
				'watts guide',
				'leveling system',
				'achievements',
				'gamification',
				'community points',
			],
		}),

	// Publishing Guidelines
	publishingGuidelines: () =>
		generateMetadata({
			title: 'Publishing Guidelines',
			description:
				"Learn the best practices for publishing projects on OhmMade. Create engaging tutorials, write clear documentation, and maximize your project's impact.",
			url: '/articles/publishing-guidelines',
			keywords: [
				'publishing guidelines',
				'project best practices',
				'tutorial writing',
				'content creation',
				'maker guidelines',
			],
		}),

	// Profile Guidelines
	profileGuidelines: () =>
		generateMetadata({
			title: 'Profile Guidelines',
			description:
				'Create an engaging profile that showcases your expertise and projects. Learn how to optimize your OhmMade profile for maximum visibility and impact.',
			url: '/articles/profile-guidelines',
			keywords: [
				'profile guidelines',
				'profile optimization',
				'user profile',
				'profile best practices',
				'maker profile',
			],
		}),
};

// Structured data generators
export const structuredData = {
	// Organization schema
	organization: {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: 'OhmMade Support',
		url: 'https://support.ohmmade.ca',
		logo: 'https://support.ohmmade.ca/assets/support-og-image.png',
		description:
			'Need help with OhmMade? Explore our support center for FAQs, documentation, and guidance on using the OhmMade platform.',
		parentOrganization: {
			'@type': 'Organization',
			name: 'OhmMade',
			url: 'https://ohmmade.ca',
		},
	},
};

// Generate structured data
export function generateStructuredData(type, data = {}) {
	switch (type) {
		case 'organization':
			return structuredData.organization;
		default:
			return null;
	}
}
