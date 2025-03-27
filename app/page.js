import Image from 'next/image';

export default function Home() {
	return (
		<main className="min-h-screen bg-[#24282B] text-white flex items-center justify-center px-6">
			<div className="max-w-xl text-center space-y-6">
				<Image
					src="/OhmMadeTransparentLogo.png"
					alt="OhmMade Logo"
					width={100}
					height={100}
					className="mx-auto block"
				/>

				<h1 className="text-3xl md:text-4xl font-extrabold">OhmMade</h1>
				<p className="text-lg text-gray-300">
					From Circuits to Code — All in One Place
				</p>

				{/* Coming Soon */}
				<h2 className="text-lg mt-8 text-[#ff7939] font-bold">
					Coming Soon
				</h2>

				<p className="text-sm text-gray-500 mt-8">
					© {new Date().getFullYear()} OhmMade. All rights reserved.
				</p>
			</div>
		</main>
	);
}
