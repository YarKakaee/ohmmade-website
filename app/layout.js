import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { Inter } from 'next/font/google';
import Nav from './components/Nav';
import './globals.css';
config.autoAddCss = false;
import { Toaster } from 'react-hot-toast';

const inter = Inter({
	subsets: ['latin'],
});

export const metadata = {
	title: 'OhmMade - From Circuits to Code, All in One Place',
	description:
		'OhmMade is a hands-on tech education platform for beginners and makers. Learn electronics, circuits, coding, and microcontroller projects with Raspberry Pi, Arduino, and more — all in one place.',
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={`${inter.className} antialiased`}>
				<Nav />
				{children}
				<Toaster position="top-center" reverseOrder={false} />
			</body>
		</html>
	);
}
