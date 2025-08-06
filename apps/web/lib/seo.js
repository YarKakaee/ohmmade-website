// SEO Configuration and Metadata Generators
export const siteConfig = {
	name: 'OhmMade',
	description:
		'Turning One-Time Projects To Lifelong Impact. Discover, build, and share electronics projects with the world.',
	url: 'https://ohmmade.ca',
	ogImage: '/assets/og-image.png',
	creator: '@ohmmade',
	keywords: [
		'electronics projects',
		'Arduino',
		'Raspberry Pi',
		'microcontroller',
		'engineering',
		'maker',
		'DIY electronics',
		'tutorials',
		'project sharing',
		'electronics tutorials',
		'maker community',
		'hardware projects',
		'IoT projects',
		'electronics education',
		'circuit design',
		'embedded systems',
		'electronics learning',
		'maker space',
		'electronics platform',
		'project showcase',
	],
	authors: [
		{
			name: 'OhmMade Team',
			url: 'https://ohmmade.ca',
		},
	],
	creator: '@ohmmade',
	openGraph: {
		type: 'website',
		locale: 'en_US',
		url: 'https://ohmmade.ca',
		title: 'OhmMade | Electronics Made Simple. Projects Worth Sharing.',
		description:
			'OhmMade is where makers publish, discover, and share electronics projects with the world. From Raspberry Pi builds to Arduino tutorials, OhmMade gives you the tools to showcase your work, inspire others, and explore step-by-step guides — all in one beginner-friendly, beautifully designed platform.',
		siteName: 'OhmMade',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'OhmMade | Electronics Made Simple. Projects Worth Sharing.',
		description:
			'Discover, build, and share your electronics projects with OhmMade.',
		creator: '@ohmmade',
		images: ['/assets/og-image.png'],
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
	verification: {
		google: 'your-google-verification-code',
		yandex: 'your-yandex-verification-code',
		yahoo: 'your-yahoo-verification-code',
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
		alternates: {
			canonical: fullUrl,
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
					alt: fullTitle,
				},
			],
			locale: 'en_US',
			type,
			publishedTime,
			modifiedTime,
			authors: authors?.map((author) => author.name),
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
		verification: siteConfig.verification,
	};
}

