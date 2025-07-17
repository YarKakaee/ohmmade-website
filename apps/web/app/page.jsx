import Image from 'next/image';
import Features from './components/sections/Features';
import Hero from './components/sections/Hero';
import ProjectsSection from './components/sections/ProjectsSection';
import Scrollytelling from './components/sections/Scrollytelling';
import './globals.css';

export default function Home() {
	return (
		<section>
			<div className="relative min-h-screen bg-[#101014]">
				<div className="absolute inset-0 pointer-events-none">
					<div className="absolute w-full sm:w-[800px] md:w-[1000px] lg:w-[1200px] max-w-full left-1/2 -translate-x-1/2 translate-y-1/6 blur-[125px] opacity-70 transform-gpu">
						<Image
							src="https://ujaylejhopvncyjvduvj.supabase.co/storage/v1/object/public/ohmmade-assets//heroimageohmmade.webp"
							alt="Abstract light pattern"
							width={1200}
							height={1200}
							className="w-full h-auto"
							priority
						/>
					</div>
				</div>

				<Hero />
				<Features />

				<ProjectsSection />

				<Scrollytelling />
			</div>
		</section>
	);
}
