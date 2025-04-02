'use client'; // For Next.js App Router with client components

import { useEffect, useState } from 'react';
import { faAngleDown, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRef } from 'react';

export default function Nav() {
	const [scrolled, setScrolled] = useState(false);
	const [showLanguageMenu, setShowLanguageMenu] = useState(false);
	const languageRef = useRef(null);

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 10);
		};

		const handleClickOutside = (event) => {
			if (
				languageRef.current &&
				!languageRef.current.contains(event.target)
			) {
				setShowLanguageMenu(false);
			}
		};

		window.addEventListener('scroll', handleScroll);
		document.addEventListener('mousedown', handleClickOutside);

		// Cleanup both listeners
		return () => {
			window.removeEventListener('scroll', handleScroll);
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<header
			className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
				scrolled
					? 'bg-[#101014]/70 backdrop-blur-lg'
					: 'bg-transparent backdrop-blur-0'
			}`}
		>
			<div className="mx-auto max-w-[1700px] px-8 sm:px-16 h-18 flex items-center justify-between">
				{/* Left Section: Logo */}
				<div className="flex items-center space-x-2">
					<Link
						href="/"
						className="flex items-center space-x-2 cursor-pointer"
					>
						<Image
							src="/assets/OMLogo2.png"
							alt="OhmMade Logo"
							width={28}
							height={28}
							className="object-contain mb-2"
							priority
						/>
						<span className="text-white font-extrabold text-lg">
							OhmMade
						</span>
					</Link>
				</div>

				{/* Right Section: Nav Links + Sign In Button */}
				<nav className="flex items-center space-x-6 text-white font-normal text-sm">
					{/* Learn (Dropdown) */}
					<div className="relative group">
						<div className="px-2 py-2 flex items-center cursor-pointer transition-colors duration-200 hover:text-[#ACACAD]">
							<span>Learn</span>
							<FontAwesomeIcon
								icon={faAngleDown}
								size="xs"
								className="ml-1.5 transform transition-transform duration-200 group-hover:rotate-180"
							/>
						</div>
						<div className="invisible absolute top-full left-[-12px] mt-2 w-45 bg-[#2c2d2e] backdrop-blur-3xl border border-[#454547] text-white text-sm rounded-lg p-2 shadow-lg opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:visible z-50">
							<Link
								href="/learn/basic-electronics"
								className="block px-3 py-2 rounded-lg hover:bg-[#1e1e1e] transition-colors duration-100 ease-in-out"
							>
								Basic Electronics
							</Link>
							<Link
								href="/learn/arduino-uno"
								className="block px-3 py-2 rounded-lg hover:bg-[#1e1e1e] transition-colors duration-100 ease-in-out"
							>
								Arduino UNO
							</Link>
							<Link
								href="/learn/raspberry-pi-4"
								className="block px-3 py-2 rounded-lg hover:bg-[#1e1e1e] transition-colors duration-100 ease-in-out"
							>
								Raspberry Pi 4
							</Link>
							<Link
								href="/learn/raspberry-pi-pico-w"
								className="block px-3 py-2 rounded-lg hover:bg-[#1e1e1e] transition-colors duration-100 ease-in-out"
							>
								Raspberry Pi Pico W
							</Link>
						</div>
					</div>

					{/* Projects (Dropdown) */}
					<div className="relative group">
						<div className="px-2 py-2 flex items-center cursor-pointer transition-colors duration-200 hover:text-[#ACACAD]">
							<span>Projects</span>
							<FontAwesomeIcon
								icon={faAngleDown}
								size="xs"
								className="ml-1.5 transform transition-transform duration-200 group-hover:rotate-180"
							/>
						</div>
						<div className="invisible absolute top-full left-[-12px] mt-2 w-40 bg-[#2c2d2e] backdrop-blur-3xl border border-[#454547] text-white text-sm rounded-lg p-2 shadow-lg opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:visible z-50">
							<Link
								href="/projects"
								className="block px-3 py-2 rounded-lg hover:bg-[#1e1e1e] transition-colors duration-100 ease-in-out"
							>
								Explore Projects
							</Link>
							<Link
								href="/projects/publish"
								className="block px-3 py-2 rounded-lg hover:bg-[#1e1e1e] transition-colors duration-100 ease-in-out"
							>
								Publish Your Own
							</Link>
						</div>
					</div>

					{/* Static Links */}
					<Link
						href="/blog"
						className="hover:text-[#ACACAD] transition-colors duration-200"
					>
						Blog
					</Link>
					<Link
						href="/forum"
						className="hover:text-[#ACACAD] transition-colors duration-200"
					>
						Forum
					</Link>
					<Link
						href="/about"
						className="hover:text-[#ACACAD] transition-colors duration-200"
					>
						About
					</Link>
					<Link
						href="/contact"
						className="hover:text-[#ACACAD] transition-colors duration-200"
					>
						Contact
					</Link>

					<div className="relative backdrop-blur-md rounded-full">
						<input
							type="text"
							placeholder="Search"
							className="bg-[#1C1C20] backdrop-blur-md text-sm text-white placeholder-[#ACACAD] pl-10 pr-5 w-[35ch] py-2 rounded-full border border-[#3A3A3C]/60 focus:outline-none focus:ring-1 focus:ring-[#FFFFFF] transition duration-200"
						/>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth="2"
							stroke="currentColor"
							className="w-4 h-4 text-[#ACACAD] absolute left-3 top-2.5"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
							/>
						</svg>
					</div>

					<div className="relative" ref={languageRef}>
						<button
							onClick={() => setShowLanguageMenu((prev) => !prev)}
							className="flex items-center text-[#FFFFFF]/90 hover:text-white transition cursor-pointer"
						>
							<FontAwesomeIcon icon={faGlobe} size="xl" />
						</button>

						{showLanguageMenu && (
							<div className="absolute top-full left-[-12px] mt-4 w-32 bg-[#2c2d2e] backdrop-blur-3xl border border-[#454547] text-white text-sm rounded-lg p-3 shadow-lg z-50">
								<p className="text-center text-[#FFFFFF]">
									Coming soon...
								</p>
							</div>
						)}
					</div>

					{/* Sign In Button */}
					<motion.div
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.9 }}
					>
						<Link href="/signin">
							<button className="bg-[#27BBFF] text-[#101014] font-medium px-4 py-2 rounded-md cursor-pointer">
								Sign in
							</button>
						</Link>
					</motion.div>
				</nav>
			</div>
		</header>
	);
}
