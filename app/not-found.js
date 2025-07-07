'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
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
				<div className="text-center max-w-xl relative z-10">
					<div className="inline-block bg-[#101014]/70 backdrop-blur border border-[#3A3A3C]/60 rounded-xl px-4 py-1 shadow-2xl mb-3">
						<h1 className="text-lg font-bold text-white">404</h1>
					</div>
					<p className="text-5xl font-extrabold mt-2 text-white mb-5">
						Couldn't find that page.
					</p>
					<p className="text-sm mt-4 text-white/70 max-w-md mx-auto">
						The page you were looking for was not found. Please
						verify the link/URL or try starting back at our{' '}
						<Link href="/" className="text-[#27BBFF]">
							homepage
						</Link>
						.
					</p>
				</div>
			</div>
		</section>
	);
}
