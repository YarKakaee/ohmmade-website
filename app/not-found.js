'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function NotFound() {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	return (
		<section>
			<div className="relative min-h-screen bg-[#101014] overflow-hidden flex items-center justify-center">
				{/* Render Background Gradient Only on Client Side */}
				{isClient && (
					<div className="absolute inset-0 pointer-events-none">
						<div className="absolute w-full sm:w-[800px] md:w-[1000px] lg:w-[1200px] max-w-full left-1/2 -translate-x-1/2 translate-y-1/6 blur-[125px] opacity-70 transform-gpu">
							<Image
								src="https://t4.ftcdn.net/jpg/11/43/68/53/360_F_1143685330_LdED8QWdOpgFzZ20siLHM5upbbUv5wGb.jpg"
								alt="Abstract light pattern"
								width={1200}
								height={1200}
								className="w-full h-auto"
								priority
							/>
						</div>
					</div>
				)}

				{/* Main Content - 404 Section */}
				<div className="text-center max-w-md relative z-10">
					<h1 className="text-7xl font-extrabold text-white">404</h1>
					<p className="text-2xl font-semibold mt-2 text-white">
						PAGE NOT FOUND
					</p>
					<p className="text-sm mt-4 text-[#ACACAD]">
						The page you were looking for was not found. Please
						verify the link/URL or try starting back at our home
						page.
					</p>

					{/* Button to return to Home with animation */}
					<motion.div
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="mt-6"
					>
						<Link href="/">
							<button className="bg-[#27BBFF] text-[#101014] font-medium px-6 py-2 rounded-md transition-colors cursor-pointer">
								Go to Home Page
							</button>
						</Link>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
