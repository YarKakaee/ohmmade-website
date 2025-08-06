import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
	title: 'OhmMade Admin',
	description: 'Admin dashboard for OhmMade platform',
	robots: {
		index: false,
		follow: false,
		googleBot: {
			index: false,
			follow: false,
			noimageindex: true,
			notranslate: true,
		},
	},
	other: {
		googlebot: 'noindex, nofollow, noimageindex, notranslate',
		robots: 'noindex, nofollow, noimageindex, notranslate',
		'X-Robots-Tag': 'noindex, nofollow, noimageindex, notranslate',
	},
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<head>
				{/* Block all search engines from indexing */}
				<meta
					name="robots"
					content="noindex, nofollow, noimageindex, notranslate"
				/>
				<meta
					name="googlebot"
					content="noindex, nofollow, noimageindex, notranslate"
				/>
				<meta
					name="bingbot"
					content="noindex, nofollow, noimageindex, notranslate"
				/>
				<meta
					name="slurp"
					content="noindex, nofollow, noimageindex, notranslate"
				/>
				<meta
					name="duckduckbot"
					content="noindex, nofollow, noimageindex, notranslate"
				/>
				<meta
					name="baiduspider"
					content="noindex, nofollow, noimageindex, notranslate"
				/>
				<meta
					name="yandexbot"
					content="noindex, nofollow, noimageindex, notranslate"
				/>

				{/* Additional security headers */}
				<meta
					name="X-Robots-Tag"
					content="noindex, nofollow, noimageindex, notranslate"
				/>
				<meta name="referrer" content="no-referrer" />
			</head>
			<body className={`${inter.className} antialiased`}>{children}</body>
		</html>
	);
}
