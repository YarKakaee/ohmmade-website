'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faUser,
	faEnvelope,
	faLock,
	faEye,
	faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';
import { supabase } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function SignUpPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [name, setName] = useState('');
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const nameInputRef = useRef(null);
	const router = useRouter();

	useEffect(() => {
		// Check if user is already signed in and redirect if they are
		const checkSession = async () => {
			const { data } = await supabase.auth.getSession();
			if (data.session) {
				router.push('/');
				return;
			}
			nameInputRef.current?.focus();
		};

		checkSession();
	}, [router]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		toast.dismiss();

		try {
			// Check if email exists
			const checkResponse = await fetch('/api/auth/check-email', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email }),
			});

			const { exists } = await checkResponse.json();

			if (exists) {
				toast.error(
					'An account with this email already exists. Please sign in instead.'
				);
				setLoading(false);
				return;
			}

			// Create account
			const { data, error: signUpError } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: {
						name: name,
						display_name: name,
					},
				},
			});

			if (signUpError) throw signUpError;

			// Handle success
			if (data.user) {
				// Create user in Prisma
				const createUserResponse = await fetch(
					'/api/auth/create-user',
					{
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ email, name }),
					}
				);

				if (!createUserResponse.ok) {
					const errorData = await createUserResponse.json();
					throw new Error(
						errorData.error || 'Failed to create user profile'
					);
				}

				// Check if email confirmation is required by looking at the session
				// If there's no session, email confirmation is required
				if (!data.session) {
					toast.success(
						'Account created! Please check your email to confirm your account.'
					);
					setTimeout(() => router.push('/signin'), 3000);
				} else {
					// If we have a session, the user is already confirmed
					toast.success('Account created successfully!');
					router.push('/');
				}
			}
		} catch (err) {
			console.error('Sign up error:', err);
			toast.error(err.message || 'Failed to create account.');
			setLoading(false);
		}
	};

	const handleGoogleSignIn = async () => {
		setLoading(true);
		toast.dismiss();

		try {
			const { error: oauthError } = await supabase.auth.signInWithOAuth({
				provider: 'google',
				options: {
					redirectTo: `${window.location.origin}/auth/callback`,
				},
			});
			if (oauthError) throw oauthError;
		} catch (err) {
			console.error('Google sign in error:', err);
			toast.error(err.message || 'Failed to sign up with Google.');
			setLoading(false);
		}
	};

	return (
		<div className="bg-[#101014] min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
			<motion.div
				className="w-full max-w-[480px] z-10"
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<div className="bg-[#1C1C20] rounded-2xl p-8 border border-[#3A3A3C]/60 shadow-xl">
					<div className="flex flex-col items-center mb-6 mt-4">
						<div className="flex items-center justify-center gap-2">
							<img
								src="https://ujaylejhopvncyjvduvj.supabase.co/storage/v1/object/public/ohmmade-assets//Frame%205%20(3).png"
								alt="OhmMade Logo"
								className="w-9 mb-4"
							/>
							<h1 className="text-3xl font-extrabold text-white mb-2">
								OhmMade
							</h1>
						</div>
						<h2 className="text-[20px] font-semibold text-white mb-2 mt-2">
							Let's Get You Started 🚀
						</h2>
						<p className="text-[#FFFFFF]/60 text-[15px]">
							Sign up and start building.
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<label className="block text-sm font-medium text-[#ACACAD]">
								Full Name
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<FontAwesomeIcon
										icon={faUser}
										className="text-[#ACACAD]"
									/>
								</div>
								<input
									ref={nameInputRef}
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="w-full pl-10 pr-4 py-2 bg-[#2c2d2e] border border-[#3A3A3C]/60 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#27BBFF] focus:border-transparent placeholder:text-sm"
									placeholder="Enter your full name"
									required
									disabled={loading}
								/>
							</div>
						</div>

						<div className="space-y-2">
							<label className="block text-sm font-medium text-[#ACACAD]">
								Email
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<FontAwesomeIcon
										icon={faEnvelope}
										className="text-[#ACACAD]"
									/>
								</div>
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-full pl-10 pr-4 py-2 bg-[#2c2d2e] border border-[#3A3A3C]/60 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#27BBFF] focus:border-transparent placeholder:text-sm"
									placeholder="Enter your email"
									required
									disabled={loading}
								/>
							</div>
						</div>

						<div className="space-y-2">
							<label className="block text-sm font-medium text-[#ACACAD]">
								Password
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<FontAwesomeIcon
										icon={faLock}
										className="text-[#ACACAD]"
									/>
								</div>
								<input
									type={showPassword ? 'text' : 'password'}
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									className="w-full pl-10 pr-10 py-2 bg-[#2c2d2e] border border-[#3A3A3C]/60 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#27BBFF] focus:border-transparent placeholder:text-sm"
									placeholder="Create a password"
									required
									disabled={loading}
								/>
								<div className="absolute inset-y-0 right-0 pr-3 flex items-center">
									<button
										type="button"
										onClick={() =>
											setShowPassword(!showPassword)
										}
										className="text-[#ACACAD] hover:text-white/80 text-sm cursor-pointer"
										disabled={loading}
									>
										<FontAwesomeIcon
											icon={
												showPassword
													? faEyeSlash
													: faEye
											}
										/>
									</button>
								</div>
							</div>
						</div>

						<motion.button
							type="submit"
							disabled={loading}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className="cursor-pointer w-full bg-[#27BBFF] text-[#101014] font-semibold py-2.5 px-4 rounded-lg hover:bg-[#1ea8e6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? 'Creating Account...' : 'Create Account'}
						</motion.button>

						<div className="relative pt-2 pb-1">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-[#3A3A3C]/60"></div>
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-2 bg-[#1C1C20] text-[#ACACAD]">
									or
								</span>
							</div>
						</div>

						<motion.button
							type="button"
							onClick={handleGoogleSignIn}
							disabled={loading}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className="cursor-pointer w-full flex items-center justify-center gap-2 bg-[#2c2d2e] text-white font-medium py-2.5 px-4 rounded-lg border border-[#3A3A3C]/60 hover:bg-[#3A3A3C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<svg
								width="18"
								height="18"
								viewBox="0 0 18 18"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
									fill="#4285f4"
								/>
								<path
									d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
									fill="#34a853"
								/>
								<path
									d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
									fill="#fbbc05"
								/>
								<path
									d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
									fill="#ea4335"
								/>
							</svg>
							Continue with Google
						</motion.button>
					</form>

					<div className="mt-6 text-center">
						<p className="text-[#ACACAD] text-xs mt-4">
							By proceeding, you agree to our{' '}
							<Link
								href="/tos"
								className="text-white hover:text-white/80 cursor-pointer relative group"
							>
								Terms
								<span className="absolute -bottom-0.5 left-0 w-full h-[1px] bg-white/60 opacity-0 group-hover:opacity-100" />
							</Link>{' '}
							and{' '}
							<Link
								href="/privacy-policy"
								className="text-white hover:text-white/80 cursor-pointer relative group"
							>
								Privacy
								<span className="absolute -bottom-0.5 left-0 w-full h-[1px] bg-white/60 opacity-0 group-hover:opacity-100" />
							</Link>
						</p>

						<p className="text-[#ACACAD] text-sm mt-3">
							Already have an account?{' '}
							<Link
								href="/signin"
								className="text-white hover:text-white/80 cursor-pointer relative group"
							>
								Sign in
								<span className="absolute -bottom-0.5 left-0 w-full h-[1px] bg-white/60 opacity-0 group-hover:opacity-100" />
							</Link>
						</p>
					</div>
				</div>
			</motion.div>
		</div>
	);
}
