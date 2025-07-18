'use client';

import { motion } from 'framer-motion';
import React from 'react';
import { Inter_Tight } from 'next/font/google';
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import {
	faChevronLeft,
	faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LayoutContainer from '@ohmmade/ui/layout-container';

const interTight = Inter_Tight({
	subsets: ['latin'],
});

const cardVariants = {
	hidden: { opacity: 0, y: 30, scale: 0.95 },
	show: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: { duration: 0.38, ease: 'easeOut' },
	},
};

const containerVariants = {
	hidden: {},
	show: {
		transition: {
			staggerChildren: 0.35,
		},
	},
};

const CARD_HEIGHT = 500;
const MAX_W_7XL = 1280; // px for Tailwind's max-w-7xl
const CARD_GAP = 32;

// CSS for hover zone functionality
const hoverStyles = `
	.hover-zone-left:hover ~ button[aria-label="Scroll left"].can-scroll-left {
		opacity: 1 !important;
	}
	.hover-zone-right:hover ~ button[aria-label="Scroll right"].can-scroll-right {
		opacity: 1 !important;
	}
	button[aria-label="Scroll left"].can-scroll-left:hover {
		opacity: 1 !important;
	}
	button[aria-label="Scroll right"].can-scroll-right:hover {
		opacity: 1 !important;
	}
`;

