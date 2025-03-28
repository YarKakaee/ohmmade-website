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

const interTight = Inter_Tight({
	subsets: ['latin'],
});

export default function Home() {
	return (
		<section>
			<div className="relative min-h-screen bg-[#101014]">
				<div className="absolute inset-0 pointer-events-none">
					<div className="absolute w-[1200px] left-1/2 -translate-x-1/2 translate-y-1/6 blur-[125px] opacity-70 transform-gpu">
						<Image
							src="https://cms-assets.unrealengine.com/AiKUh5PQCTaOFnmJDZJBfz/oXIAOr5gQny2cAfPpq02"
							alt="Abstract light pattern"
							width={1200}
							height={1200}
							priority
						/>
					</div>
				</div>
				<div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white space-y-8">
					<Image
						src="/assets/OMLogo2.png"
						alt="OhmMade Logo"
						width={80}
						height={80}
						priority
					/>
					<h1
						className={`text-3xl font-extrabold ${interTight.className}`}
					>
						OhmMade
					</h1>
					<h1
						className={`text-2xl sm:text-3xl md:text-4xl font-black ${interTight.className}`}
					>
						From Circuits to Code - All in One Place.
					</h1>
					<div className="bg-[#27BBFF] text-[#101014] px-5 py-3 rounded-md text-sm font-medium">
						Coming Soon
					</div>
					<p className="text-sm text-gray-500 mt-2">
						© {new Date().getFullYear()} OhmMade. All rights
						reserved.
					</p>
					<div className="flex space-x-5">
						<Link
							href="https://www.youtube.com/@OhmMadeTechs"
							passHref
						>
							<FontAwesomeIcon
								icon={faYoutube}
								size="xl"
								style={{ color: '#ffffff' }}
								className="transition-transform duration-300 ease-in-out hover:scale-110"
							/>
						</Link>
						<Link href="https://x.com/OhmMade94739" passHref>
							<FontAwesomeIcon
								icon={faXTwitter}
								size="xl"
								style={{ color: '#ffffff' }}
								className="transition-transform duration-300 ease-in-out hover:scale-110"
							/>
						</Link>
						<Link href="https://github.com/OhmMadeTech" passHref>
							<FontAwesomeIcon
								icon={faGithub}
								size="xl"
								style={{ color: '#ffffff' }}
								className="transition-transform duration-300 ease-in-out hover:scale-110"
							/>
						</Link>
						<Link
							href="https://www.linkedin.com/company/ohmmade/"
							passHref
						>
							<FontAwesomeIcon
								icon={faLinkedin}
								size="xl"
								style={{ color: '#ffffff' }}
								className="transition-transform duration-300 ease-in-out hover:scale-110"
							/>
						</Link>
						<Link
							href="https://www.instagram.com/ohmmade.ca/"
							passHref
						>
							<FontAwesomeIcon
								icon={faInstagram}
								size="xl"
								style={{ color: '#ffffff' }}
								className="transition-transform duration-300 ease-in-out hover:scale-110"
							/>
						</Link>
						<Link
							href="https://www.tiktok.com/@ohmmadetech"
							passHref
						>
							<FontAwesomeIcon
								icon={faTiktok}
								size="xl"
								style={{ color: '#ffffff' }}
								className="transition-transform duration-300 ease-in-out hover:scale-110"
							/>
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
