'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Inter_Tight } from 'next/font/google';
import { useEffect, useState } from 'react';
import LayoutContainer from '../common/LayoutContainer';

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
			stiffness: 700,
			damping: 22,
			delay: 0.18,
			mass: 1.2,
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

	useEffect(() => {
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
		<section className="relative w-full min-h-[90vh] flex items-center justify-center mt-10">
			{/* Star/Particle Background */}
			{particles.map((particle, index) => (
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

			<LayoutContainer>
				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate="visible"
					className="flex flex-col items-center justify-center w-full relative z-10 text-center"
				>
					<div className="text-white space-y-5 max-w-xl w-full flex flex-col items-center">
						<motion.h1
							variants={fadeInUp}
							className={`text-4xl sm:text-[44px] font-[850] leading-tight bg-gradient-to-b from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(39,187,255,0.10)] ${interTight.className}`}
						>
							Turning One-Time Projects
						</motion.h1>

						<motion.h1
							className="text-4xl sm:text-[54px] font-[900] leading-tight relative -mt-4 flex flex-wrap justify-center"
							initial="hidden"
							animate="visible"
						>
							<motion.span
								variants={intoVariant}
								className="text-white font-bold mr-2"
							>
								Into
							</motion.span>
							<motion.span
								variants={impactVariant}
								className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 relative inline-block"
								style={{ position: 'relative' }}
							>
								<span
									className="absolute inset-x-2 inset-y-1 bg-gradient-to-r from-purple-400 to-pink-600 blur-2xl opacity-50 pointer-events-none"
									aria-hidden="true"
								/>
								Lifelong Impact.
							</motion.span>
						</motion.h1>

						<motion.p
							className="text-[#FFFFFF]/65 max-w-xl font-normal text-[15px] mx-auto flex flex-wrap justify-center"
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
									className="mr-1 inline-block"
								>
									{word}
								</motion.span>
							))}
						</motion.p>

						{/* CTA Buttons with Staggered Animation */}
						<div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center items-center">
							<motion.div
								variants={ctaButtonUp1}
								initial="hidden"
								animate="visible"
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Link
									href="/learn"
									className="relative inline-flex items-center justify-center bg-[#27BBFF] text-[#101014] px-5 py-3 rounded-md text-sm font-semibold shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#27BBFF]/60 before:absolute before:inset-0 before:rounded-md before:blur-md before:opacity-60 before:bg-gradient-to-r before:from-[#27BBFF] before:to-[#6EE7FF] before:z-[-1] overflow-hidden scale-pulse static-glow"
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
							>
								<Link
									href="/projects"
									className="bg-[#101014]/0 text-[#FFFFFF]/65 px-5 py-3 border-[#5C5C5E] border-1 rounded-md text-sm font-medium"
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
