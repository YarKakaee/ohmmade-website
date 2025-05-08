import { Inter } from 'next/font/google';
import './globals.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;

const inter = Inter({
	subsets: ['latin'],
});

export const metadata = {
	title: 'OhmMade | Electronics Made Simple. Projects Worth Sharing.',
	description:
		'OhmMade is where makers publish, discover, and share electronics projects with the world. From Raspberry Pi builds to Arduino tutorials, OhmMade gives you the tools to showcase your work, inspire others, and explore step-by-step guides — all in one beginner-friendly, beautifully designed platform.',
	keywords: [
		'OhmMade',
		'electronics projects',
		'Arduino',
		'Raspberry Pi',
		'microcontroller',
		'engineering',
		'maker',
		'DIY electronics',
		'tutorials',
		'project sharing',
	],
	metadataBase: new URL('https://ohmmade.ca'),
	icons: {
		icon: '/favicon.ico',
	},
	openGraph: {
		title: 'OhmMade | Electronics Made Simple. Projects Worth Sharing.',
		description:
			'OhmMade is where makers publish, discover, and share electronics projects with the world. From Raspberry Pi builds to Arduino tutorials, OhmMade gives you the tools to showcase your work, inspire others, and explore step-by-step guides — all in one beginner-friendly, beautifully designed platform.',
		url: 'https://ohmmade.ca',
		siteName: 'OhmMade',
		images: [
			{
				url: '/assets/og-image.png',
				width: 1200,
				height: 630,
				alt: 'OhmMade Image',
			},
		],
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'OhmMade | Electronics Made Simple. Projects Worth Sharing.',
		description:
			'Discover, build, and share your electronics projects with OhmMade.',
		images: ['/assets/og-image.png'],
	},
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={`${inter.className} antialiased`}>{children}</body>
		</html>
	);
}
