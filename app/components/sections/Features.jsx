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

const interTight = Inter_Tight({
	subsets: ['latin'],
});

const cardVariants = {
	hidden: { opacity: 0, y: 30, scale: 0.95 },
	show: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: { duration: 0.6, ease: 'easeOut' },
	},
};

const CARD_HEIGHT = 480;
const GLOBAL_MARGIN = 32; // px-8 (adjust if your global margin is different)

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

	// Helper to update scroll button state
	const updateScrollButtons = () => {
		const container = scrollRef.current;
		if (!container) return;
		const scrollLeft = container.scrollLeft;
		const scrollWidth = container.scrollWidth;
		const clientWidth = container.clientWidth;
		const maxScroll = scrollWidth - clientWidth;
		setCanScrollLeft(scrollLeft > 0 + GLOBAL_MARGIN - 1);
		setCanScrollRight(scrollLeft < maxScroll - GLOBAL_MARGIN + 1);
	};

	// Scroll by one card width (plus margin)
	const scrollByCard = (direction) => {
		const container = scrollRef.current;
		if (!container) return;
		const card = container.querySelector('.feature-card');
		if (!card) return;
		const cardWidth = card.offsetWidth + 32; // 32px gap
		const currentScroll = container.scrollLeft;
		const scrollWidth = container.scrollWidth;
		const clientWidth = container.clientWidth;
		const maxScroll = scrollWidth - clientWidth;
		let newScroll = currentScroll + direction * cardWidth;
		// Clamp so first card never goes past left margin, last card never past right margin
		newScroll = Math.max(
			GLOBAL_MARGIN,
			Math.min(newScroll, maxScroll - GLOBAL_MARGIN)
		);
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
	}, []);

	return (
		<section className="relative py-24">
			<div className="w-full relative z-10 px-8">
				{' '}
				{/* px-8 = 32px, matches GLOBAL_MARGIN */}
				<motion.div
					className="text-center mb-16"
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
						Explore Our Core Features.
					</motion.h2>
					<motion.p
						className="text-gray-400 max-w-2xl mx-auto text-[15px]"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.4 }}
						viewport={{ once: true }}
					>
						At OhmMade, every detail is intentional — from how you
						share your work to how others learn from it. These
						aren't just platform features. They're pillars of how we
						empower makers.
					</motion.p>
				</motion.div>
				<div
					className="relative w-full"
					style={{ height: `${CARD_HEIGHT}px` }}
				>
					{/* Masks - absolutely positioned at section edges, top-aligned */}
					<Image
						src="/assets/left-gradient.png"
						alt="Left Blur Mask"
						width={165}
						height={CARD_HEIGHT}
						className="pointer-events-none absolute left-0 top-0 h-full w-[165px] z-30"
						draggable={false}
					/>
					<Image
						src="/assets/right-gradient.png"
						alt="Right Blur Mask"
						width={165}
						height={CARD_HEIGHT}
						className="pointer-events-none absolute right-0 top-0 h-full w-[165px] z-30"
						draggable={false}
					/>

					{/* Scroll Buttons */}
					<button
						aria-label="Scroll left"
						className={`hidden md:flex items-center justify-center absolute left-2 top-1/2 -translate-y-1/2 z-40 w-12 h-12 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full transition-all duration-200 ${
							canScrollLeft
								? 'opacity-100 cursor-pointer'
								: 'opacity-0 pointer-events-none'
						}`}
						onClick={() => scrollByCard(-1)}
						style={{ outline: 'none' }}
					>
						<FontAwesomeIcon
							icon={faChevronLeft}
							className="text-white text-lg"
						/>
					</button>
					<button
						aria-label="Scroll right"
						className={`hidden md:flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 z-40 w-12 h-12 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full transition-all duration-200 ${
							canScrollRight
								? 'opacity-100 cursor-pointer'
								: 'opacity-0 pointer-events-none'
						}`}
						onClick={() => scrollByCard(1)}
						style={{ outline: 'none' }}
					>
						<FontAwesomeIcon
							icon={faChevronRight}
							className="text-white text-lg"
						/>
					</button>

					{/* Cards container with left/right padding for margin */}
					<div
						ref={scrollRef}
						className="flex gap-8 h-full overflow-x-auto overflow-y-hidden scrollbar-hide px-0"
						style={{
							paddingLeft: GLOBAL_MARGIN,
							paddingRight: GLOBAL_MARGIN,
							scrollbarWidth: 'none',
							msOverflowStyle: 'none',
						}}
					>
						{features.map((feature, i) => (
							<motion.div
								key={i}
								variants={cardVariants}
								initial="hidden"
								whileInView="show"
								viewport={{ once: true }}
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
									<h3 className="text-xl md:text-lg text-white mb-2 font-semibold">
										{feature.heading}
									</h3>
									<p className="text-base md:text-base text-white/80 font-light">
										{feature.description}
									</p>
								</div>
							</motion.div>
						))}
					</div>
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
