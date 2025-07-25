'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faXmark,
	faEnvelope,
	faLock,
	faEye,
	faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import Image from 'next/image';

const AdminAuthModal = ({ isOpen, onClose, onSuccess }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [showPassword, setShowPassword] = useState(false);
	const emailInputRef = useRef(null);
	const supabase = createClientComponentClient();

	useEffect(() => {
		if (isOpen && emailInputRef.current) {
			emailInputRef.current.focus();
		}

		// Reset loading, error when modal is opened
		if (isOpen) {
			setLoading(false);
			setError(null);
		}

		// Clear form fields when modal is toggled
		if (!isOpen) {
			setEmail('');
			setPassword('');
			setError(null);
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

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const response = await fetch('/api/auth/admin-login-prisma', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});

			const result = await response.json();

			if (!response.ok) {
				setError(result.error || 'Authentication failed');
				setLoading(false);
				return;
			}

			// Pass admin data to parent component
			onSuccess(result);
			onClose();
		} catch (err) {
			console.error('Login error:', err);
			setError('An unexpected error occurred');
		} finally {
			setLoading(false);
		}
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
								<div className="bg-[#101014]/60 backdrop-blur-lg rounded-2xl p-8 relative border border-[#3A3A3C]/60 shadow-xl">
									<Dialog.Close className="cursor-pointer absolute top-4 right-4 text-[#FFFFFF]/60 hover:text-white transition-colors">
										<FontAwesomeIcon
											icon={faXmark}
											size="lg"
										/>
									</Dialog.Close>

									<div className="flex flex-col items-center mb-6 mt-4">
										<div className="flex items-center justify-center gap-2">
											<Image
												src="/assets/OMAdminLogoBanner.png"
												alt="OhmMade Logo Banner"
												height={177}
												width={1301}
												className="object-contain h-10 w-auto mb-4"
												priority
											/>
										</div>
										<Dialog.Title className="sr-only">
											Admin Authentication
										</Dialog.Title>
										<Dialog.Description className="text-[#FFFFFF]/60 text-[15px]">
											Sign in with admin credentials to
											continue.
										</Dialog.Description>
									</div>

									<form
										onSubmit={handleSubmit}
										className="space-y-4"
									>
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
													className="w-full pl-10 pr-4 py-2 bg-white/5 backdrop-blur-xl border border-[#3A3A3C]/60 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#27BBFF] focus:border-transparent placeholder:text-sm transition-all"
													placeholder="john.doe@ohmmade.ca"
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
													className="w-full pl-10 pr-12 py-2 bg-white/5 backdrop-blur-xl border border-[#3A3A3C]/60 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#27BBFF] focus:border-transparent placeholder:text-sm transition-all"
													placeholder="Enter password"
													required
												/>
												<div className="absolute inset-y-0 right-0 pr-3 flex items-center">
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

										<motion.button
											type="submit"
											disabled={loading}
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
											className="mb-2 mt-1 cursor-pointer w-full bg-[#27BBFF] text-[#101014] font-semibold py-2 px-4 rounded-lg hover:bg-[#1ea8e6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#27BBFF]/20"
										>
											{loading
												? 'Signing In...'
												: 'Sign In'}
										</motion.button>
									</form>
								</div>
							</motion.div>
						</Dialog.Content>
					</Dialog.Portal>
				</Dialog.Root>
			)}
		</AnimatePresence>
	);
};

export default AdminAuthModal;
