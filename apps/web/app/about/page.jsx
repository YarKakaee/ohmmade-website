'use client';

import { useRef, useEffect, useState } from 'react';
import {
	motion,
	useScroll,
	useTransform,
	AnimatePresence,
	useMotionValue,
	useSpring,
} from 'framer-motion';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faGithub,
	faLinkedin,
	faInstagram,
} from '@fortawesome/free-brands-svg-icons';

// --- Slides Data ---
const slides = [
	{
		key: 'origin',
		type: 'story',
		heading: 'It Started With a Problem',
		description:
			'Too many great electronics projects were going unseen. We built OhmMade to give them the spotlight they deserve.',
		color: '#27BBFF',
		textColor: '#ffffff',
		particleColor: 'rgba(39,187,255,0.7)',
		bgGlow: 'from-[#27BBFF]/60 via-[#101014]/80 to-[#101014]/90',
	},
	{
		key: 'manifesto',
		type: 'manifesto',
		heading: 'We Wanted Something Better',
		description:
			'So we made something real - a space to build, share, and actually be seen.',
		color: '#FFD600',
		textColor: '#ffffff',
		particleColor: 'rgba(255,214,0,0.7)',
		bgGlow: 'from-[#FFD600]/60 via-[#101014]/80 to-[#101014]/90',
	},
	// Team slides...
	{
		key: 'yar',
		type: 'team',
		name: 'Yar',
		title: 'Founder, Head of Engineering',
		bio: '2nd year Software Engineering student at Western who lives for building cool stuff - both hardware and software. Built OhmMade from the ground up and leads all things design and dev.',
		img: '/assets/Yar.jpeg',
		socials: {
			github: 'https://github.com/YarKakaee',
			linkedin: 'https://linkedin.com/in/yar-kakaee',
			instagram: 'https://instagram.com/yar.kakaee',
		},
		color: '#27BBFF',
		textColor: '#ffffff',
		particleColor: 'rgba(39,187,255,0.7)',
		bgGlow: 'from-[#27BBFF]/60 via-[#101014]/80 to-[#101014]/90',
	},
	{
		key: 'tristan',
		type: 'team',
		name: 'Tristan',
		title: 'Co-Founder, Head of Finance & Strategy',
		bio: "Electrical engineering and business at Western + Ivey. He's the strategy guy, making sure OhmMade scales smart and stays sharp.",
		img: '/assets/Tristan.png',
		socials: {
			linkedin: 'https://linkedin.com/in/tristan-biley-81928526a/',
			instagram: 'https://instagram.com/tristan_biley_/',
			github: 'https://github.com/TristanBiley',
		},
		color: '#FFD600',
		textColor: '#ffffff',
		particleColor: 'rgba(255,214,0,0.7)',
		bgGlow: 'from-[#FFD600]/60 via-[#101014]/80 to-[#101014]/90',
	},
	{
		key: 'serkan',
		type: 'team',
		name: 'Serkan',
		title: 'Co-Founder, Head of Hardware & Systems',
		bio: 'Loves turning ideas into working tech. He handles the hardware side - from circuit design to system builds. If it lights up or moves, Serkan is probably behind it.',
		img: '/assets/Serkan.jpeg',
		socials: {
			github: 'https://github.com/serkannur',
			linkedin: 'https://linkedin.com/in/serkan-nur-32710424a/',
			instagram: 'https://instagram.com/_serkannur_/',
		},
		color: '#00C896',
		textColor: '#ffffff',
		particleColor: 'rgba(0,200,150,0.7)',
		bgGlow: 'from-[#00C896]/60 via-[#101014]/80 to-[#101014]/90',
	},
	{
		key: 'andres',
		type: 'team',
		name: 'Andres',
		title: 'Head of Marketing & Outreach',
		bio: "Andres studies finance but thinks like a brand builder. He's the reason more people hear about OhmMade - shaping how we show up, look, and connect. Outreach, vibes, and everything in between.",
		img: '/assets/Andres.jpeg',
		socials: {
			instagram: 'https://instagram.com/ig.andres',
			linkedin: 'https://linkedin.com/in/andresholmes/',
		},
		color: '#FFD600',
		textColor: '#ffffff',
		particleColor: 'rgba(255,214,0,0.7)',
		bgGlow: 'from-[#FFD600]/60 via-[#101014]/80 to-[#101014]/90',
	},
	// CTA
	{
		key: 'cta',
		type: 'cta',
		heading: 'Join Us and Build Something Cool',
		button: { text: 'Start Sharing', link: '/projects/publish' },
		color: '#27BBFF',
		textColor: '#ffffff',
		particleColor: 'rgba(39,187,255,0.7)',
		bgGlow: 'from-[#27BBFF]/60 via-[#101014]/80 to-[#101014]/90',
	},
];

