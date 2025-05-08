'use client';

import Image from 'next/image';
import { Inter_Tight } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faGithub,
	faInstagram,
	faLinkedin,
	faTiktok,
	faXTwitter,
	faYoutube,
} from '@fortawesome/free-brands-svg-icons';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const interTight = Inter_Tight({
	subsets: ['latin'],
});

export default function Home() {
	const [particles, setParticles] = useState([]);

	useEffect(() => {
		const createParticle = () => {
			const size = Math.random() * 3 + 1;
			const x = Math.random() * window.innerWidth;
			const y = Math.random() * window.innerHeight;
			const speedX = (Math.random() - 0.5) * 0.5;
			const speedY = (Math.random() - 0.5) * 0.5;
			const opacity = Math.random() * 0.5 + 0.1;

			return { x, y, size, speedX, speedY, opacity };
		};

		const initialParticles = Array.from({ length: 50 }, createParticle);
		setParticles(initialParticles);

		const animateParticles = () => {
			setParticles((prevParticles) =>
				prevParticles.map((particle) => {
					let newX = particle.x + particle.speedX;
					let newY = particle.y + particle.speedY;

					if (newX < 0) newX = window.innerWidth;
					if (newX > window.innerWidth) newX = 0;
					if (newY < 0) newY = window.innerHeight;
					if (newY > window.innerHeight) newY = 0;

					return { ...particle, x: newX, y: newY };
				})
			);
		};

		const interval = setInterval(animateParticles, 50);
		return () => clearInterval(interval);
	}, []);

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
				delayChildren: 0.3,
			},
		},
	};

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: {
				duration: 0.5,
				ease: [0.6, -0.05, 0.01, 0.99],
			},
		},
	};

	const logoVariants = {
		hidden: { scale: 0.8, opacity: 0 },
		visible: {
			scale: 1,
			opacity: 1,
			transition: {
				duration: 0.8,
				ease: [0.6, -0.05, 0.01, 0.99],
			},
		},
	};

	const socialIconVariants = {
		hidden: { scale: 0, opacity: 0 },
		visible: (i) => ({
			scale: 1,
			opacity: 1,
			transition: {
				delay: 0.5 + i * 0.1,
				duration: 0.5,
				ease: [0.6, -0.05, 0.01, 0.99],
			},
		}),
	};

	return (
		<section>
			<div className="relative min-h-screen bg-[#101014] overflow-hidden">
				{/* Particles */}
				{particles.map((particle, index) => (
					<div
						key={index}
						className="absolute rounded-full bg-white pointer-events-none"
						style={{
							left: `${particle.x}px`,
							top: `${particle.y}px`,
							width: `${particle.size}px`,
							height: `${particle.size}px`,
							opacity: particle.opacity,
							transform: 'translate(-50%, -50%)',
						}}
					/>
				))}

				{/* Gradient Background */}
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 0.7, scale: 1 }}
					transition={{ duration: 1, ease: 'easeOut' }}
					className="absolute inset-0 pointer-events-none"
				>
					<div className="absolute w-full sm:w-[800px] md:w-[1000px] lg:w-[1200px] max-w-full left-1/2 -translate-x-1/2 translate-y-1/6 blur-[125px] opacity-70 transform-gpu animate-pulse">
						<Image
							src="https://cms-assets.unrealengine.com/AiKUh5PQCTaOFnmJDZJBfz/oXIAOr5gQny2cAfPpq02"
							alt="Abstract light pattern"
							width={1200}
							height={1200}
							className="w-full h-auto"
							priority
						/>
					</div>
				</motion.div>

				{/* Main Content Layer */}
				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate="visible"
					className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white space-y-8"
				>
					<motion.div
						variants={logoVariants}
						className="flex items-center space-x-3 group relative"
					>
						<Image
							src="/OMLogoDark.png"
							alt="OhmMade Logo"
							width={56}
							height={56}
							className="object-contain mb-3 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12"
							priority
						/>
						<span className="text-white font-extrabold text-[52px] bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 relative">
							OhmMade
						</span>
					</motion.div>

					<motion.h1
						variants={itemVariants}
						className="text-2xl text-center font-light tracking-wide relative"
					>
						Launching{' '}
						<span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 relative">
							<span className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-600 blur-xl opacity-50" />
							Q3 2025
						</span>
					</motion.h1>

					<motion.p
						variants={itemVariants}
						className="text-sm text-gray-400 mt-2 text-center tracking-wide"
					>
						© {new Date().getFullYear()} OhmMade. All rights
						reserved.
					</motion.p>

					{/* Social Media Icons */}
					<motion.div
						variants={containerVariants}
						className="flex space-x-6"
					>
						{[
							{
								icon: faYoutube,
								href: 'https://www.youtube.com/@OhmMadeOfficial',
							},
							{
								icon: faXTwitter,
								href: 'https://x.com/teamohmmade',
							},
							{
								icon: faGithub,
								href: 'https://github.com/teamohmmade',
							},
							{
								icon: faLinkedin,
								href: 'https://www.linkedin.com/company/ohmmade/',
							},
							{
								icon: faInstagram,
								href: 'https://www.instagram.com/ohmmade.ca/',
							},
							{
								icon: faTiktok,
								href: 'https://www.tiktok.com/@ohmmadetech',
							},
						].map((social, index) => (
							<motion.div
								key={index}
								custom={index}
								variants={socialIconVariants}
							>
								<Link
									href={social.href}
									passHref
									className="group relative"
								>
									<div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-150" />
									<FontAwesomeIcon
										icon={social.icon}
										size="lg"
										className="text-gray-400 transition-all duration-500 ease-in-out group-hover:text-white group-hover:scale-110 group-hover:rotate-12 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
									/>
								</Link>
							</motion.div>
						))}
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}
