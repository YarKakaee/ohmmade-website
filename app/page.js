import Image from 'next/image';
import { Inter_Tight } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faGithub,
	faInstagram,
	faLinkedin,
	faTiktok,
	faXTwitter,
	faYoutube,
} from '@fortawesome/free-brands-svg-icons';
import Nav from './components/Nav';

const interTight = Inter_Tight({
	subsets: ['latin'],
});

export default function Home() {
	return (
		<section>
			<div className="relative min-h-screen bg-[#101014] overflow-hidden">
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
				<Nav></Nav>
				<div className="bg-[#101014] h-96"></div>
				<div className="bg-[#101014] h-96"></div>
				<div className="bg-[#101014] h-96"></div>
				<div className="bg-[#101014] h-96"></div>
			</div>
		</section>
	);
}