const socialIconMap = {
	github: faGithub,
	linkedin: faLinkedin,
	instagram: faInstagram,
};

function Particles({ color, parallaxY }) {
	const [particles, setParticles] = useState([]);
	useEffect(() => {
		const generated = [...Array(18)].map(() => {
			const size = Math.random() * 4 + 2;
			const left = Math.random() * 100;
			const top = Math.random() * 100;
			const opacity = 0.18 + Math.random() * 0.22;
			const duration = 2.5 + Math.random() * 1.5;
			const delay = Math.random();
			const animateY = Math.random() * 40 - 20;
			const animateX = Math.random() * 40 - 20;
			return {
				size,
				left,
				top,
				opacity,
				duration,
				delay,
				animateY,
				animateX,
			};
		});
		setParticles(generated);
	}, [color]);
	return (
		<div className="absolute inset-0 z-0 pointer-events-none">
			{particles.map((p, i) => (
				<motion.div
					key={i}
					className="absolute rounded-full"
					style={{
						width: `${p.size}px`,
						height: `${p.size}px`,
						background: color,
						left: `${p.left}%`,
						top: `${p.top}%`,
						opacity: p.opacity,
						filter: 'blur(1.5px)',
					}}
					animate={{
						y: [0, p.animateY + (parallaxY || 0), 0],
						x: [0, p.animateX, 0],
						opacity: [p.opacity, p.opacity + 0.1, p.opacity],
					}}
					transition={{
						duration: p.duration,
						repeat: Infinity,
						repeatType: 'loop',
						delay: p.delay,
					}}
				/>
			))}
		</div>
	);
}

// Per-letter heading animation
function AnimatedHeading({ text, progress, className }) {
	return (
		<span className={className + ' inline-block'}>
			{[...text].map((char, i) => (
				<motion.span
					key={i}
					className="inline-block"
					initial={{ opacity: 0, y: 40 }}
					animate={{
						opacity: progress > i / text.length ? 1 : 0,
						y: progress > i / text.length ? 0 : 40,
						rotate: progress > i / text.length ? 0 : 8,
						scale: progress > i / text.length ? 1 : 0.95,
					}}
					transition={{
						delay: i * 0.03,
						duration: 0.5,
						type: 'spring',
						stiffness: 200,
					}}
				>
					{char === ' ' ? '\u00A0' : char}
				</motion.span>
			))}
		</span>
	);
}

// Typewriter effect for manifesto
function Typewriter({ text, className }) {
	const [displayed, setDisplayed] = useState('');
	useEffect(() => {
		setDisplayed('');
		let i = 0;
		const interval = setInterval(() => {
			setDisplayed((prev) => text.slice(0, i + 1));
			i++;
			if (i >= text.length) clearInterval(interval);
		}, 18);
		return () => clearInterval(interval);
	}, [text]);
	return <span className={className}>{displayed}</span>;
}

