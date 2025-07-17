'use client';

import {
	faDiscord,
	faGithub,
	faInstagram,
	faLinkedin,
	faTiktok,
	faXTwitter,
	faYoutube,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Footer() {
	return (
		<footer className="bg-[#101014] border-t border-[#2C2C2E] relative w-full py-8 px-8 sm:px-16 lg:px-24">
			<div className="flex flex-col sm:flex-row items-center justify-between space-y-6 sm:space-y-0 text-[#FFFFFF]/70 text-sm max-w-[1700px] mx-auto px-8 sm:px-16">
				{/* Left: Copyright */}
				<p>
					© {new Date().getFullYear()} OhmMade. All rights reserved.
				</p>

				{/* Center: Social Icons */}
				<div className="flex space-x-4 text-lg">
					{[
						{
							href: 'https://www.youtube.com/@OhmMadeOfficial',
							icon: faYoutube,
							label: 'YouTube',
						},
						{
							href: 'https://x.com/teamohmmade',
							icon: faXTwitter,
							label: 'Twitter/X',
						},
						{
							href: 'https://github.com/teamohmmade',
							icon: faGithub,
							label: 'GitHub',
						},
						{
							href: 'https://discord.gg/ohmmade',
							icon: faDiscord,
							label: 'Discord',
						},
						{
							href: 'https://www.linkedin.com/company/ohmmade/',
							icon: faLinkedin,
							label: 'LinkedIn',
						},
						{
							href: 'https://www.instagram.com/ohmmade.ca/',
							icon: faInstagram,
							label: 'Instagram',
						},
						{
							href: 'https://www.tiktok.com/@ohmmadetech',
							icon: faTiktok,
							label: 'TikTok',
						},
					].map((item, idx) => (
						<motion.a
							key={idx}
							href={item.href}
							target="_blank"
							aria-label={item.label}
							whileHover={{ scale: 1.1, color: '#ffffff' }}
							whileTap={{ scale: 0.9 }}
							className="text-[#FFFFFF]/70 ease-in-out"
						>
							<FontAwesomeIcon icon={item.icon} />
						</motion.a>
					))}
				</div>

				{/* Right: Legal Links */}
				<div className="flex space-x-6">
					<Link
						href="/legal/terms"
						className="hover:text-white transition"
					>
						Terms of Service
					</Link>
					<Link
						href="/legal/privacy"
						className="hover:text-white transition"
					>
						Privacy Policy
					</Link>
				</div>
			</div>
		</footer>
	);
}
