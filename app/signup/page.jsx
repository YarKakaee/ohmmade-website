'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Inter_Tight } from 'next/font/google';
import { signUpWithEmail } from '@/lib/auth';
import Image from 'next/image';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

const interTight = Inter_Tight({ subsets: ['latin'] });

export default function SignUpPage() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [displayName, setDisplayName] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		const { user, error } = await signUpWithEmail(
			email,
			password,
			displayName
		);

		if (error) {
			toast.error(error.message);
		} else {
			toast.success('Check your email to confirm your account!');
			router.push('/signin');
		}

		setLoading(false);
	};

	return (
		<div className="bg-[#101014] min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
			<Toaster position="top-right" />
			{/* Background Blur */}
			<div className="absolute inset-0 pointer-events-none">
				<div className="absolute w-full sm:w-[800px] md:w-[1000px] lg:w-[1200px] max-w-full left-1/2 -translate-x-1/2 translate-y-1/6 blur-[125px] opacity-70 transform-gpu">
					<Image
						src="https://cms-assets.unrealengine.com/AiKUh5PQCTaOFnmJDZJBfz/oXIAOr5gQny2cAfPpq02"
						alt="Light effect"
						width={1200}
						height={1200}
						className="w-full h-auto"
						priority
					/>
				</div>
			</div>

			<div className="bg-[#1C1C1F] p-10 rounded-xl max-w-md w-full relative z-10 border border-[#2E2E30]">
				<h1
					className={`text-3xl font-extrabold text-white mb-6 ${interTight.className}`}
				>
					Create an Account
				</h1>

				<form onSubmit={handleSubmit} className="space-y-4">
					<input
						type="text"
						value={displayName}
						onChange={(e) => setDisplayName(e.target.value)}
						placeholder="Display Name"
						required
						className="w-full bg-[#101014] text-white px-4 py-3 rounded-md border border-[#333] placeholder-[#888] focus:outline-none focus:ring-1 focus:ring-white"
					/>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Email"
						required
						className="w-full bg-[#101014] text-white px-4 py-3 rounded-md border border-[#333] placeholder-[#888] focus:outline-none focus:ring-1 focus:ring-white"
					/>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Password"
						required
						className="w-full bg-[#101014] text-white px-4 py-3 rounded-md border border-[#333] placeholder-[#888] focus:outline-none focus:ring-1 focus:ring-white"
					/>
					<button
						type="submit"
						disabled={loading}
						className="bg-[#27BBFF] text-[#101014] font-medium px-4 py-3 rounded-md w-full transition hover:brightness-110"
					>
						{loading ? 'Creating Account...' : 'Sign Up'}
					</button>
				</form>

				<p className="text-sm text-[#999] mt-4 text-center">
					Already have an account?{' '}
					<Link
						href="/signin"
						className="text-[#27BBFF] hover:underline"
					>
						Sign In
					</Link>
				</p>
			</div>
		</div>
	);
}
