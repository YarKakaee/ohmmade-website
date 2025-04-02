import Image from 'next/image';
import Hero from './components/Hero';
import OurTeam from './components/OurTeam';
import './globals.css';
import ContactUs from './components/ContactUs';
import Learn from './components/Learn';
import ProjectsSectionServer from './components/projects/ProjectsSectionServer';
import Footer from './components/Footer';

export default function Home() {
	return (
		<section>
			<div className="relative min-h-screen bg-[#101014] overflow-hidden">
				{/* Background Gradient already present */}
				<div className="absolute inset-0 pointer-events-none">
					<div className="absolute w-full sm:w-[800px] md:w-[1000px] lg:w-[1200px] max-w-full left-1/2 -translate-x-1/2 translate-y-1/6 blur-[125px] opacity-70 transform-gpu">
						<Image
							src="https://cms-assets.unrealengine.com/AiKUh5PQCTaOFnmJDZJBfz/oXIAOr5gQny2cAfPpq02"
							alt="Abstract light pattern"
							width={1200}
							height={1200}
							className="w-full h-auto"
							priority
						/>
					</div>
				</div>
				<Hero />
				<OurTeam />
				<Learn />
				<ProjectsSectionServer />
				<ContactUs />
				<Footer />
			</div>
		</section>
	);
}
