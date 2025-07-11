'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import {
	motion,
	useScroll,
	useTransform,
	AnimatePresence,
} from 'framer-motion';
import Link from 'next/link';

const slides = [
	{
		key: 'share',
		color: '#27BBFF',
		textColor: '#101014',
		heading: 'Showcase Your Creations',
		description:
			'Share your builds, tell your story, and inspire makers around the globe to start creating.',
		button: { text: 'Start Sharing', link: '/projects/publish' },
		particleColor: 'rgba(39,187,255,0.7)',
	},
	{
		key: 'explore',
		color: '#4F2683',
		textColor: '#FFFFFF',
		heading: 'Discover Real Projects',
		description:
			'Explore authentic student and hobbyist projects. Break them down, learn how they work, and spark your own ideas.',
		button: { text: 'Browse Projects', link: '/projects' },
		particleColor: 'rgba(155,89,182,0.7)',
	},
	{
		key: 'watts',
		color: '#FFD600',
		textColor: '#101014',
		heading: 'Earn Your Watts',
		description:
			'Build, share, and engage to earn Watts, unlock unique badges, and rise through the ranks — from Newbie to Grandmaster.',
		button: { text: 'Learn About Watts', link: '/help/watts-and-leveling' },
		particleColor: 'rgba(255,214,0,0.7)',
	},
	{
		key: 'connect',
		color: '#00C896',
		textColor: '#101014',
		heading: 'Connect & Collaborate',
		description:
			'Find your people, join discussions, and team up on projects that push your creativity further.',
		button: { text: 'Join the Community', link: '/projects' },
		particleColor: 'rgba(0,200,150,0.7)',
	},
	{
		key: 'featured',
		color: '#FF4F81',
		textColor: '#101014',
		heading: 'Be Featured',
		description:
			'Publish your projects and get a chance to be showcased on our homepage and inspire the entire community.',
		button: { text: 'Submit Your Project', link: '/projects/publish' },
		particleColor: 'rgba(255,79,129,0.7)',
	},
];

function Particles({ color }) {
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
	}, []);

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
						y: [0, p.animateY, 0],
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

export default function Scrollytelling() {
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
				{/* Particles background for all slides */}
				<div className="absolute inset-0 w-full h-full pointer-events-none z-0">
					<Particles color={slide.particleColor} />
				</div>
				{/* Content container */}
				<div className="relative z-50 w-full h-full flex items-center justify-center">
					<AnimatePresence mode="wait">
						<motion.div
							key={slide.key}
							initial={{ opacity: 0, y: 40 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -40 }}
							transition={{ duration: 0.5, ease: 'easeOut' }}
							className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl flex flex-col items-center justify-center text-center px-4"
							style={{ pointerEvents: 'auto' }}
						>
							<motion.h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-white drop-shadow-lg leading-tight">
								{slide.heading}
							</motion.h2>
							<motion.p className="text-base sm:text-lg md:text-lg mb-10 text-gray-300 max-w-xl">
								{slide.description}
							</motion.p>
							<motion.a
								href={slide.button.link}
								className={`px-8 py-4 rounded-full font-bold text-[16px] backdrop-blur transition shadow-lg cursor-pointer`}
								style={{
									background: slide.color,
									color: slide.textColor,
									boxShadow: `0 0 24px 6px ${slide.color}66, 0 0 0 0 ${slide.color}00`,
								}}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.96 }}
							>
								{slide.button.text}
							</motion.a>
						</motion.div>
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
}
