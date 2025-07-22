'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
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
import LayoutContainer from '@ohmmade/ui/layout-container';
import { useTypewriter } from 'react-simple-typewriter';
import Link from 'next/link';

// --- Slides Data ---
const slides = [
	// Team slides...
	{
		key: 'yar',
		type: 'team',
		name: 'Yar',
		title: 'Founder, Eng. Lead',
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
		title: 'Co-Founder, Finance & Strategy',
		bio: "Electrical engineering and Ivey at Western. He's the strategy guy, making sure OhmMade scales smart and stays sharp.",
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
		title: 'Co-Founder, Hardware & Systems',
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
		title: 'Marketing & Outreach',
		bio: "Studying BMOS at Western, he's the reason more people know about OhmMade - shaping how we show up, look, and connect. From outreach to community, he's all about making sure we're seen and heard.",
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
		heading: 'Welcome to',
		button: { text: 'Start Your First Project', link: '/projects/publish' },
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

// Canvas-based particles for smooth animation
function ManifestoParticles() {
	const canvasRef = useRef(null);
	const animationRef = useRef();
	const particlesRef = useRef([]);

	// Helper to create a single particle
	const createParticle = () => {
		const size = Math.random() * 1.5 + 1; // 1 to 2.5 px
		const x = Math.random() * window.innerWidth;
		const y = Math.random() * window.innerHeight;
		const angle = Math.random() * 2 * Math.PI;
		const baseSpeed = Math.random() * 0.7 + 0.2;
		const speedX = Math.cos(angle) * baseSpeed;
		const speedY = Math.sin(angle) * baseSpeed;
		const opacity = Math.random() * 0.5 + 0.1;
		const driftPhase = Math.random() * 2 * Math.PI;
		return { x, y, size, speedX, speedY, opacity, driftPhase };
	};

	// Resize canvas to fill parent
	const resizeCanvas = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	};

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		resizeCanvas();
		window.addEventListener('resize', resizeCanvas);

		// Initialize particles
		particlesRef.current = Array.from({ length: 10 }, createParticle);

		const draw = () => {
			const ctx = canvas.getContext('2d');
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			const now = Date.now();
			for (let i = 0; i < particlesRef.current.length; i++) {
				let p = particlesRef.current[i];
				const drift = Math.sin(now / 1200 + p.driftPhase) * 0.5;
				p.x += p.speedX + drift;
				p.y += p.speedY + drift;
				if (p.x < 0) p.x = canvas.width;
				if (p.x > canvas.width) p.x = 0;
				if (p.y < 0) p.y = canvas.height;
				if (p.y > canvas.height) p.y = 0;
				ctx.save();
				ctx.globalAlpha = p.opacity;
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.size, 0, 2 * Math.PI);
				ctx.fillStyle = '#fff';
				ctx.shadowColor = '#fff';
				ctx.shadowBlur = 6;
				ctx.fill();
				ctx.restore();
			}
			animationRef.current = requestAnimationFrame(draw);
		};
		animationRef.current = requestAnimationFrame(draw);

		return () => {
			window.removeEventListener('resize', resizeCanvas);
			if (animationRef.current)
				cancelAnimationFrame(animationRef.current);
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			className="absolute inset-0 w-full h-full pointer-events-none z-0"
			style={{ display: 'block' }}
		/>
	);
}

// Add this helper for staggered animation
const fadeInUp = {
	hidden: { opacity: 0, y: 40 },
	visible: (i = 1) => ({
		opacity: 1,
		y: 0,
		transition: {
			delay: i * 0.12,
			duration: 0.7,
			type: 'spring',
			stiffness: 120,
		},
	}),
};

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

