'use client'; // For Next.js App Router with client components

import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

export default function Nav() {
	return (
		<header className="bg-[#101014]/40 w-full fixed top-0 left-0 z-50">
			<div className="mx-auto max-w-[1700px] px-8 sm:px-16 h-18 flex items-center justify-between">
				{/* Left Section: Logo */}
				<div className="flex items-center space-x-2">
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
				</div>

				{/* Right Section: Nav Links + Sign In Button */}
				<nav className="flex items-center space-x-6 text-white font-normal text-sm">
					{/* Individual Links with Hover Effect */}
					<Link
						href="/"
						className="transition-colors duration-200 hover:text-[#ACACAD]"
					>
						Home
					</Link>

					{/* Learn (Dropdown) */}
					<div className="relative group">
						{/* Trigger Area */}
						<div className="px-2 py-2 flex items-center cursor-pointer transition-colors duration-200 hover:text-[#ACACAD]">
							<span>Learn</span>
							<FontAwesomeIcon
								icon={faAngleDown}
								size="xs"
								className="ml-1 transform transition-transform duration-200 group-hover:rotate-180"
							/>
						</div>
						{/* Dropdown Menu */}
						<div className="invisible absolute top-full left-[-12px] mt-2 w-45 bg-[#2c2d2e]/40 border border-[#454547] text-white text-sm rounded-lg p-2 shadow-lg opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:visible z-50">
							<Link
								href="/unrealengine"
								className="block px-3 py-2 rounded-lg transition-colors duration-100 ease-in-out hover:bg-[#454547]"
							>
								Basic Electronics
							</Link>
							<Link
								href="/features"
								className="block px-3 py-2 rounded-lg transition-colors duration-100 ease-in-out hover:bg-[#454547]"
							>
								Arduino UNO
							</Link>
							<Link
								href="/licensing"
								className="block px-3 py-2 rounded-lg transition-colors duration-100 ease-in-out hover:bg-[#454547]"
							>
								Raspberry Pi 4
							</Link>
							<Link
								href="/faq"
								className="block px-3 py-2 rounded-lg transition-colors duration-100 ease-in-out hover:bg-[#454547]"
							>
								Raspberry Pi Pico W
							</Link>
						</div>
					</div>

					{/* Projects (Dropdown) */}
					<div className="relative group">
						{/* Trigger Area */}
						<div className="px-2 py-2 flex items-center cursor-pointer transition-colors duration-200 hover:text-[#ACACAD]">
							<span>Projects</span>
							<FontAwesomeIcon
								icon={faAngleDown}
								size="xs"
								className="ml-1 transform transition-transform duration-200 group-hover:rotate-180"
							/>
						</div>
						{/* Dropdown Menu (Same as Learn) */}
						<div className="invisible absolute top-full left-[-12px] mt-2 w-40 bg-[#2c2d2e]/40 border border-[#454547] text-white text-sm rounded-lg p-2 shadow-lg opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:visible z-50">
							<Link
								href="/sample1"
								className="block px-3 py-2 rounded-lg transition-colors duration-100 ease-in-out hover:bg-[#454547]"
							>
								Explore Projects
							</Link>
							<Link
								href="/sample2"
								className="block px-3 py-2 rounded-lg transition-colors duration-100 ease-in-out hover:bg-[#454547]"
							>
								Publish Your Own
							</Link>
						</div>
					</div>

					{/* Static Links */}
					<Link
						href="/blog"
						className="transition-colors duration-200 hover:text-[#ACACAD]"
					>
						Blog
					</Link>
					<Link
						href="/forum"
						className="transition-colors duration-200 hover:text-[#ACACAD]"
					>
						Forum
					</Link>
					<Link
						href="/about"
						className="transition-colors duration-200 hover:text-[#ACACAD]"
					>
						About
					</Link>
					<Link
						href="/contact"
						className="transition-colors duration-200 hover:text-[#ACACAD]"
					>
						Contact
					</Link>

					{/* Sign In Button */}
					<Link href="/signin">
						<button className="bg-[#27BBFF] text-[#101014] font-medium px-4 py-2 rounded-md hover:bg-[#72D3FF] transition-colors cursor-pointer">
							Sign in
						</button>
					</Link>
				</nav>
			</div>
		</header>
	);
}
