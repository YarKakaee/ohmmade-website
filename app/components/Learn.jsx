'use client';

import { motion } from 'framer-motion';
import { Inter_Tight } from 'next/font/google';
import LearnCard from './LearnCard';

const interTight = Inter_Tight({
	subsets: ['latin'],
});

// Array for all card details
const cardData = [
	{
		title: 'Basic Electronics',
		image: '/assets/breadboard.png',
		link: '/basic-electronics',
	},
	{
		title: 'Raspberry Pi 4',
		image: '/assets/rp4.png',
		link: '/raspberry-pi-4',
	},
	{
		title: 'Raspberry Pi Pico',
		image: '/assets/rpico.png',
		link: '/raspberry-pi-pico',
	},
	{
		title: 'Arduino UNO',
		image: '/assets/arduinouno.png',
		link: '/arduino-uno',
	},
];

export default function Learn() {
	return (
		<section className="relative w-full py-20 px-8 sm:px-16 lg:px-24">
			<div className="max-w-[1700px] mx-auto px-8 sm:px-16">
				{/* Section Title and Subtitle */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease: 'easeOut' }}
					viewport={{ once: true }}
					className="mb-12"
				>
					<h2
						className={`text-4xl sm:text-5xl font-extrabold text-white leading-tight ${interTight.className}`}
					>
						Begin Your Journey,
						<br />
						<span className="text-[#FFFFFF]">
							One Circuit at a Time.
						</span>
					</h2>
					<p className="text-[#FFFFFF]/70 text-lg mt-4">
						Explore our curated lessons and tutorials designed to
						help you master circuits, coding, and microcontrollers –
						step by step.
					</p>
				</motion.div>

				{/* Card Section */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{cardData.map((card, index) => (
						<LearnCard
							key={index}
							title={card.title}
							image={card.image}
							link={card.link}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