// Written content component
function WrittenContent() {
	// Custom typewriter effect for 'nowhere.'
	const [typed, setTyped] = useState('');
	useEffect(() => {
		const full = 'nowhere.';
		let i = 0;
		setTyped('');
		const interval = setInterval(() => {
			setTyped(full.slice(0, i + 1));
			i++;
			if (i >= full.length) clearInterval(interval);
		}, 65);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="bg-[#101014] text-white">
			{/* Hero section - full height with just the first line */}
			<section className="h-screen bg-[#101014] text-white flex items-center justify-center px-6 relative overflow-hidden z-10">
				<motion.div
					className="absolute inset-0 z-0"
					style={{
						background:
							'radial-gradient(ellipse at center, #CC00FF32 0%, #101014 50%)',
						filter: 'blur(60px)',
						opacity: 1,
					}}
				/>
				<div className="absolute inset-0 w-full h-full pointer-events-none z-0">
					<ManifestoParticles />
				</div>
				<div className="relative z-10 max-w-2xl mx-auto text-center">
					<motion.h1
						initial={{ opacity: 0, y: 40 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.9,
							type: 'spring',
							stiffness: 100,
						}}
						className="text-4xl md:text-4xl lg:text-5xl font-bold text-white leading-tight"
					>
						We were tired of seeing projects go{' '}
						<span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 relative inline-block">
							<span
								className="absolute inset-x-2 inset-y-1 bg-gradient-to-r from-purple-400 to-pink-600 blur-2xl opacity-50 pointer-events-none"
								aria-hidden="true"
							/>
							{typed}

							<style jsx>{`
								@keyframes blink {
									0%,
									50% {
										opacity: 1;
									}
									51%,
									100% {
										opacity: 0;
									}
								}
							`}</style>
						</span>
					</motion.h1>
				</div>
			</section>

			{/* Rest of the written content */}
			<section className="bg-[#101014] text-white py-20 px-0">
				<LayoutContainer>
					<div className="max-w-5xl mx-auto">
						<motion.div
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, amount: 0.3 }}
							className="space-y-16 text-left"
						>
							{/* Manifesto pill */}
							<motion.div
								variants={fadeInUp}
								custom={0}
								className="inline-block px-3 py-1 rounded-xl border border-[#333333] bg-[#1A1A1E] text-[#BBBBBB] text-sm font-medium mt-10"
							>
								/ MANIFESTO
							</motion.div>

							{/* Opening Statement */}
							<motion.p
								variants={fadeInUp}
								custom={1}
								className="text-lg text-white/80 leading-relaxed"
							>
								Every year, students spend months building
								something real. Circuits. Sensors. Code. Guts.
								Grit. All of it.
							</motion.p>

							{/* The Problem */}
							<div className="space-y-6">
								<motion.p
									variants={fadeInUp}
									custom={2}
									className="text-lg text-white/80 leading-relaxed"
								>
									They stay up late, debug, redesign, test
									again. They present it. Maybe post it. Then
									it disappears.
								</motion.p>
								<motion.p
									variants={fadeInUp}
									custom={3}
									className="text-lg text-white/80 leading-relaxed"
								>
									The prototype gets boxed. The files get
									lost. And the work? Forgotten.
								</motion.p>
								<motion.p
									variants={fadeInUp}
									custom={4}
									className="text-lg text-white/80 leading-relaxed"
								>
									That's how it's always been.{' '}
									<span className="bg-[#27BBFF] px-2 py-1 rounded font-semibold text-[#101014]">
										Build, Present, then Vanish.
									</span>{' '}
									Next year, the cycle starts over.
								</motion.p>
							</div>

							{/* Breaking the Cycle */}
							<motion.p
								variants={fadeInUp}
								custom={5}
								className="text-lg text-white/80 leading-relaxed flex items-center gap-2"
							>
								We built{' '}
								<Image
									src="/assets/OMLogoBanner.png"
									alt="OhmMade Logo Banner"
									width={114}
									height={120}
									className="object-contain drop-shadow-lg mb-1"
									priority
								/>
								to break that cycle.
							</motion.p>
							<motion.h2
								variants={fadeInUp}
								custom={6}
								className="text-2xl font-bold text-white leading-tight"
							>
								Because what you built is bigger than a grade.
							</motion.h2>

							{/* Main Manifesto */}
							<div className="space-y-8">
								<div className="space-y-6">
									<motion.p
										variants={fadeInUp}
										custom={7}
										className="text-lg text-white/80 leading-relaxed"
									>
										This platform is for the{' '}
										<span className="bg-[#27BBFF] px-2 py-1 rounded font-semibold text-[#101014]">
											builders
										</span>{' '}
										— the ones who spent 4 months wiring a
										solution that no one else saw.
									</motion.p>
									<motion.p
										variants={fadeInUp}
										custom={8}
										className="text-lg text-white/80 leading-relaxed"
									>
										It's for that first-year team who built
										a laser tripwire and had nowhere to
										actually share how it worked.
									</motion.p>
									<motion.p
										variants={fadeInUp}
										custom={9}
										className="text-lg text-white/80 leading-relaxed"
									>
										It's for the engineering labs, the class
										competitions, the ideas that only exist
										on a PDF now.
									</motion.p>
									<motion.p
										variants={fadeInUp}
										custom={10}
										className="text-lg text-white/80 leading-relaxed"
									>
										We're here to give those projects a
										proper home. To let students{' '}
										<span className="bg-[#27BBFF] px-2 py-1 rounded font-semibold text-[#101014]">
											publish, showcase, and inspire
										</span>{' '}
										— not just present and forget.
									</motion.p>
								</div>
							</div>

							{/* Closing Statement */}
							<div className="space-y-6 pt-4">
								<motion.p
									variants={fadeInUp}
									custom={11}
									className="text-lg text-white/80 leading-relaxed"
								>
									No more demo-day black holes. No more
									brilliant ideas buried in shared drives.
								</motion.p>
								<motion.p
									variants={fadeInUp}
									custom={12}
									className="text-lg text-white/80 leading-relaxed"
								>
									No more "what if we actually built this?"
									You already did. Now show the world.
								</motion.p>
							</div>
						</motion.div>
					</div>
				</LayoutContainer>
			</section>
		</div>
	);
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
		<div className="bg-[#101014]">
			{/* Written content section */}
			<WrittenContent />

			{/* Scrollytelling section */}
			<div
				ref={containerRef}
				className="relative w-full"
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
						<ManifestoParticles />
					</div>
					{/* Content container */}
					<div className="relative z-50 w-full h-full flex items-center justify-center">
						<AnimatePresence mode="wait">
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
											className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 w-64 h-64 md:w-80 md:h-80 overflow-hidden blur-2xl opacity-60"
											style={{
												filter: 'brightness(1) blur(80px)',
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
										<h3 className="text-lg font-medium mb-4 text-white/70">
											{slide.title}
										</h3>
										<p className="text-white/80 text-base mb-6 max-w-xl">
											{slide.bio}
										</p>
										<div className="flex gap-5 mt-2">
											{Object.entries(slide.socials).map(
												([key, url]) => {
													const icon =
														socialIconMap[key];
													return (
														<motion.a
															key={key}
															href={url}
															target="_blank"
															rel="noopener noreferrer"
															whileHover={{
																scale: 1.18,
															}}
															whileTap={{
																scale: 0.95,
															}}
															className="text-white/70 hover:text-white text-2xl transition-colors"
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
										className="text-2xl font-medium mb-4 drop-shadow-lg text-white/90"
										initial={{ opacity: 0, y: 40 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{
											delay: 0.1,
											duration: 0.7,
											ease: 'anticipate',
										}}
									>
										{slide.heading}
									</motion.h2>
									<motion.div
										initial={{ opacity: 0, scale: 0.7 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{
											delay: 0.35,
											duration: 0.7,
											type: 'spring',
											stiffness: 180,
										}}
										className="mb-8"
									>
										<Image
											src="/assets/OMLogoBanner.png"
											alt="OhmMade Logo Banner"
											width={380}
											height={120}
											className="object-contain drop-shadow-lg"
											priority
										/>
									</motion.div>
									<motion.div
										className="flex gap-4 mt-4"
										initial={{ opacity: 0, y: 30 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{
											delay: 0.7,
											duration: 0.7,
											ease: 'anticipate',
										}}
									>
										<motion.div
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
										>
											<Link
												href={slide.button.link}
												className="relative inline-flex items-center justify-center bg-[#27BBFF] text-[#101014] px-5 py-3 rounded-md text-sm font-semibold shadow-[0_4px_24px_0_rgba(39,187,255,0.25)] transition-all duration-300  before:absolute before:inset-0 before:rounded-md before:blur before:opacity-50 before:bg-gradient-to-r before:from-[#27BBFF] before:to-[#6EE7FF] before:z-[-1] overflow-hidden"
											>
												{slide.button.text}
											</Link>
										</motion.div>
										<motion.div
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
										>
											<Link
												href="/projects"
												className="relative inline-flex items-center justify-center bg-[#101014]/0 text-[#FFFFFF]/65 px-5 py-3 border-[#5C5C5E] border-1 rounded-md text-sm font-medium"
											>
												Explore Community
											</Link>
										</motion.div>
									</motion.div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</div>
			</div>
		</div>
	);
}
