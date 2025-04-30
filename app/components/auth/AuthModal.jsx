'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faXmark,
	faEnvelope,
	faLock,
	faUser,
	faEye,
	faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import Image from 'next/image';

const AuthModal = ({ isOpen, onClose }) => {
	const [isSignIn, setIsSignIn] = useState(true);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [name, setName] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
	const [showPassword, setShowPassword] = useState(false);
	const emailInputRef = useRef(null);
	const [showUserDropdown, setShowUserDropdown] = useState(false);
	const [user, setUser] = useState(null);

	useEffect(() => {
		if (isOpen && emailInputRef.current) {
			emailInputRef.current.focus();
		}

		// Reset loading, error, and success when modal is opened
		if (isOpen) {
			setLoading(false);
			setError(null);
			setSuccess(null);
		}

		// Clear form fields when modal is toggled
		if (!isOpen) {
			setEmail('');
			setPassword('');
			setName('');
			setError(null);
			setSuccess(null);
			setShowPassword(false);
		}
	}, [isOpen]);

	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === 'Escape') {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener('keydown', handleEscape);
			document.documentElement.style.overflow = 'hidden';
			document.body.style.overflow = 'hidden';
		} else {
			document.removeEventListener('keydown', handleEscape);
			document.documentElement.style.overflow = '';
			document.body.style.overflow = '';
		}

		return () => {
			document.removeEventListener('keydown', handleEscape);
			document.documentElement.style.overflow = '';
			document.body.style.overflow = '';
		};
	}, [isOpen, onClose]);

	const getRandomAvatar = () => {
		const avatarNumber = Math.floor(Math.random() * 20) + 1; // Random number between 1 and 20
		return `https://ujaylejhopvncyjvduvj.supabase.co/storage/v1/object/public/ohmmade-assets/default-avatars/avatar-${avatarNumber}.png`;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setSuccess(null);

		if (isSignIn) {
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) {
				setError(error.message);
				setLoading(false);
				return;
			}
			onClose();
		} else {
			try {
				// Check if email exists
				const checkResponse = await fetch('/api/auth/check-email', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ email }),
				});

				const { exists } = await checkResponse.json();

				if (exists) {
					setError(
						'An account with this email already exists. Please sign in instead.'
					);
					setLoading(false);
					return;
				}

				const randomAvatar = getRandomAvatar();

				// Create account
				const { data, error: signUpError } = await supabase.auth.signUp(
					{
						email,
						password,
						options: {
							data: {
								name: name,
								display_name: name,
								avatar_url: randomAvatar,
							},
						},
					}
				);

				if (signUpError) {
					setError(signUpError.message);
					setLoading(false);
					return;
				}

				// Get the Supabase Auth user id
				const userId = data.user?.id;

				// Create user in Prisma
				const createUserResponse = await fetch(
					'/api/auth/create-user',
					{
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							id: userId,
							email,
							name,
							image: randomAvatar,
						}),
					}
				);

				const createUserData = await createUserResponse.json();

				if (!createUserResponse.ok) {
					setError(
						createUserData.error || 'Failed to create user profile'
					);
					setLoading(false);
					return;
				}

				// Handle success
				if (data.user) {
					// Check if email confirmation is required by looking at the session
					if (!data.session) {
						setSuccess(
							'Account created! Please check your email to confirm your account.'
						);
						setTimeout(() => {
							onClose();
							setIsSignIn(true);
						}, 3000);
					} else {
						setSuccess('Account created successfully!');
						onClose();
					}
				}
			} catch (err) {
				console.error('Sign up error:', err);
				setError(err.message || 'Failed to create account');
			} finally {
				setLoading(false);
			}
		}
	};

	const handleGoogleSignIn = async () => {
		setLoading(true);
		setError(null);
		setSuccess(null);

		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: `${window.location.origin}/auth/callback`,
			},
		});

		if (error) {
			setError(error.message);
			setLoading(false);
			return;
		}

		// The user will be redirected to the callback URL
		// The callback route will handle creating the Prisma user model
		setLoading(false);
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<Dialog.Root open={isOpen} onOpenChange={onClose}>
					<Dialog.Portal forceMount>
						<Dialog.Overlay asChild>
							<motion.div
								className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.2 }}
							/>
						</Dialog.Overlay>
						<Dialog.Content asChild>
							<motion.div
								className="fixed left-[50%] top-[50%] z-[10000] w-full max-w-[480px] translate-x-[-50%] translate-y-[-50%] p-4"
								initial={{ opacity: 0, scale: 0.95, y: -20 }}
								animate={{
									opacity: 1,
									scale: 1,
									y: 0,
									transition: {
										type: 'spring',
										duration: 0.5,
										bounce: 0.3,
									},
								}}
								exit={{
									opacity: 0,
									scale: 0.95,
									y: 10,
									transition: {
										duration: 0.2,
									},
								}}
							>
								<div className="bg-[#1C1C20] rounded-2xl p-8 relative border border-[#3A3A3C]/60 shadow-xl">
									<Dialog.Close className="cursor-pointer absolute top-4 right-4 text-[#FFFFFF]/60 hover:text-white transition-colors">
										<FontAwesomeIcon
											icon={faXmark}
											size="lg"
										/>
									</Dialog.Close>

									<div className="flex flex-col items-center mb-6 mt-4">
										<div className="flex items-center justify-center gap-2">
											<img
												src="https://ujaylejhopvncyjvduvj.supabase.co/storage/v1/object/public/ohmmade-assets//Frame%205%20(4).png"
												alt="OhmMade Logo"
												className="w-9 mb-4"
											/>
											<h1 className="text-3xl font-extrabold text-white mb-2">
												OhmMade
											</h1>
										</div>
										<Dialog.Title className="text-[20px] font-semibold text-white mb-2 mt-2">
											{isSignIn
												? 'Welcome Back 👋'
												: "Let's Get You Started 🚀"}
										</Dialog.Title>
										<Dialog.Description className="text-[#FFFFFF]/60 text-[15px]">
											{isSignIn
												? 'Sign in to continue.'
												: 'Sign up and start building.'}
										</Dialog.Description>
									</div>

									<form
										onSubmit={handleSubmit}
										className="space-y-4"
									>
										{!isSignIn && (
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
														type="text"
														value={name}
														onChange={(e) =>
															setName(
																e.target.value
															)
														}
														className="w-full pl-10 pr-4 py-2 bg-[#2c2d2e] border border-[#3A3A3C]/60 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#27BBFF] focus:border-transparent placeholder:text-sm"
														placeholder="John Doe"
														required={!isSignIn}
													/>
												</div>
											</div>
										)}

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
													onChange={(e) =>
														setEmail(e.target.value)
													}
													className="w-full pl-10 pr-4 py-2 bg-[#2c2d2e] border border-[#3A3A3C]/60 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#27BBFF] focus:border-transparent placeholder:text-sm"
													placeholder="john.doe@gmail.com"
													required
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
													type={
														showPassword
															? 'text'
															: 'password'
													}
													value={password}
													onChange={(e) =>
														setPassword(
															e.target.value
														)
													}
													className="w-full pl-10 pr-24 py-2 bg-[#2c2d2e] border border-[#3A3A3C]/60 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#27BBFF] focus:border-transparent placeholder:text-sm"
													placeholder="Min. 6 characters"
													required
												/>
												<div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
													{isSignIn && (
														<Link
															href="/forgot-password"
															onClick={onClose}
															className="text-[#ACACAD] hover:text-white/80 text-xs cursor-pointer relative group"
														>
															Forgot?
															<span className="absolute -bottom-0.5 left-0 w-full h-[1px] bg-white/60 opacity-0 group-hover:opacity-100" />
														</Link>
													)}
													<button
														type="button"
														onClick={() =>
															setShowPassword(
																!showPassword
															)
														}
														className="text-[#ACACAD] hover:text-white/80 text-sm cursor-pointer"
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

										{error && (
											<div className="text-red-500 text-sm text-center">
												{error}
											</div>
										)}

										{success && (
											<div className="text-green-500 text-sm text-center">
												{success}
											</div>
										)}

										<motion.button
											type="submit"
											disabled={loading}
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
											className="mt-1 cursor-pointer w-full bg-[#27BBFF] text-[#101014] font-semibold py-2 px-4 rounded-lg hover:bg-[#1ea8e6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
										>
											{loading
												? 'Loading...'
												: isSignIn
												? 'Sign In'
												: 'Create Account'}
										</motion.button>

										<div className="relative">
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
											className="cursor-pointer w-full flex items-center justify-center gap-2 bg-[#2c2d2e] text-white font-medium py-2 px-4 rounded-lg border border-[#3A3A3C]/60 hover:bg-[#3A3A3C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
												onClick={onClose}
												className="text-white hover:text-white/80 cursor-pointer relative group"
											>
												Terms
												<span className="absolute -bottom-0.5 left-0 w-full h-[1px] bg-white/60 opacity-0 group-hover:opacity-100" />
											</Link>{' '}
											and{' '}
											<Link
												href="/privacy-policy"
												onClick={onClose}
												className="text-white hover:text-white/80 cursor-pointer relative group"
											>
												Privacy
												<span className="absolute -bottom-0.5 left-0 w-full h-[1px] bg-white/60 opacity-0 group-hover:opacity-100" />
											</Link>
										</p>

										<p className="text-[#ACACAD] text-sm mt-3">
											{isSignIn ? (
												<>
													Don't have an account?{' '}
													<button
														onClick={() =>
															setIsSignIn(false)
														}
														className="text-white hover:text-white/80 cursor-pointer relative group"
													>
														Sign up
														<span className="absolute -bottom-0.5 left-0 w-full h-[1px] bg-white/60 opacity-0 group-hover:opacity-100" />
													</button>
												</>
											) : (
												<>
													Already have an account?{' '}
													<button
														onClick={() =>
															setIsSignIn(true)
														}
														className="text-white hover:text-white/80 cursor-pointer relative group"
													>
														Sign in
														<span className="absolute -bottom-0.5 left-0 w-full h-[1px] bg-white/60 opacity-0 group-hover:opacity-100" />
													</button>
												</>
											)}
										</p>
									</div>
								</div>
							</motion.div>
						</Dialog.Content>
					</Dialog.Portal>
				</Dialog.Root>
			)}
		</AnimatePresence>
	);
};

export default AuthModal;
