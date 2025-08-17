export const changelog = [
	{
		version: '1.1.0',
		date: 'August 17, 2025',
		title: 'Enhanced Editor & Dynamic Features',
		description:
			'Major revamp of the publishing experience, improved project pages, and enhanced homepage interactions.',
		categories: [
			{
				name: 'New Features',
				type: 'added',
				items: [
					{
						title: 'Modern Publish Page Design',
						description:
							'Complete redesign of the project publishing interface with modern styling and improved usability.',
						details: [
							'Two-column layout with editor and sidebar',
							'Enhanced form styling with modern inputs',
							'Writing tips and guidelines integration',
							'Improved thumbnail upload experience',
							'Drag & drop thumbnail upload functionality',
							'Enter key support for components and tags',
							'Duplicate prevention for components and tags',
						],
					},
					{
						title: 'File Upload Support in Editor.js',
						description:
							'Added comprehensive file upload functionality including ZIP files and other document types.',
						details: [
							'Custom FileTool for Editor.js',
							'Support for ZIP files and documents',
							'Click-to-download functionality',
							'File size and type validation',
						],
					},
					{
						title: 'Enhanced Project Slug Pages',
						description:
							'Redesigned project viewing pages with improved layout and component organization.',
						details: [
							'Modern card-based design for project details',
							'Better component and tag presentation',
							'Improved author information display',
							'Enhanced visual hierarchy',
						],
					},
					{
						title: 'Clickable Feature Cards',
						description:
							'Homepage feature cards are now interactive with smooth hover effects and navigation.',
						details: [
							'Smart navigation to relevant sections',
							'Hover effects with scaling and shadows',
							'Dynamic gradient masks for visual feedback',
							'Full-height scroll zones for better UX',
						],
					},
				],
			},
			{
				name: 'Improvements',
				type: 'improved',
				items: [
					{
						title: 'Mobile Responsiveness',
						description:
							'Enhanced mobile experience across the platform with better responsive design.',
						details: [
							'Smaller hero image on mobile for better text readability',
							'Fixed project filters visibility on mobile',
							'Improved mobile layout for project pages',
							'Better touch interactions',
						],
					},
					{
						title: 'Dynamic Project Statistics',
						description:
							'Project view and like counts are now dynamic instead of being statically generated.',
						details: [
							'Real-time view count updates',
							'Dynamic like count rendering',
							'Improved performance for statistics',
							'Better user engagement tracking',
						],
					},
					{
						title: 'Component List Display',
						description:
							'Fixed text overflow issues in component lists on project pages.',
						details: [
							'Proper word wrapping for long component names',
							'Consistent spacing and alignment',
							'Better visual organization',
							'Improved readability',
						],
					},
					{
						title: 'Enhanced Form Interactions',
						description:
							'Improved user experience for form inputs on the publish page.',
						details: [
							'Enter key shortcuts for adding components and tags',
							'Intelligent duplicate detection (case-insensitive)',
							'Drag & drop image upload with visual feedback',
							'Better keyboard accessibility',
						],
					},
				],
			},
			{
				name: 'Bug Fixes',
				type: 'fixed',
				items: [
					{
						title: 'Editor.js Visual Glitches',
						description:
							'Resolved visual issues when using multiple code segments in the editor.',
						details: [
							'Fixed code block rendering conflicts',
							'Improved editor styling consistency',
							'Better cross-device compatibility',
							'Simplified custom CSS implementation',
						],
					},
					{
						title: 'Image Caption Display',
						description:
							'Fixed empty image captions appearing in read-only mode.',
						details: [
							'Hide empty caption boxes automatically',
							'Better caption styling when present',
							'Improved visual consistency',
							'Enhanced reading experience',
						],
					},
					{
						title: 'Background Color Bleeding',
						description:
							'Fixed white background bleeding through on iOS Safari and other edge cases.',
						details: [
							'Consistent dark background across all pages',
							'Fixed iOS Safari overscroll issues',
							'Better color consistency',
							'Improved visual stability',
						],
					},
					{
						title: 'Content Validation',
						description:
							'Improved Editor.js content validation for better publishing reliability.',
						details: [
							'Better block-level content checking',
							'Enhanced error messaging',
							'Improved data structure validation',
							'More reliable publishing process',
						],
					},
				],
			},
			{
				name: 'Technical',
				type: 'technical',
				items: [
					{
						title: 'Database Performance',
						description:
							'Various database optimizations for better query performance and reliability.',
						details: [
							'Optimized Prisma queries',
							'Better error handling',
							'Improved static generation',
							'Enhanced build process stability',
						],
					},
					{
						title: 'Editor.js Architecture',
						description:
							'Improved Editor.js integration with custom tools and better styling.',
						details: [
							'Custom FileTool implementation',
							'Enhanced CodeSnippet tool',
							'Better tool configuration',
							'Simplified CSS architecture',
						],
					},
				],
			},
		],
	},
];

export const getLatestVersion = () => {
	return changelog[0];
};

export const getVersionByNumber = (version) => {
	return changelog.find((v) => v.version === version);
};

export const getAllVersions = () => {
	return changelog;
};