export default function Features() {
	const features = [
		{
			image: '/assets/publish-container.png',
			heading: 'Publish & Showcase Projects',
			description:
				'Turn one-time builds into polished, shareable tutorials that inspire.',
			aspect: 4 / 5,
		},
		{
			image: '/assets/profile-container.png',
			heading: 'Personal Profiles & Creative Identity',
			description:
				'Showcase your projects, share your story, and connect with other makers. Build a profile that highlights your skills and inspires your audience — all in one place.',
			aspect: 16 / 9,
		},
		{
			image: '/assets/project-container.png',
			heading: 'Learn & Build Faster',
			description:
				"Access real-world projects and improve by seeing exactly what worked — and what didn't.",
			aspect: 4 / 3,
		},
	];

	const scrollRef = useRef(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(true);
	const [sideMargin, setSideMargin] = useState(0);
	const [maxScroll, setMaxScroll] = useState(0);

	// Calculate side margin for virtual max-w-7xl
	useEffect(() => {
		const calcMargin = () => {
			const w = document.documentElement.clientWidth;
			setSideMargin(w > MAX_W_7XL ? (w - MAX_W_7XL) / 2 : 0);
		};
		calcMargin();
		window.addEventListener('resize', calcMargin);
		return () => window.removeEventListener('resize', calcMargin);
	}, []);

	// Calculate max scroll so last card stops at virtual max-w-7xl right margin
	useEffect(() => {
		const container = scrollRef.current;
		if (!container) return;
		// Calculate total width of all cards (including gaps)
		const cardEls = container.querySelectorAll('.feature-card');
		let totalCardsWidth = 0;
		cardEls.forEach((el, i) => {
			totalCardsWidth += el.offsetWidth;
			if (i < cardEls.length - 1) totalCardsWidth += CARD_GAP;
		});
		// The visible area is document.documentElement.clientWidth (accounts for scrollbar)
		// The max scroll is when the last card's left edge is at the right virtual margin
		const maxScrollValue = Math.max(
			0,
			totalCardsWidth +
				sideMargin * 2 -
				document.documentElement.clientWidth
		);
		setMaxScroll(maxScrollValue);
	}, [sideMargin, features.length]);

	// Helper to update scroll button state
	const updateScrollButtons = () => {
		const container = scrollRef.current;
		if (!container) return;
		const scrollLeft = container.scrollLeft;
		setCanScrollLeft(scrollLeft > 0);
		setCanScrollRight(scrollLeft < maxScroll - 1);
	};

	// Scroll by one card width (plus margin)
	const scrollByCard = (direction) => {
		const container = scrollRef.current;
		if (!container) return;
		const card = container.querySelector('.feature-card');
		if (!card) return;
		const cardWidth = card.offsetWidth + CARD_GAP;
		const currentScroll = container.scrollLeft;
		let newScroll = currentScroll + direction * cardWidth;
		// Clamp so first card can go under left mask, last card can go under right mask but not past virtual margin
		newScroll = Math.max(0, Math.min(newScroll, maxScroll));
		container.scrollTo({ left: newScroll, behavior: 'smooth' });
		setTimeout(updateScrollButtons, 350);
	};

	useEffect(() => {
		const container = scrollRef.current;
		if (!container) return;
		updateScrollButtons();
		container.addEventListener('scroll', updateScrollButtons);
		const handleResize = () => setTimeout(updateScrollButtons, 100);
		window.addEventListener('resize', handleResize);
		return () => {
			container.removeEventListener('scroll', updateScrollButtons);
			window.removeEventListener('resize', handleResize);
		};
	}, [maxScroll]);

	return (
		<section className="relative py-24">
			<style dangerouslySetInnerHTML={{ __html: hoverStyles }} />
			{/* Masks - stretch to max-w-7xl boundary */}
			{sideMargin > 0 && (
				<>
					{/* Left mask */}
					<div
						className="pointer-events-none absolute top-0 left-0 h-full z-20"
						style={{
							width: sideMargin,
							height: '100%',
							background:
								'linear-gradient(to right, #101014 20%, rgba(16,16,20,0.7) 60%, rgba(16,16,20,0.0) 100%)',
						}}
					/>
					{/* Right mask */}
					<div
						className="pointer-events-none absolute top-0 right-0 h-full z-20"
						style={{
							width: sideMargin,
							height: '100%',
							background:
								'linear-gradient(to left, #101014 20%, rgba(16,16,20,0.7) 60%, rgba(16,16,20,0.0) 100%)',
						}}
					/>
				</>
			)}
			<div className="w-full relative">
				{/* Title Section */}
				<LayoutContainer>
					<motion.div
						className="mb-10"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
					>
						<motion.h2
							className={`${interTight.className} text-3xl md:text-[38px] font-extrabold text-white mb-4`}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							viewport={{ once: true }}
						>
							Our Core Features
						</motion.h2>
						<motion.p
							className="text-gray-400 max-w-2xl text-[15px]"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.4 }}
							viewport={{ once: true }}
						>
							Every detail is intentional — from how you share
							your work to how others learn from it. These aren't
							just platform features. They're pillars of how we
							empower makers.
						</motion.p>
					</motion.div>
				</LayoutContainer>
				{/* Features Row with Scroll Buttons and Cards */}
				<div
					className="relative w-full"
					style={{ height: `${CARD_HEIGHT}px` }}
				>
					{/* Left Hover Zone */}
					<div className="absolute left-0 top-0 w-32 lg:w-96 h-full z-20 pointer-events-auto hover-zone-left"></div>

					{/* Right Hover Zone */}
					<div className="absolute right-0 top-0 w-32 lg:w-96 h-full z-20 pointer-events-auto hover-zone-right"></div>

					{/* Left Scroll Button (hover only) */}
					<motion.button
						aria-label="Scroll left"
						className={`hidden md:flex items-center justify-center absolute left-8 top-1/2 -translate-y-1/2 z-[100] w-12 h-12 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full border border-white/10 transition-opacity duration-300 cursor-pointer
							${canScrollLeft ? 'opacity-0 can-scroll-left' : 'opacity-0 pointer-events-none'}
						`}
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.95 }}
						transition={{
							type: 'spring',
							stiffness: 400,
							damping: 17,
						}}
						style={{ outline: 'none' }}
						onClick={() => scrollByCard(-1)}
					>
						<FontAwesomeIcon
							icon={faChevronLeft}
							className="text-white text-lg"
						/>
					</motion.button>
					{/* Right Scroll Button (hover only) */}
					<motion.button
						aria-label="Scroll right"
						className={`hidden md:flex items-center justify-center absolute right-8 top-1/2 -translate-y-1/2 z-[100] w-12 h-12 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full border border-white/10 transition-opacity duration-300 cursor-pointer
							${
								canScrollRight
									? 'opacity-0 can-scroll-right'
									: 'opacity-0 pointer-events-none'
							}
						`}
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.95 }}
						transition={{
							type: 'spring',
							stiffness: 400,
							damping: 17,
						}}
						style={{ outline: 'none' }}
						onClick={() => scrollByCard(1)}
					>
						<FontAwesomeIcon
							icon={faChevronRight}
							className="text-white text-lg"
						/>
					</motion.button>
					{/* Cards container, dynamic left/right padding for virtual max-w-7xl */}
					<motion.div
						ref={scrollRef}
						className="flex gap-8 h-full overflow-x-auto overflow-y-hidden scrollbar-hide w-full"
						style={{
							paddingLeft: sideMargin,
							paddingRight: sideMargin,
							scrollbarWidth: 'none',
							msOverflowStyle: 'none',
						}}
						variants={containerVariants}
						initial="hidden"
						whileInView="show"
						viewport={{ once: true }}
					>
						{features.map((feature, i) => (
							<motion.div
								key={i}
								variants={cardVariants}
								className="feature-card relative rounded-2xl border border-[#2C2F36] shadow-2xl overflow-hidden flex-shrink-0 flex flex-col justify-end"
								style={{
									height: `${CARD_HEIGHT}px`,
									width: `${CARD_HEIGHT * feature.aspect}px`,
									minWidth: `${
										CARD_HEIGHT * feature.aspect
									}px`,
								}}
							>
								<div className="absolute inset-0 w-full h-full">
									<Image
										src={feature.image}
										alt={feature.heading}
										fill
										className="object-cover object-left-top w-full h-full"
										draggable={false}
									/>
								</div>
								<div
									className="relative z-10 p-6 md:px-8 md:py-8 flex flex-col items-start justify-end"
									style={{
										textShadow:
											'0 2px 8px rgba(0,0,0,0.45)',
									}}
								>
									<h3 className="text-xl md:text-base text-white mb-2 font-semibold">
										{feature.heading}
									</h3>
									<p className="text-base md:text-sm text-white/80 font-light">
										{feature.description}
									</p>
								</div>
							</motion.div>
						))}
					</motion.div>
				</div>
			</div>
			<style jsx>{`
				.scrollbar-hide::-webkit-scrollbar {
					display: none;
				}
			`}</style>
		</section>
	);
}
