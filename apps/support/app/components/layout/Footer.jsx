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
import LayoutContainer from '@ohmmade/ui/layout-container';

export default function Footer() {
	return (
		<footer className="bg-[#101014] border-t border-[#2C2C2E] w-full py-8">
			<LayoutContainer>
				<div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-[#FFFFFF]/70">
					{/* Left: Copyright */}
					<p className="text-white/60 md:text-left text-center w-full md:w-auto">
						© {new Date().getFullYear()} OhmMade. All rights
						reserved.
					</p>

					{/* Center: Social Icons */}
					<div className="flex space-x-4 text-lg justify-center w-full md:w-auto">
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
								className="text-white/60 ease-in-out"
							>
								<FontAwesomeIcon icon={item.icon} />
							</motion.a>
						))}
					</div>

					{/* Right: Legal Links */}
					<div className="flex space-x-6 justify-center w-full md:w-auto">
						<Link
							href="/legal/terms"
							className="hover:text-white transition-colors"
						>
							Terms of Service
						</Link>
						<Link
							href="/legal/privacy"
							className="hover:text-white transition-colors"
						>
							Privacy Policy
						</Link>
					</div>
				</div>
			</LayoutContainer>
		</footer>
	);
}