export default function AboutPage() {
	const containerRef = useRef(null);
	const { scrollYProgress } = useScroll({ target: containerRef });
	const slideCount = slides.length;

	// For background color transition
	const bg = useTransform(
		scrollYProgress,
		slides.map((_, i) => i / (slideCount - 1)),
		slides.map(
			(slide) =>
				`radial-gradient(ellipse at center, ${slide.color}33 0%, #101014 55%)`
		)
	);

	// Parallax for particles and images
	const parallaxY = useTransform(scrollYProgress, [0, 1], [-60, 60]);

	// Calculate current slide index
	const [currentSlide, setCurrentSlide] = useState(0);
	useEffect(() => {
		const unsub = scrollYProgress.on('change', (v) => {
			const idx = Math.min(
				slideCount - 1,
				Math.max(0, Math.floor(v * slideCount))
			);
			setCurrentSlide(idx);
		});
		return () => unsub();
	}, [scrollYProgress, slideCount]);

	const slide = slides[currentSlide];

	// Calculate local progress for the current slide
	const slideStart = currentSlide / slideCount;
	const slideEnd = (currentSlide + 1) / slideCount;
	const rawProgress = useTransform(
		scrollYProgress,
		[slideStart, slideEnd],
		[0, 1]
	);
	const [clampedProgress, setClampedProgress] = useState(0);
	useEffect(() => {
		const unsub = rawProgress.on('change', (v) => {
			if (v < 0.2)
				setClampedProgress(Math.max(0, v * 5)); // Animate in
			else if (v > 0.8)
				setClampedProgress(Math.max(0, (1 - v) * 5)); // Animate out
			else setClampedProgress(1); // Fully visible
		});
		return () => unsub();
	}, [rawProgress]);

	return (
		<div
			ref={containerRef}
			className="relative w-full bg-[#101014]"
			style={{ height: `${slideCount * 100}vh` }}
		>
			{/* Sticky viewport container */}
			<div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
				{/* Background that transitions between colors */}
				<motion.div
					className="absolute inset-0 z-0"
					style={{
						background: bg,
						filter: 'blur(60px)',
						opacity: 1,
					}}
				/>
				{/* Parallax Particles background for all slides */}
				<div className="absolute inset-0 w-full h-full pointer-events-none z-0">
					<Particles
						color={slide.particleColor}
						parallaxY={parallaxY}
					/>
				</div>
				{/* Content container */}
				<div className="relative z-50 w-full h-full flex items-center justify-center">
					<AnimatePresence mode="wait">
						{slide.type === 'story' && (
							<motion.div
								key={slide.key}
								initial={{
									opacity: 0,
									y: 40,
									scale: 0.98,
									rotateY: 20,
								}}
								animate={{
									opacity: 1,
									y: 0,
									scale: 1,
									rotateY: 0,
								}}
								exit={{
									opacity: 0,
									y: -40,
									scale: 0.98,
									rotateY: -20,
								}}
								transition={{
									duration: 0.9,
									ease: 'anticipate',
								}}
								className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl flex flex-col items-center justify-center text-center px-4"
								style={{
									pointerEvents: 'auto',
									color: slide.textColor,
								}}
							>
								<motion.h2
									className="text-4xl sm:text-5xl font-extrabold drop-shadow-lg leading-tight text-white mb-6"
									initial={{ opacity: 0, y: 40 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{
										delay: 0.15,
										duration: 0.7,
										ease: 'anticipate',
									}}
								>
									{slide.heading}
								</motion.h2>
								<motion.p
									className="text-lg md:text-xl mb-10 max-w-xl text-white/90"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{
										delay: 0.3,
										duration: 0.7,
										ease: 'anticipate',
									}}
								>
									{slide.description}
								</motion.p>
							</motion.div>
						)}
						{slide.type === 'manifesto' && (
							<motion.div
								key={slide.key}
								initial={{
									opacity: 0,
									y: 40,
									scale: 0.98,
									rotateY: 20,
								}}
								animate={{
									opacity: 1,
									y: 0,
									scale: 1,
									rotateY: 0,
								}}
								exit={{
									opacity: 0,
									y: -40,
									scale: 0.98,
									rotateY: -20,
								}}
								transition={{
									duration: 0.9,
									ease: 'anticipate',
								}}
								className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl flex flex-col items-center justify-center text-center px-4"
								style={{
									pointerEvents: 'auto',
									color: slide.textColor,
								}}
							>
								<motion.h2
									className="text-4xl sm:text-5xl font-extrabold drop-shadow-lg leading-tight text-white mb-6"
									initial={{ opacity: 0, y: 40 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{
										delay: 0.15,
										duration: 0.7,
										ease: 'anticipate',
									}}
								>
									{slide.heading}
								</motion.h2>
								<Typewriter
									text={slide.description}
									className="text-lg md:text-xl mb-10 max-w-xl block"
								/>
							</motion.div>
						)}
						{slide.type === 'team' && (
							<motion.div
								key={slide.key}
								initial={{
									opacity: 0,
									y: 40,
									scale: 0.98,
									rotateY: 20,
								}}
								animate={{
									opacity: 1,
									y: 0,
									scale: 1,
									rotateY: 0,
								}}
								exit={{
									opacity: 0,
									y: -40,
									scale: 0.98,
									rotateY: -20,
								}}
								transition={{
									duration: 0.9,
									ease: 'anticipate',
								}}
								className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl flex flex-col md:flex-row items-center justify-center px-4"
								style={{
									pointerEvents: 'auto',
									color: slide.textColor,
								}}
							>
								{/* Left: Image with blurred glow */}
								<motion.div
									className="relative w-full md:w-1/2 flex justify-center items-center mb-10 md:mb-0"
									style={{ perspective: 900 }}
								>
									<motion.div
										transition={{
											duration: 1.2,
											ease: 'easeInOut',
											repeat: Infinity,
											repeatType: 'reverse',
										}}
										className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 w-64 h-64 md:w-96 md:h-96 overflow-hidden blur-2xl opacity-60"
										style={{
											filter: 'brightness(1.4) blur(100px)',
										}}
									>
										<Image
											src={slide.img}
											alt={slide.name + ' blurred'}
											fill
											className="object-cover"
										/>
									</motion.div>
									<motion.div
										initial={{
											opacity: 1,
											scale: 1,
											rotateY: 15,
										}}
										transition={{
											duration: 0.7,
											ease: 'anticipate',
										}}
										whileHover={{
											scale: 1.08,
											rotateY: 10,
										}}
										className="relative z-10 w-40 h-40 md:w-90 md:h-90 rounded-2xl overflow-hidden shadow-2xl"
									>
										<Image
											src={slide.img}
											alt={slide.name}
											fill
											className="object-cover"
										/>
									</motion.div>
								</motion.div>
								{/* Right: Text */}
								<motion.div
									initial={{ opacity: 0, x: 60 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{
										duration: 0.7,
										ease: 'anticipate',
									}}
									className="w-full md:w-1/2 px-8 md:px-16 flex flex-col items-center md:items-start text-center md:text-left"
								>
									<h2 className="text-3xl md:text-4xl font-extrabold mb-3 drop-shadow-lg">
										{slide.name}
									</h2>
									<h3 className="text-lg md:text-xl font-semibold mb-4">
										{slide.title}
									</h3>
									<p className="text-white/80 text-base mb-6 max-w-xl">
										{slide.bio}
									</p>
									<div className="flex gap-5 mt-2">
										{Object.entries(slide.socials).map(
											([key, url]) => {
												const icon = socialIconMap[key];
												return (
													<motion.a
														key={key}
														href={url}
														target="_blank"
														rel="noopener noreferrer"
														whileHover={{
															scale: 1.18,
															color: '#27BBFF',
															filter: 'drop-shadow(0 0 8px #27BBFF)',
														}}
														whileTap={{
															scale: 0.95,
														}}
														className="text-white/70 hover:text-[#27BBFF] text-2xl transition-colors"
													>
														<FontAwesomeIcon
															icon={icon}
														/>
													</motion.a>
												);
											}
										)}
									</div>
								</motion.div>
							</motion.div>
						)}
						{slide.type === 'cta' && (
							<motion.div
								key={slide.key}
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.95 }}
								transition={{
									duration: 0.7,
									ease: 'anticipate',
								}}
								className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl flex flex-col items-center justify-center text-center px-4"
								style={{
									pointerEvents: 'auto',
									color: slide.textColor,
								}}
							>
								<motion.h2
									className="text-4xl sm:text-5xl font-extrabold mb-8 drop-shadow-lg leading-tight"
									initial={{ opacity: 0, y: 40 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{
										delay: 0.15,
										duration: 0.7,
										ease: 'anticipate',
									}}
								>
									{slide.heading}
								</motion.h2>
								<motion.a
									href={slide.button.link}
									whileHover={{
										scale: 1.08,
										boxShadow: '0 0 32px #27BBFF',
									}}
									whileTap={{ scale: 0.97 }}
									className="inline-block px-8 py-4 rounded-2xl font-bold text-md bg-[#27BBFF] text-[#101014] shadow-lg transition-all mb-8"
								>
									{slide.button.text}
								</motion.a>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
}
