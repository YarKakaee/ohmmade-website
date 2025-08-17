import { metadataGenerators } from '@/lib/seo';

export const metadata = {
	title: 'Changelog | OhmMade',
	description:
		'Track the evolution of OhmMade with detailed release notes, new features, improvements, and bug fixes for each version.',
	keywords: [
		'changelog',
		'release notes',
		'updates',
		'new features',
		'bug fixes',
		'improvements',
		'version history',
		'OhmMade updates',
	],
	openGraph: {
		title: 'Changelog | OhmMade',
		description:
			'Track the evolution of OhmMade with detailed release notes, new features, improvements, and bug fixes for each version.',
		url: 'https://ohmmade.ca/changelog',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Changelog | OhmMade',
		description:
			'Track the evolution of OhmMade with detailed release notes and new features.',
	},
	alternates: {
		canonical: 'https://ohmmade.ca/changelog',
	},
};

export default function ChangelogLayout({ children }) {
	return children;
}
