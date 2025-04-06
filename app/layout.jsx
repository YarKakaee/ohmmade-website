import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Nav from './components/Nav';
import { AuthProvider } from './context/AuthContext';
import './globals.css';
config.autoAddCss = false;

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
				<AuthProvider>
					<Nav />
					{children}
					<Toaster
						position="top-center"
						reverseOrder={false}
						containerStyle={{
							top: '80px',
						}}
					/>
				</AuthProvider>
			</body>
		</html>
	);
}
