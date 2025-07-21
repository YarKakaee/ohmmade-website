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
import { faArrowDown, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LayoutContainer from '@ohmmade/ui/layout-container';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
	const currentYear = new Date().getFullYear();

	const platformLinks = [
		{ name: 'Explore Projects', href: '/projects' },
		{ name: 'Submit a Project', href: '/projects/publish' },
		{
			name: 'Publishing Rules',
			href: 'https://support.ohmmade.ca/articles/publishing-guidelines',
		},
	];

	const communityLinks = [
		{ name: 'Help Center', href: 'https://support.ohmmade.ca' },
		{ name: 'Contact Us', href: 'mailto:help@ohmmade.ca' },
		{
			name: 'Profile Guidelines',
			href: 'https://support.ohmmade.ca/articles/profile-guidelines',
		},
		{
			name: 'Watts & Leveling',
			href: 'https://support.ohmmade.ca/articles/watts-and-leveling',
		},
	];

	const legalLinks = [
		{ name: 'Terms of Use', href: '/legal/terms' },
		{ name: 'Privacy Policy', href: '/legal/privacy' },
	];

	const socialLinks = [
		{
			name: 'YouTube',
			href: 'https://www.youtube.com/@OhmMadeOfficial',
			icon: faYoutube,
		},
		{
			name: 'Twitter',
			href: 'https://x.com/teamohmmade',
			icon: faXTwitter,
		},
		{
			name: 'GitHub',
			href: 'https://github.com/teamohmmade',
			icon: faGithub,
		},
		{
			name: 'Discord',
			href: 'https://discord.gg/ohmmade',
			icon: faDiscord,
		},
		{
			name: 'LinkedIn',
			href: 'https://www.linkedin.com/company/ohmmade/',
			icon: faLinkedin,
		},
		{
			name: 'Instagram',
			href: 'https://www.instagram.com/ohmmade.ca/',
			icon: faInstagram,
		},
		{
			name: 'TikTok',
			href: 'https://www.tiktok.com/@ohmmadetech',
			icon: faTiktok,
		},
	];

	return (
		<footer className="bg-[#101014] border-t border-white/10">
			<LayoutContainer>
				<div className="py-12">
					{/* Main Footer Content */}
					<div className="flex flex-col lg:flex-row justify-between gap-8 mb-8">
						{/* Left: Logo and Company Info */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
							className="space-y-4"
						>
							{/* Logo */}
							<div className="flex items-center gap-3">
								<Image
									src="/assets/OMLogoBanner.png"
									alt="OhmMade Logo"
									width={762}
									height={160}
									className="h-8 w-auto"
								/>
							</div>

							{/* Tagline */}
							<p className="text-white/70 text-sm max-w-xs">
								A community-powered platform for building,
								publishing, and exploring electronics projects.
							</p>

							{/* Social Media Links */}
							<div className="flex gap-3 mb-10">
								{socialLinks.map((item, idx) => (
									<motion.a
										key={idx}
										href={item.href}
										target="_blank"
										aria-label={item.label}
										whileHover={{
											scale: 1.1,
											color: '#ffffff',
										}}
										whileTap={{ scale: 0.9 }}
										className="text-white/50 ease-in-out"
									>
										<FontAwesomeIcon icon={item.icon} />
									</motion.a>
								))}
							</div>

							{/* System Status */}
							<div className="flex bg-[#1C1C20] items-center gap-2 border border-white/5 rounded-full px-3 py-1.5 w-fit">
								<div className="relative">
									<div className="w-2 h-2 bg-[#35AC47] rounded-full animate-ping absolute"></div>
									<div className="w-2 h-2 bg-[#35AC47] rounded-full relative"></div>
								</div>
								<span className="text-white/60 text-xs font-medium">
									All systems online
								</span>
							</div>
						</motion.div>

						{/* Right: Navigation Columns */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-32">
							{/* Platform */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.1 }}
								className="space-y-3"
							>
								<h3 className="text-white/90 font-semibold text-sm uppercase tracking-wider">
									Platform
								</h3>
								<ul className="space-y-2">
									{platformLinks.map((link, index) => (
										<motion.li
											key={link.name}
											initial={{ opacity: 0, x: -10 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{
												duration: 0.3,
												delay: 0.2 + index * 0.05,
											}}
										>
											<Link
												href={link.href}
												className="text-white/60 hover:text-white transition-colors duration-200 text-sm"
											>
												{link.name}
											</Link>
										</motion.li>
									))}
								</ul>
							</motion.div>

							{/* Community */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.2 }}
								className="space-y-3"
							>
								<h3 className="text-white/90 font-semibold text-sm uppercase tracking-wider">
									Community
								</h3>
								<ul className="space-y-2">
									{communityLinks.map((link, index) => (
										<motion.li
											key={link.name}
											initial={{ opacity: 0, x: -10 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{
												duration: 0.3,
												delay: 0.3 + index * 0.05,
											}}
										>
											<Link
												href={link.href}
												className="text-white/60 hover:text-white transition-colors duration-200 text-sm"
											>
												{link.name}
											</Link>
										</motion.li>
									))}
								</ul>
							</motion.div>

							{/* Legal */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.3 }}
								className="space-y-3"
							>
								<h3 className="text-white/90 font-semibold text-sm uppercase tracking-wider">
									Legal
								</h3>
								<ul className="space-y-2">
									{legalLinks.map((link, index) => (
										<motion.li
											key={link.name}
											initial={{ opacity: 0, x: -10 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{
												duration: 0.3,
												delay: 0.4 + index * 0.05,
											}}
										>
											<Link
												href={link.href}
												className="text-white/60 hover:text-white transition-colors duration-200 text-sm"
											>
												{link.name}
											</Link>
										</motion.li>
									))}
								</ul>
							</motion.div>
						</div>
					</div>

					{/* Divider */}
					<div className="border-t border-white/10 mb-6" />

					{/* Bottom Section */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.4 }}
						className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0"
					>
						{/* Copyright */}
						<p className="text-white/50 text-sm">
							© {currentYear} OhmMade. All rights reserved.
						</p>

						{/* Brand Assets Download */}
						<a
							href="/brand-assets.zip"
							className="flex items-center gap-2 text-white/50 hover:text-white transition-colors duration-200 text-sm"
						>
							<FontAwesomeIcon
								icon={faArrowDown}
								className="w-4 h-4"
							/>
							Download OhmMade brand (.zip)
						</a>

						{/* Contact Email */}
						<a
							href="mailto:help@ohmmade.ca"
							className="flex items-center gap-2 text-white/50 hover:text-white transition-colors duration-200 text-sm"
						>
							<FontAwesomeIcon
								icon={faEnvelope}
								className="w-4 h-4"
							/>
							help@ohmmade.ca
						</a>
					</motion.div>
				</div>
			</LayoutContainer>
		</footer>
	);
}
