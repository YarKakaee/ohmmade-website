'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmail, signInWithGoogle } from '@/lib/auth';
import { Inter_Tight } from 'next/font/google';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import Image from 'next/image';

const interTight = Inter_Tight({ subsets: ['latin'] });

export default function SignInPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		const { user, error } = await signInWithEmail(email, password);
		if (error) {
			toast.error(error.message);
		} else {
			toast.success('Signed in!');
			router.push('/');
			router.refresh();
		}
		setLoading(false);
	};

	const handleGoogle = async () => {
		const { error } = await signInWithGoogle();
		if (error) toast.error(error.message);
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
			<div className="bg-[#1C1C1F] p-10 rounded-2xl w-full max-w-md relative z-10 border border-[#2E2E30] shadow-xl">
				<h1
					className={`text-3xl font-extrabold text-white mb-6 ${interTight.className}`}
				>
					Welcome Back
				</h1>

				<form onSubmit={handleSubmit} className="space-y-4">
					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className="w-full bg-[#101014] text-white px-4 py-3 rounded-md border border-[#333] placeholder-[#888] focus:outline-none focus:ring-1 focus:ring-white"
					/>
					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						className="w-full bg-[#101014] text-white px-4 py-3 rounded-md border border-[#333] placeholder-[#888] focus:outline-none focus:ring-1 focus:ring-white"
					/>
					<button
						type="submit"
						disabled={loading}
						className="bg-[#27BBFF] text-[#101014] font-medium px-4 py-3 rounded-md w-full transition hover:brightness-110"
					>
						{loading ? 'Signing In...' : 'Sign In'}
					</button>
				</form>

				<div className="mt-4 text-center">
					<button
						onClick={handleGoogle}
						className="flex items-center justify-center gap-2 w-full bg-white text-black font-medium px-4 py-3 rounded-md transition hover:brightness-95"
					>
						<FontAwesomeIcon icon={faGoogle} />
						<span>Sign in with Google</span>
					</button>
				</div>

				<p className="text-sm text-[#999] mt-6 text-center">
					Don’t have an account?{' '}
					<Link
						href="/signup"
						className="text-[#27BBFF] hover:underline"
					>
						Sign Up
					</Link>
				</p>
			</div>
		</div>
	);
}
