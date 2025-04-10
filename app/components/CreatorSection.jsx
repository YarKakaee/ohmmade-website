// components/CreatorSection.jsx

'use client';

import { motion } from 'framer-motion';
import { Inter_Tight } from 'next/font/google';
import Image from 'next/image';

const interTight = Inter_Tight({ subsets: ['latin'] });

export default function CreatorSection() {
	return (
		<section className="bg-[#0c0c0f] text-white py-24 px-4 md:px-12">
			<div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12">
				{/* Text Content */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
					className="md:w-1/2"
				>
					<h2
						className={`${interTight.className} text-3xl md:text-5xl font-bold mb-6`}
					>
						You’re Not Just Building Circuits. You’re Building Your
						Portfolio.
					</h2>
					<p className="text-gray-400 mb-6 text-lg">
						At OhmMade, every project you publish shapes your
						identity as a builder. With free hosting, your own
						creator profile, and shareable URLs — your work lives
						on, beyond breadboards and browsers.
					</p>

					<ul className="mb-6 text-sm text-gray-300 space-y-2">
						<li>✅ Free hosting for all your projects</li>
						<li>✅ Personalized creator profile page</li>
						<li>✅ Easy-to-share project URLs</li>
					</ul>

					<a
						href="/projects/publish"
						className="inline-block bg-[#ff7939] text-black font-semibold py-3 px-6 rounded-xl shadow hover:scale-105 transition-transform"
					>
						Publish Your First Project
					</a>
				</motion.div>

				{/* Image / Profile Mockup */}
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					whileInView={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					viewport={{ once: true }}
					className="md:w-1/2 flex justify-center"
				>
					<div className="rounded-2xl border border-[#2C2F36] overflow-hidden shadow-xl w-full max-w-md bg-[#1a1c21]">
						<Image
							src="/assets/VisualDemo.png"
							alt="Creator Profile"
							width={700}
							height={500}
							className="w-full object-cover"
						/>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
