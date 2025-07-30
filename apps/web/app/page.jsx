import Features from './components/sections/Features';
import Hero from './components/sections/Hero';
import ProjectsSection from './components/sections/ProjectsSection';
import Scrollytelling from './components/sections/Scrollytelling';
import './globals.css';

// Force dynamic rendering since ProjectsSection uses Prisma
export const dynamic = 'force-dynamic';

export default function Home() {
	return (
		<section>
			<div className="relative min-h-screen bg-[#101014]">
				<Hero />
				<Features />

				<ProjectsSection />

				<Scrollytelling />
			</div>
		</section>
	);
}
