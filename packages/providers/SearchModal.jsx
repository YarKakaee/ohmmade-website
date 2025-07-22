'use client';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faMagnifyingGlass,
	faChevronDown,
} from '@fortawesome/free-solid-svg-icons';

const SEARCH_TYPES = [
	{ value: 'projects', label: 'Projects' },
	{ value: 'users', label: 'Users' },
	{ value: 'discussions', label: 'Discussions' },
];

export default function SearchModal({ isOpen, onClose, mode = 'projects' }) {
	const [searchType, setSearchType] = useState(mode);
	const [query, setQuery] = useState('');
	const [userResults, setUserResults] = useState([]);
	const [userLoading, setUserLoading] = useState(false);
	const [userError, setUserError] = useState(null);
	const debounceRef = useRef();
	const containerRef = useRef();
	const [showUserDropdown, setShowUserDropdown] = useState(false);
	const [showTypeMenu, setShowTypeMenu] = useState(false);
	const router = useRouter();

	useEffect(() => {
		if (isOpen) {
			setSearchType(mode);
			setQuery('');
			setUserResults([]);
			setUserLoading(false);
			setUserError(null);
			setShowUserDropdown(false);
		}
	}, [isOpen, mode]);

	const handleTypeChange = (e) => {
		setSearchType(e.target.value);
		if (e.target.value === 'users' && query.trim())
			setShowUserDropdown(true);
		else setShowUserDropdown(false);
	};
	const handleInputChange = (e) => {
		setQuery(e.target.value);
		if (searchType === 'users' && e.target.value.trim())
			setShowUserDropdown(true);
		else setShowUserDropdown(false);
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		if (searchType === 'projects' && query.trim()) {
			window.location.href = `/projects?q=${encodeURIComponent(query.trim())}`;
		}
		// For users, do nothing (live search)
	};

	// Live user search effect
	useEffect(() => {
		if (searchType !== 'users' || !query.trim()) {
			setUserResults([]);
			setUserLoading(false);
			setUserError(null);
			setShowUserDropdown(false);
			return;
		}
		setUserLoading(true);
		setUserError(null);
		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(async () => {
			try {
				const res = await fetch(
					`/api/user/search?q=${encodeURIComponent(query.trim())}`
				);
				if (!res.ok) throw new Error('Failed to fetch');
				const users = await res.json();
				setUserResults(users);
				setShowUserDropdown(true);
			} catch (err) {
				setUserError('Error searching users');
				setUserResults([]);
				setShowUserDropdown(false);
			} finally {
				setUserLoading(false);
			}
		}, 250);
		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		};
	}, [searchType, query]);

	const handleUserClick = (username) => {
		onClose();
		router.push(`/u/${username}`);
	};

	useEffect(() => {
		if (!showTypeMenu) return;
		function handle(e) {
			if (!containerRef.current) return;
			if (!containerRef.current.contains(e.target))
				setShowTypeMenu(false);
		}
		document.addEventListener('mousedown', handle);
		return () => document.removeEventListener('mousedown', handle);
	}, [showTypeMenu]);

	return (
		<AnimatePresence>
			{isOpen && (
				<Dialog.Root open={isOpen} onOpenChange={onClose}>
					<Dialog.Portal forceMount>
						<Dialog.Overlay asChild>
							<motion.div
								className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999]"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.2 }}
							/>
						</Dialog.Overlay>
						<Dialog.Content asChild>
							<motion.div
								className="fixed left-1/2 top-1/2 z-[10000] w-full max-w-md translate-x-[-50%] translate-y-[-50%] p-0"
								initial={{ opacity: 0, scale: 0.98, y: 0 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.98, y: 0 }}
								transition={{
									type: 'spring',
									duration: 0.35,
									bounce: 0.2,
								}}
							>
								<Dialog.Title asChild>
									<span className="sr-only">Search</span>
								</Dialog.Title>
								<div
									ref={containerRef}
									className="flex items-center bg-[#18181C]/95 border border-[#23232A] shadow-xl rounded-full px-3 py-2 w-full max-w-md mx-auto relative gap-2"
								>
									<div className="relative flex items-center gap-1 w-auto">
										<button
											type="button"
											className="flex items-center gap-4 bg-transparent text-white text-sm font-medium pl-3 pr-1 py-1 rounded-full focus:outline-none select-none"
											onClick={() =>
												setShowTypeMenu((v) => !v)
											}
											aria-haspopup="listbox"
											aria-expanded={showTypeMenu}
										>
											<span>
												{
													SEARCH_TYPES.find(
														(t) =>
															t.value ===
															searchType
													)?.label
												}
											</span>
											<FontAwesomeIcon
												icon={faChevronDown}
												className="text-white text-xs"
											/>
										</button>
										<AnimatePresence>
											{showTypeMenu && (
												<motion.ul
													initial={{
														opacity: 0,
														y: 8,
													}}
													animate={{
														opacity: 1,
														y: 0,
													}}
													exit={{ opacity: 0, y: 8 }}
													transition={{
														duration: 0.18,
													}}
													className="absolute left-0 top-full mt-1 min-w-[110px] bg-[#23232A] border border-[#333] rounded-xl shadow-lg z-30 py-1"
													role="listbox"
												>
													{SEARCH_TYPES.map(
														(type) => (
															<li
																key={type.value}
																role="option"
																aria-selected={
																	type.value ===
																	searchType
																}
																className={`px-4 py-2 text-sm cursor-pointer hover:bg-[#28282F] text-white/90 ${type.value === searchType ? 'font-bold bg-[#28282F]' : ''} ${type.value === 'discussions' ? 'opacity-50 cursor-not-allowed' : ''}`}
																onClick={() => {
																	if (
																		type.value !==
																		'discussions'
																	) {
																		setSearchType(
																			type.value
																		);
																		setShowTypeMenu(
																			false
																		);
																	}
																}}
															>
																{type.label}
															</li>
														)
													)}
												</motion.ul>
											)}
										</AnimatePresence>
									</div>
									<form
										onSubmit={handleSubmit}
										className="flex-1 flex items-center relative min-w-0"
									>
										<input
											type="text"
											className="flex-1 bg-transparent border-none outline-none text-white text-sm px-2 py-1"
											placeholder={`Search ${searchType}...`}
											value={query}
											onChange={handleInputChange}
											disabled={
												searchType === 'discussions'
											}
											autoFocus
											onFocus={() =>
												setShowTypeMenu(false)
											}
										/>
										<button
											type="submit"
											className="ml-2 text-white/70 hover:text-white cursor-pointer transition-colors text-sm px-2 py-1 rounded-full focus:outline-none"
											disabled={searchType !== 'projects'}
										>
											<FontAwesomeIcon
												icon={faMagnifyingGlass}
											/>
										</button>
									</form>
								</div>
								{/* Floating user results dropdown */}
								{searchType === 'users' &&
									query &&
									showUserDropdown && (
										<div className="absolute left-0 top-[110%] w-full z-20">
											<div className="flex flex-col rounded-xl border border-[#23232A] bg-[#18181C] shadow-lg overflow-hidden">
												{userLoading && (
													<div className="text-white/60 py-3 px-4 flex items-center gap-2 text-sm">
														<span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white/40 inline-block"></span>
														<span>
															Searching...
														</span>
													</div>
												)}
												{userError && (
													<div className="text-red-500 py-2 px-4 text-sm">
														{userError}
													</div>
												)}
												{!userLoading &&
													!userError &&
													userResults.length ===
														0 && (
														<div className="text-white/60 py-2 px-4 text-sm">
															No users found.
														</div>
													)}
												{userResults.length > 0 &&
													userResults.map((user) => (
														<div
															key={user.id}
															className="flex items-center gap-3 px-4 py-2 hover:bg-[#23232A] transition-colors cursor-pointer"
															onClick={() =>
																handleUserClick(
																	user.username
																)
															}
														>
															<Image
																src={user.image}
																alt={
																	user.name ||
																	user.username
																}
																width={34}
																height={34}
																className="rounded-full object-cover bg-[#23232A]"
															/>
															<div className="flex flex-col">
																<span className="font-medium text-white text-[14px] truncate max-w-[120px]">
																	{user.name || (
																		<span className="text-white/40">
																			No
																			Name
																		</span>
																	)}
																</span>
																<span className="text-white/70 text-xs">
																	@
																	{
																		user.username
																	}
																</span>
															</div>
														</div>
													))}
											</div>
										</div>
									)}
							</motion.div>
						</Dialog.Content>
					</Dialog.Portal>
				</Dialog.Root>
			)}
		</AnimatePresence>
	);
}