// Specific metadata generators for different page types
export const metadataGenerators = {
	// Home page
	home: () => {
		const title = 'Turning One-Time Projects Into Lifelong Impact';
		const fullTitle = `${siteConfig.name} | ${title}`;

		return {
			title: fullTitle,
			description:
				'OhmMade is where makers publish, discover, and share electronics projects with the world. From Raspberry Pi builds to Arduino tutorials, OhmMade gives you the tools to showcase your work, inspire others, and explore step-by-step guides — all in one beginner-friendly, beautifully designed platform.',
			keywords: [
				'electronics platform',
				'maker community',
				'project sharing',
				'electronics tutorials',
			],
			authors: siteConfig.authors,
			creator: siteConfig.creator,
			metadataBase: new URL(siteConfig.url),
			alternates: {
				canonical: siteConfig.url,
			},
			openGraph: {
				title: fullTitle,
				description:
					'OhmMade is where makers publish, discover, and share electronics projects with the world. From Raspberry Pi builds to Arduino tutorials, OhmMade gives you the tools to showcase your work, inspire others, and explore step-by-step guides — all in one beginner-friendly, beautifully designed platform.',
				url: siteConfig.url,
				siteName: siteConfig.name,
				images: [
					{
						url: `${siteConfig.url}${siteConfig.ogImage}`,
						width: 1200,
						height: 630,
						alt: fullTitle,
					},
				],
				locale: 'en_US',
				type: 'website',
			},
			twitter: {
				card: 'summary_large_image',
				title: fullTitle,
				description:
					'OhmMade is where makers publish, discover, and share electronics projects with the world. From Raspberry Pi builds to Arduino tutorials, OhmMade gives you the tools to showcase your work, inspire others, and explore step-by-step guides — all in one beginner-friendly, beautifully designed platform.',
				creator: siteConfig.creator,
				images: [`${siteConfig.url}${siteConfig.ogImage}`],
			},
			robots: siteConfig.robots,
			verification: siteConfig.verification,
		};
	},

	// Project pages
	project: (project) =>
		generateMetadata({
			title: project.title,
			description: project.description,
			url: `/projects/${project.slug}`,
			type: 'article',
			publishedTime: project.createdAt,
			modifiedTime: project.updatedAt,
			authors: [
				{
					name: project.author.name,
					url: `/u/${project.author.username}`,
				},
			],
			section: 'Projects',
			tags: project.tags,
			keywords: [
				project.category,
				...project.tags,
				'electronics project',
				'DIY tutorial',
				'maker project',
			],
			image: project.thumbnailUrl,
		}),

	// User profile pages
	user: (user) =>
		generateMetadata({
			title: `${user.name || user.username} (${user.username}) - OhmMade`,
			description: `Discover ${user.name || user.username}'s electronics projects and tutorials on OhmMade. Explore their latest builds, tutorials, and contributions to the maker community.`,
			url: `/u/${user.username}`,
			type: 'profile',
			keywords: [
				user.name || user.username,
				'electronics maker',
				'project creator',
				'tutorial author',
				'maker profile',
			],
			image: user.image,
		}),

	// About page
	about: () =>
		generateMetadata({
			title: 'About OhmMade',
			description:
				"Learn about OhmMade's mission to democratize electronics education and empower makers worldwide. Discover our story, team, and vision for the future of electronics learning.",
			url: '/about',
			keywords: [
				'about OhmMade',
				'our mission',
				'electronics education',
				'maker community',
				'team',
			],
		}),

	// Manifesto page
	manifesto: () =>
		generateMetadata({
			title: 'Our Manifesto',
			description:
				'Read our manifesto on democratizing electronics education and empowering the next generation of makers. Learn about our principles and vision for the future.',
			url: '/manifesto',
			keywords: [
				'manifesto',
				'electronics education',
				'maker movement',
				'democratization',
				'principles',
			],
		}),

	// Education page
	education: () =>
		generateMetadata({
			title: 'Electronics Education & Learning Resources',
			description:
				'Master electronics with our comprehensive learning resources. From beginner tutorials to advanced projects, discover everything you need to become an electronics expert.',
			url: '/education',
			keywords: [
				'electronics education',
				'learning resources',
				'tutorials',
				'electronics courses',
				'maker education',
			],
		}),

	// Projects listing page
	projects: () =>
		generateMetadata({
			title: 'Discover Electronics Projects',
			description:
				'Explore thousands of electronics projects from the OhmMade community. Find Arduino projects, Raspberry Pi builds, IoT solutions, and more. Filter by category, difficulty, and more.',
			url: '/projects',
			keywords: [
				'electronics projects',
				'Arduino projects',
				'Raspberry Pi projects',
				'IoT projects',
				'project discovery',
			],
		}),

	// Legal pages
	privacy: () =>
		generateMetadata({
			title: 'Privacy Policy',
			description:
				'Learn how OhmMade protects your privacy and handles your data. Read our comprehensive privacy policy.',
			url: '/legal/privacy',
			keywords: [
				'privacy policy',
				'data protection',
				'user privacy',
				'GDPR',
			],
		}),

	terms: () =>
		generateMetadata({
			title: 'Terms of Service',
			description:
				"Read OhmMade's terms of service and community guidelines. Understand your rights and responsibilities as a user.",
			url: '/legal/terms',
			keywords: [
				'terms of service',
				'user agreement',
				'community guidelines',
				'legal',
			],
		}),

	// Dashboard page
	dashboard: () =>
		generateMetadata({
			title: 'My Dashboard',
			description:
				'Manage your OhmMade profile, track your projects, and monitor your activity. View your stats, edit your profile, and manage your electronics projects.',
			url: '/dashboard',
			keywords: [
				'user dashboard',
				'profile management',
				'project management',
				'user stats',
				'activity tracking',
			],
		}),

	// Project publish page
	publish: () =>
		generateMetadata({
			title: 'Publish Your Project',
			description:
				'Share your electronics project with the world. Create detailed tutorials, upload images, and inspire other makers with your innovative builds.',
			url: '/projects/publish',
			keywords: [
				'publish project',
				'create tutorial',
				'share electronics project',
				'project submission',
				'maker content',
			],
		}),

	// Support app pages
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
		name: 'OhmMade',
		url: 'https://ohmmade.ca',
		logo: 'https://ohmmade.ca/assets/OMLogoBanner.png',
		description:
			'Turning One-Time Projects To Lifelong Impact. Discover, build, and share electronics projects with the world.',
		sameAs: [
			'https://twitter.com/ohmmade',
			'https://github.com/ohmmade',
			'https://linkedin.com/company/ohmmade',
		],
		contactPoint: {
			'@type': 'ContactPoint',
			contactType: 'customer service',
			email: 'hello@ohmmade.ca',
		},
	},

	// Website schema
	website: {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: 'OhmMade',
		url: 'https://ohmmade.ca',
		description:
			'Electronics platform for makers to publish, discover, and share projects',
		potentialAction: {
			'@type': 'SearchAction',
			target: 'https://ohmmade.ca/search?q={search_term_string}',
			'query-input': 'required name=search_term_string',
		},
	},

	// Project schema
	project: (project) => ({
		'@context': 'https://schema.org',
		'@type': 'TechArticle',
		headline: project.title,
		description: project.description,
		image: project.thumbnailUrl,
		author: {
			'@type': 'Person',
			name: project.author.name,
			url: `https://ohmmade.ca/u/${project.author.username}`,
		},
		publisher: {
			'@type': 'Organization',
			name: 'OhmMade',
			logo: {
				'@type': 'ImageObject',
				url: 'https://ohmmade.ca/assets/OMLogoBanner.png',
			},
		},
		datePublished: project.createdAt,
		dateModified: project.updatedAt,
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': `https://ohmmade.ca/projects/${project.slug}`,
		},
		articleSection: project.category,
		keywords: project.tags.join(', '),
		interactionStatistic: [
			{
				'@type': 'InteractionCounter',
				interactionType: 'https://schema.org/ViewAction',
				userInteractionCount: project.views,
			},
			{
				'@type': 'InteractionCounter',
				interactionType: 'https://schema.org/LikeAction',
				userInteractionCount: project.likes,
			},
		],
	}),

	// Person schema (for user profiles)
	person: (user) => ({
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: user.name || user.username,
		url: `https://ohmmade.ca/u/${user.username}`,
		image: user.image,
		description: `Electronics maker and project creator on OhmMade`,
		sameAs: [
			user.github ? `https://github.com/${user.github}` : null,
			user.twitter ? `https://twitter.com/${user.twitter}` : null,
			user.linkedin ? `https://linkedin.com/in/${user.linkedin}` : null,
		].filter(Boolean),
	}),

	// Breadcrumb schema
	breadcrumb: (items) => ({
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			item: item.url,
		})),
	}),
};

// Generate JSON-LD structured data
export function generateStructuredData(type, data) {
	const structuredDataMap = {
		organization: structuredData.organization,
		website: structuredData.website,
		project: () => structuredData.project(data),
		person: () => structuredData.person(data),
		breadcrumb: () => structuredData.breadcrumb(data),
	};

	const schema = structuredDataMap[type];
	return typeof schema === 'function' ? schema() : schema;
}
