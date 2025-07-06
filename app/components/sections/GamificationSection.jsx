'use client';

import { motion } from 'framer-motion';
import LayoutContainer from '../common/LayoutContainer';

const yellow = '#FFD600';

const sectionVariants = {
	hidden: { opacity: 0, y: 60 },
	show: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.8, ease: 'easeOut' },
	},
};

const letters = ['W', 'a', 't', 't', 's'];

const letterVariants = {
	hidden: { opacity: 0, y: 12 },
	visible: (i) => ({
		opacity: 1,
		y: 0,
		transition: {
			delay: i * 0.08,
			duration: 0.5,
			ease: 'easeOut',
		},
	}),
};

export default function GamificationSection() {
	return (
		<motion.section
			initial="hidden"
			whileInView="show"
			viewport={{ once: true, amount: 0.3 }}
			variants={sectionVariants}
			className="relative w-full py-24 px-4 bg-[#101014] overflow-visible"
		>
			{/* Radial Glow Background */}
			<div className="absolute inset-0 z-0 pointer-events-none">
				<div
					className="absolute left-1/2 top-0 -translate-x-1/2 w-[900px] h-[600px] rounded-full"
					style={{
						background:
							'radial-gradient(ellipse at center, #FFD60033 0%, #101014 80%)',
						filter: 'blur(32px)',
						opacity: 0.7,
					}}
				/>
				{/* Animated sparks/particles */}
				{[...Array(18)].map((_, i) => (
					<motion.div
						key={i}
						className="absolute rounded-full"
						style={{
							width: `${Math.random() * 4 + 2}px`,
							height: `${Math.random() * 4 + 2}px`,
							background: yellow,
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
							opacity: 0.18 + Math.random() * 0.22,
							filter: 'blur(1.5px)',
						}}
						animate={{
							y: [0, Math.random() * 40 - 20, 0],
							x: [0, Math.random() * 40 - 20, 0],
							opacity: [0.18, 0.32, 0.18],
						}}
						transition={{
							duration: 2.5 + Math.random() * 1.5,
							repeat: Infinity,
							repeatType: 'loop',
							delay: Math.random(),
						}}
					/>
				))}
			</div>

			<LayoutContainer className="relative z-10 flex flex-col items-center justify-center text-center min-h-[340px]">
				<h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
					Grow Your{' '}
					<span className="inline-flex">
						{letters.map((letter, i) => (
							<motion.span
								key={i}
								custom={i}
								initial="hidden"
								animate="visible"
								variants={letterVariants}
								className="text-[#FFD600] font-extrabold"
								style={{
									textShadow: `
            0 0 8px #FFD600,
            0 0 16px #FFD60099
          `,
									marginRight: letter === 's' ? '0' : '1px',
								}}
							>
								{letter}
							</motion.span>
						))}
						<motion.span
							initial={{ opacity: 0, scale: 0.6 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{
								delay: letters.length * 0.08,
								duration: 0.5,
								ease: 'backOut',
							}}
							className="inline-block ml-1"
						>
							⚡
						</motion.span>
					</span>
				</h2>
				<p className="text-gray-300 text-lg mb-7 max-w-lg mx-auto">
					Make, share, and engage to power up your Watts, unlock
					badges, and climb the leaderboard.
				</p>
				<motion.a
					href="#"
					whileHover={{
						scale: 1.05,
						boxShadow: '0 0 24px #FFD60099',
					}}
					whileTap={{ scale: 0.97 }}
					className="inline-block bg-[#FFD600] text-[#101014] font-bold px-7 py-3 rounded-full shadow-lg transition-all duration-200"
				>
					How Watts Works
				</motion.a>
			</LayoutContainer>
		</motion.section>
	);
}
