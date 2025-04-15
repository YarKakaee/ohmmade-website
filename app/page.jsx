import Image from 'next/image';
import ContactUs from './components/ContactUs';
import FeatureSection from './components/FeatureSection';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Learn from './components/Learn';
import OurTeam from './components/OurTeam';
import ProjectsSectionServer from './components/projects/ProjectsSectionServer';
import './globals.css';
import CreatorSection from './components/CreatorSection';
import AboutUs from './components/AboutUs';

export default function Home() {
	return (
		<section>
			<div className="relative min-h-screen bg-[#101014] overflow-hidden">
				{/* Background Gradient already present */}
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

				<AboutUs />
				<OurTeam />
				<Learn />
				<ProjectsSectionServer />
				<CreatorSection />
				<ContactUs />
				<Footer />
			</div>
		</section>
	);
}
