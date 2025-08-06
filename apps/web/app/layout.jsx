import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import {
	AuthModalProvider,
	SupabaseProvider,
	SearchModalProvider,
} from '@ohmmade/providers';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Footer from './components/layout/Footer';
import Nav from './components/layout/Nav';
import { metadataGenerators, generateStructuredData } from '@/lib/seo';
import './globals.css';

config.autoAddCss = false;

const inter = Inter({
	subsets: ['latin'],
	display: 'swap',
	preload: true,
});

export const metadata = metadataGenerators.home();

export default function RootLayout({ children }) {
	const structuredData = [
		generateStructuredData('organization'),
		generateStructuredData('website'),
	];

	return (
		<html lang="en">
			<head>
				{/* Preconnect to external domains for performance */}
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>
				<link
					rel="preconnect"
					href="https://ujaylejhopvncyjvduvj.supabase.co"
				/>

				{/* DNS prefetch for performance */}
				<link rel="dns-prefetch" href="//fonts.googleapis.com" />
				<link rel="dns-prefetch" href="//fonts.gstatic.com" />
				<link
					rel="dns-prefetch"
					href="//ujaylejhopvncyjvduvj.supabase.co"
				/>

				{/* Structured Data */}
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(structuredData),
					}}
				/>
			</head>
			<body className={`${inter.className} antialiased`}>
				<SupabaseProvider>
					<AuthModalProvider>
						<SearchModalProvider>
							<Nav />
							{children}
							<Toaster
								position="top-center"
								reverseOrder={false}
								containerStyle={{
									top: '100px',
								}}
							/>
							<Footer />
						</SearchModalProvider>
					</AuthModalProvider>
				</SupabaseProvider>
			</body>
		</html>
	);
}
