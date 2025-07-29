'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Inter_Tight } from 'next/font/google';
import { useEffect, useState } from 'react';
import LayoutContainer from '@ohmmade/ui/layout-container';

const interTight = Inter_Tight({
	subsets: ['latin'],
});

// Animation Variants
const containerVariants = {
	hidden: { opacity: 0, y: 50 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.8, staggerChildren: 0.2 },
	},
};

const fadeInUp = {
	hidden: { opacity: 0, y: 40 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const videoVariants = {
	hidden: { opacity: 0, scale: 0.95 },
	visible: { opacity: 1, scale: 1, transition: { duration: 1, delay: 0.3 } },
};

const blurVariants = {
	hidden: { opacity: 0, scale: 1.1 },
	visible: {
		opacity: 0.6,
		scale: 1,
		transition: { duration: 1, delay: 0.4 },
	},
};

const intoVariant = {
	hidden: { opacity: 0, x: -40 },
	visible: {
		opacity: 1,
		x: 0,
		transition: {
			duration: 0.6,
			delay: 0.2,
			type: 'spring',
			stiffness: 120,
		},
	},
};

const impactVariant = {
	hidden: { opacity: 0, x: 40, scale: 0.95 },
	visible: {
		opacity: 1,
		x: 0,
		scale: 1,
		transition: {
			duration: 0.7,
			delay: 0.5,
			type: 'spring',
			stiffness: 100,
		},
	},
};

const ctaButtonUp1 = {
	hidden: { opacity: 0, y: 80, scale: 1.12 },
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: {
			type: 'spring',
			stiffness: 400,
			damping: 60,
			delay: 0.44,
			mass: 0.7,
		},
	},
};

const ctaButtonUp2 = {
	hidden: { opacity: 0, y: 80, scale: 1.12 },
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: {
			type: 'spring',
			stiffness: 400,
			damping: 60,
			delay: 0.44,
			mass: 0.7,
		},
	},
};

