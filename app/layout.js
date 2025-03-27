import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
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
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				{children}
			</body>
		</html>
	);
}
