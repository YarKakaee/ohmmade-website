'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faEnvelope,
	faLock,
	faEye,
	faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';
import { supabase } from '@/lib/supabaseClient'; // Use direct Supabase client
import { motion } from 'framer-motion'; // Keep some motion

// Define a constant toast ID outside the component
const REDIRECT_TOAST_ID = 'auth-redirect-toast';

export default function SignInPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	// Keep error state for displaying inline errors if needed, use toast for general errors
	const [error, setError] = useState(null);
	const [showPassword, setShowPassword] = useState(false);
	const emailInputRef = useRef(null);
	const toastShown = useRef(false);
	const router = useRouter();

	useEffect(() => {
		// Check if user is already signed in and redirect if they are
		const checkSession = async () => {
			const { data } = await supabase.auth.getSession();
			if (data.session) {
				// User is already signed in, redirect with query param
				router.push('/?fromAuth=signin');
				return;
			}
			// Only focus if user is not signed in
			emailInputRef.current?.focus();
		};

		checkSession();
	}, [router]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		toast.dismiss();

		try {
			const { error: signInError, data } =
				await supabase.auth.signInWithPassword({
					email,
					password,
				});
			if (signInError) throw signInError;

			// Check if the user has a username and create one if not
			try {
				const user = data.user;
				// Call our API to ensure the user has a username
				const usernameRes = await fetch('/api/auth/username', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						name:
							user.user_metadata?.name ||
							user.email?.split('@')[0],
					}),
				});

				if (!usernameRes.ok) {
					console.warn(
						'Warning: Username check failed:',
						await usernameRes.text()
					);
					// Continue anyway - non-critical
				}
			} catch (usernameError) {
				console.error('Username setup error:', usernameError);
				// Continue anyway - this is a non-critical enhancement
			}

			toast.success('Signed in successfully!');
			router.push('/'); // Redirect to homepage
			router.refresh(); // Refresh server components if needed
		} catch (err) {
			console.error('Sign in error:', err);
			const errorMessage = err.message || 'An unknown error occurred.';
			setError(errorMessage); // Set inline error state
			toast.error(errorMessage); // Show toast error
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleSignIn = async () => {
		setLoading(true);
		setError(null);
		toast.dismiss();

		try {
			const { error: oauthError } = await supabase.auth.signInWithOAuth({
				provider: 'google',
				options: {
					redirectTo: `${window.location.origin}/auth/callback`,
				},
			});
			// Note: Redirect happens externally for OAuth, no push needed here
			if (oauthError) throw oauthError;
		} catch (err) {
			console.error('Google sign in error:', err);
			const errorMessage =
				err.message || 'Failed to sign in with Google.';
			setError(errorMessage);
			toast.error(errorMessage);
			setLoading(false); // Ensure loading stops if OAuth call fails immediately
		}
		// setLoading(false) might not be reached if redirect occurs
	};

	return (
		<div className="bg-[#101014] min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
			{/* Background Blur - Optional: keep or remove */}
			<div className="absolute inset-0 pointer-events-none">
				<div className="absolute w-full sm:w-[800px] md:w-[1000px] lg:w-[1200px] max-w-full left-1/2 -translate-x-1/2 translate-y-1/6 blur-[125px] opacity-70 transform-gpu">
					{/* You can reuse the Image component if desired */}
				</div>
			</div>

			{/* Adapted AuthModal UI */}
			<motion.div
				className="w-full max-w-[480px] z-10"
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<div className="bg-[#1C1C20] rounded-2xl p-8 border border-[#3A3A3C]/60 shadow-xl">
					<div className="flex flex-col items-center mb-6 mt-4">
						<div className="flex items-center justify-center gap-2">
							{/* Reusing the logo URL from AuthModal */}
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
							Welcome Back 👋
						</h2>
						<p className="text-[#FFFFFF]/60 text-[15px]">
							Sign in to continue.
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-4">
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
									ref={emailInputRef}
									type="email"
									value={email}
									onChange={(e) => {
										setEmail(e.target.value);
										setError(null); // Clear error on input change
									}}
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
									onChange={(e) => {
										setPassword(e.target.value);
										setError(null); // Clear error on input change
									}}
									className="w-full pl-10 pr-24 py-2 bg-[#2c2d2e] border border-[#3A3A3C]/60 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#27BBFF] focus:border-transparent placeholder:text-sm"
									placeholder="Enter your password"
									required
									disabled={loading}
								/>
								<div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
									<Link
										href="/forgot-password"
										className="text-[#ACACAD] hover:text-white/80 text-xs cursor-pointer relative group"
									>
										Forgot?
										<span className="absolute -bottom-0.5 left-0 w-full h-[1px] bg-white/60 opacity-0 group-hover:opacity-100" />
									</Link>
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

						{/* Optional: display inline error */}
						{/* {error && (
							<div className="text-red-500 text-sm text-center pt-2">
								{error}
							</div>
						)} */}

						<motion.button
							type="submit"
							disabled={loading}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className="cursor-pointer w-full bg-[#27BBFF] text-[#101014] font-semibold py-2.5 px-4 rounded-lg hover:bg-[#1ea8e6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? 'Signing In...' : 'Sign In'}
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
							{/* SVG from AuthModal */}
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
						{/* Terms links might not be needed on dedicated page, but kept for parity */}
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
							Don't have an account?{' '}
							<Link
								href="/signup" // Link to the signup page
								className="text-white hover:text-white/80 cursor-pointer relative group"
							>
								Sign up
								<span className="absolute -bottom-0.5 left-0 w-full h-[1px] bg-white/60 opacity-0 group-hover:opacity-100" />
							</Link>
						</p>
					</div>
				</div>
			</motion.div>
		</div>
	);
}
