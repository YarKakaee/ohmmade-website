import React from 'react';
import { Inter_Tight } from 'next/font/google';
import Image from 'next/image';

const interTight = Inter_Tight({ subsets: ['latin'] });

function ExploreProjectsPage() {
	return (
		<div className="relative min-h-screen bg-[#101014] overflow-hidden">
			<section className="relative w-full pt-16 px-8 sm:px-16 lg:px-24">
				<div className="max-w-[1700px] mx-auto px-8 sm:px-16 py-20">
					<h2
						className={`text-[44px] font-black mb-4 text-white leading-tight relative z-10 ${interTight.className}`}
					>
						Explore Projects
					</h2>
					<div className="absolute top-[100px] left-1/2 -translate-x-1/2 z-0 w-full max-w-[1400px]">
						<Image
							src="https://edc-cdn.net/assets/images/bg-header-epic-indies.png"
							alt="Gradient"
							width={1200}
							height={1000}
							className="w-full h-auto opacity-60 blur-[120px] pointer-events-none select-none"
							priority
						/>
					</div>
				</div>
			</section>
		</div>
	);
}

export default ExploreProjectsPage;
