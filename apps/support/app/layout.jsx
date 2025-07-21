import { Inter } from 'next/font/google';
import { AuthModalProvider } from '@ohmmade/providers';
import './globals.css';
import { SupabaseProvider } from '@ohmmade/providers';
import Nav from './components/layout/Nav';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
	subsets: ['latin'],
});

export const metadata = {
	title: 'OhmMade Support | Help Center, Docs & FAQ',
	description:
		'Need help with OhmMade? Explore our support center for FAQs, documentation, and guidance on using the OhmMade platform, publishing projects, and troubleshooting common issues.',
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
	metadataBase: new URL('https://support.ohmmade.ca'),
	icons: {
		icon: '/favicon.ico',
	},
	openGraph: {
		title: 'OhmMade Support | Help, Docs & More',
		description:
			'Find answers and guidance for using OhmMade. Learn how to publish projects, manage your profile, and get the most out of the platform.',
		url: 'https://support.ohmmade.ca',
		siteName: 'OhmMade Support',
		images: [
			{
				url: '/assets/support-og-image.png',
				width: 1200,
				height: 630,
				alt: 'OhmMade Support Image',
			},
		],
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'OhmMade Support | Help, Docs & More',
		description:
			'Explore our support center for everything you need to succeed on OhmMade.',
		images: ['/assets/support-og-image.png'],
	},
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={`${inter.className} antialiased`}>
				<SupabaseProvider>
					<AuthModalProvider>
						<Nav />
						{children}
						<Toaster
							position="top-center"
							reverseOrder={false}
							containerStyle={{
								top: '100px',
							}}
						/>
					</AuthModalProvider>
				</SupabaseProvider>
			</body>
		</html>
	);
}