export default function Hero() {
	const [particles, setParticles] = useState([]);
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);

		const createParticle = () => {
			const size = Math.random() * 3 + 1;
			const x = Math.random() * window.innerWidth;
			const y = Math.random() * window.innerHeight;
			const angle = Math.random() * 2 * Math.PI;
			const baseSpeed = Math.random() * 0.7 + 0.2; // 0.2 to 0.9
			const speedX = Math.cos(angle) * baseSpeed;
			const speedY = Math.sin(angle) * baseSpeed;
			const opacity = Math.random() * 0.5 + 0.1;
			const driftPhase = Math.random() * 2 * Math.PI;
			return { x, y, size, speedX, speedY, opacity, driftPhase };
		};

		const initialParticles = Array.from({ length: 50 }, createParticle);
		setParticles(initialParticles);

		const animateParticles = () => {
			setParticles((prevParticles) =>
				prevParticles.map((particle, i) => {
					const drift =
						Math.sin(Date.now() / 1200 + particle.driftPhase) * 0.5;
					let newX = particle.x + particle.speedX + drift;
					let newY = particle.y + particle.speedY + drift;
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

	return (
		<section className="relative w-full min-h-[100vh] flex items-center justify-center overflow-visible sm:overflow-hidden px-2 sm:px-0">
			{/* Mobile max-width constraint matching floating navbar */}

			{/* Star/Particle Background */}
			{isClient &&
				particles.map((particle, index) => (
					<div
						key={index}
						className="absolute rounded-full bg-white pointer-events-none z-0"
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

			{/* Gradient Background Image */}
			<motion.div
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 1, ease: 'easeOut' }}
				className="absolute inset-0 pointer-events-none z-0"
			>
				<div className="absolute w-full sm:w-[800px] md:w-[1000px] lg:w-[1100px] max-w-full left-1/2 -translate-x-1/2 translate-y-1/6 sm:blur-[125px] blur-[80px] opacity-70 transform-gpu mt-38 sm:mt-0">
					<Image
						src="https://ujaylejhopvncyjvduvj.supabase.co/storage/v1/object/public/ohmmade-assets//heroimageohmmade.webp"
						alt="Abstract light pattern"
						width={1200}
						height={1200}
						className="w-full h-auto"
						priority
					/>
				</div>
			</motion.div>

			<LayoutContainer>
				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate="visible"
					className="flex flex-col items-center justify-center w-full relative z-10 text-center"
				>
					<div className="text-white space-y-3 sm:space-y-5 max-w-xl w-full flex flex-col items-center -mt-16 sm:-mt-0">
						<motion.h1
							variants={fadeInUp}
							className={`text-[26px] sm:text-[32px] md:text-[44px] font-[850] leading-tight bg-gradient-to-b from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(39,187,255,0.10)] ${interTight.className}`}
						>
							Turning One-Time Projects
						</motion.h1>

						<motion.h1
							className="text-[32px] sm:text-4xl md:text-[54px] font-[900] leading-tight relative -mt-2 sm:-mt-4 flex flex-wrap justify-center"
							initial="hidden"
							animate="visible"
						>
							<motion.span
								variants={intoVariant}
								className="text-white font-bold mr-1 sm:mr-2"
							>
								Into
							</motion.span>
							<motion.span
								variants={impactVariant}
								className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 relative inline-block"
								style={{ position: 'relative' }}
							>
								<span
									className="absolute inset-x-1 sm:inset-x-2 inset-y-0.5 sm:inset-y-1 bg-gradient-to-r from-purple-400 to-pink-600 blur-xl sm:blur-2xl opacity-50 pointer-events-none -z-10"
									aria-hidden="true"
								/>
								Lifelong Impact.
							</motion.span>
						</motion.h1>

						<motion.p
							className="text-[#FFFFFF]/65 max-w-sm md:max-w-xl font-normal text-[13px] sm:text-[15px] mx-auto flex flex-wrap justify-center px-2 sm:px-0"
							initial="hidden"
							animate="visible"
						>
							{[
								'We',
								'transform',
								'student',
								'and',
								'hobby',
								'projects',
								'into',
								'timeless',
								'guides',
								'that',
								'empower',
								'future',
								'creators',
								'and',
								'help',
								'ideas',
								'live',
								'far',
								'beyond',
								'the',
								'classroom.',
							].map((word, i) => (
								<motion.span
									key={i}
									initial={{
										opacity: 0,
										y: 20,
										filter: 'blur(4px)',
									}}
									animate={{
										opacity: 1,
										y: 0,
										filter: 'blur(0px)',
									}}
									transition={{
										duration: 0.5,
										delay: 0.05 * i,
										ease: 'easeOut',
									}}
									className="mr-0.5 sm:mr-1 inline-block"
								>
									{word}
								</motion.span>
							))}
						</motion.p>

						{/* CTA Buttons with Staggered Animation */}
						<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6 justify-center items-center w-full max-w-sm sm:max-w-none">
							<motion.div
								variants={ctaButtonUp1}
								initial="hidden"
								animate="visible"
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="w-full sm:w-auto"
							>
								<Link
									href="/learn"
									className="relative inline-flex items-center justify-center bg-[#27BBFF] text-[#101014] px-4 sm:px-5 py-3 rounded-md text-sm font-semibold shadow-[0_4px_24px_0_rgba(39,187,255,0.25)] transition-all duration-300 before:absolute before:inset-0 before:rounded-md before:blur before:opacity-50 before:bg-gradient-to-r before:from-[#27BBFF] before:to-[#6EE7FF] before:z-[-1] overflow-hidden w-full sm:w-auto"
								>
									Start Your First Project
								</Link>
							</motion.div>
							<motion.div
								variants={ctaButtonUp2}
								initial="hidden"
								animate="visible"
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="w-full sm:w-auto"
							>
								<Link
									href="/projects"
									className="bg-[#101014]/0 text-[#FFFFFF]/65 px-4 sm:px-5 py-3 border-[#5C5C5E] border-1 rounded-md text-sm font-medium w-full sm:w-auto inline-flex items-center justify-center"
								>
									Explore Community
								</Link>
							</motion.div>
						</div>
					</div>
				</motion.div>
			</LayoutContainer>
		</section>
	);
}
