import Features from './components/sections/Features';
import Hero from './components/sections/Hero';
import ProjectsSection from './components/sections/ProjectsSection';
import Scrollytelling from './components/sections/Scrollytelling';
import './globals.css';

// Revalidate every 5 minutes for fresh content
export const revalidate = 300;

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
