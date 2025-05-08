'use client';
import CodexEditorWrapper from '@/app/components/codex/CodexEditorWrapper';
import Footer from '@/app/components/layout/Footer';
import { supabase } from '@/lib/supabaseClient';
import {
	faArrowUpRightFromSquare,
	faChevronDown,
	faSpinner,
	faTrashCan,
	faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { Inter_Tight } from 'next/font/google';
import { redirect } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

const interTight = Inter_Tight({ subsets: ['latin'] });
export default function PublishProjectPage() {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [category, setCategory] = useState('');
	const [difficultyLevel, setDifficultyLevel] = useState('');
	const [timeToBuild, setTimeToBuild] = useState('');
	const [tags, setTags] = useState([]);
	const [newTag, setNewTag] = useState('');
	const [thumbnailUrl, setThumbnailUrl] = useState(null);
	const [user, setUser] = useState(null);
	const [isPublishing, setIsPublishing] = useState(false);

	const [checkingSession, setCheckingSession] = useState(true);

	const inputRef = useRef(null);
	const tagInputRef = useRef(null);

	const [components, setComponents] = useState([]);
	const [newComponent, setNewComponent] = useState('');

	const handleAddTag = () => {
		if (!newTag.trim() || tags.length >= 6) return;
		setTags([...tags, newTag.trim()]);
		setNewTag('');
	};

	const handleRemoveTag = (index) => {
		setTags(tags.filter((_, i) => i !== index));
	};

	const handleAddComponent = () => {
		if (!newComponent.trim()) return;
		setComponents([...components, newComponent.trim()]);
		setNewComponent('');
	};

	const handleRemoveComponent = (index) => {
		setComponents(components.filter((_, i) => i !== index));
	};

	const MAX_TITLE_LENGTH = 32;
	const MAX_DESCRIPTION_LENGTH = 195;

	const editorRef = useRef(null);

	useEffect(() => {
		const fetchUser = async () => {
			const { data: sessionData } = await supabase.auth.getSession();
			if (sessionData?.session?.user) {
				setUser(sessionData.session.user);
			}
			setCheckingSession(false);
		};
		fetchUser();
	}, []);

	if (checkingSession) return null;

	const handlePublish = async () => {
		if (
			!title ||
			!description ||
			!category ||
			!difficultyLevel ||
			!thumbnailUrl
		) {
			toast.error('Please fill out all required fields.');
			return;
		}

		try {
			setIsPublishing(true); // Start loading

			const editorData = await editorRef.current.save();

			const slugBase = title.trim().toLowerCase().replace(/\s+/g, '-');
			const slug = `${slugBase}-${Math.floor(
				10000000 + Math.random() * 90000000
			)}`;

			// Defensive: ensure tags is a flat array of strings
			const flatTags = Array.isArray(tags)
				? tags.map((t) => String(t).trim())
				: [];

			await axios.post('/api/projects/create', {
				title: title,
				description: description,
				category,
				difficultyLevel,
				timeToBuild,
				tags: flatTags,
				thumbnailUrl,
				content: editorData,
				slug,
				userId: user.id,
				username:
					user.user_metadata?.full_name || user.email?.split('@')[0],
				email: user.email,
				status: 'published',
				componentsUsed: components,
			});

			toast.success('Project published!');

			// Clear everything
			await editorRef.current.clear();
			setTitle('');
			setDescription('');
			setCategory('');
			setDifficultyLevel('');
			setTimeToBuild('');
			setTags([]);
			setThumbnailUrl(null);
			setComponents([]);
		} catch (err) {
			console.error('Error publishing project:', err);
			toast.error('Something went wrong while publishing.');
		} finally {
			setIsPublishing(false); // Stop loading
		}
	};

	return (
		<div className="relative min-h-screen bg-[#101014] overflow-hidden">
			<section className="relative w-full pt-16 px-8 sm:px-16 lg:px-24">
				<div className="max-w-[1700px] mx-auto px-8 sm:px-16 py-20">
					<h2
						className={`text-[44px] font-black mb-4 text-white leading-tight relative z-10 ${interTight.className}`}
					>
						Publish Your Project
					</h2>
					<div
						className="absolute top-[100px] left-1/2 -translate-x-1/2 z-0 w-full max-w-[1500px] h-[500px] bg-center bg-no-repeat bg-cover opacity-40 pointer-events-none select-none"
						style={{
							backgroundImage:
								'url(https://edc-cdn.net/assets/images/bg-header-epic-indies.png)',
							filter: 'blur(60px)',
						}}
					/>

					<div className="w-full h-20 flex items-center justify-between px-8 border-b border-white/60">
						<input
							type="text"
							value={title}
							onChange={(e) =>
								setTitle(
									e.target.value.slice(0, MAX_TITLE_LENGTH)
								)
							}
							placeholder="Enter title here..."
							className="bg-transparent text-white text-[17px] placeholder-white/50 focus:outline-none w-2/3 font-medium mt-4"
						/>

						<div className="space-x-2">
							<button className="bg-[#343437] disabled cursor-pointer text-white px-5 py-2 font-medium rounded-md text-sm hover:bg-[#3A3A3A] transition">
								Save draft (coming soon)
							</button>
							<button
								onClick={handlePublish}
								disabled={isPublishing}
								className={`px-5 py-2 text-sm font-medium rounded-md transition ${
									isPublishing
										? 'bg-[#27BBFF] opacity-50 cursor-not-allowed'
										: 'bg-[#27BBFF] text-[#101014] hover:brightness-80 cursor-pointer'
								}`}
							>
								{isPublishing ? (
									<>
										<FontAwesomeIcon
											icon={faSpinner}
											spin
											className="text-sm"
										/>
										<span className="ml-2">
											Publishing...
										</span>
									</>
								) : (
									<span>Publish</span>
								)}
							</button>
						</div>
					</div>

					{/* Main Content Area */}
					<div className="flex">
						{/* Left: Editor */}
						<div className="w-3/4 border-r border-white/60 min-h-[600px] p-8 text-white/50">
							<CodexEditorWrapper ref={editorRef} />
						</div>

						{/* Right: Sidebar */}
						<div className="w-1/4 space-y-6">
							<div className="px-8 pt-5 text-sm text-white">
								<h3 className="text-white font-extrabold text-[20px] mb-2">
									Thank you for sharing your knowledge!
								</h3>
								<p className="text-[#FFFFFF]/60 mb-3">
									We recommend breaking your project into
									clear steps using text, images, and code
									blocks. This helps others follow along
									easily and brings your project to life.
								</p>
								<p className="text-[#FFC008] font-semibold mb-3">
									Note:{' '}
									<span className="text-white font-normal">
										Avoid sharing sensitive info like full
										names, emails, IDs, credentials, or
										locations in your tutorial.
									</span>
								</p>

								<p className="text-[#FFFFFF]/60 mb-2">
									Your project will be publicly visible. Make
									sure to:
								</p>

								<ul className="list-decimal pl-10 text-[#FFFFFF]/60 space-y-1 mb-3">
									<li>
										Keep things clear and beginner-friendly.
									</li>
									<li>
										Link any useful resources or libraries.
									</li>
									<li>Add tags and a good description.</li>
								</ul>

								<p className="text-[#FFFFFF]/70">
									Need help formatting or editing, or just
									want general information about what's
									allowed?
								</p>

								<a
									href="/publishing-guidelines"
									className="inline-flex items-center mt-4 text-sm bg-[#343437] rounded-md px-3 py-2 text-white hover:bg-[#2F2F31] transition"
								>
									Publishing Guidelines{' '}
									<FontAwesomeIcon
										icon={faArrowUpRightFromSquare}
										className="ml-2 text-xs"
									/>
								</a>
							</div>

							<div className="mx-8 border-b border-white/60 mb-6" />

							{/* Form Fields */}
							<div className="px-8 space-y-4 text-[12.5px] text-white">
								<div>
									<label className="block mb-1.5 text-white/60">
										Category / Microcontroller{' '}
										<span className="text-[#FFC008]">
											*
										</span>
									</label>
									<div className="relative">
										<select
											className="cursor-pointer w-full bg-[#1C1C20] border border-[#6B6B6D] rounded-md px-3 py-2 pr-10 text-white/50 appearance-none focus:outline-none focus:ring-2 focus:ring-[#27BBFF] focus:ring-offset-0 font-medium text-sm"
											value={category}
											onChange={(e) =>
												setCategory(e.target.value)
											}
										>
											<option value="" disabled>
												Select...
											</option>
											<option>Basic Circuits</option>
											<option>Arduino UNO</option>
											<option>Raspberry Pi 4</option>
											<option>Raspberry Pi Pico W</option>
											<option>Other</option>
										</select>

										<div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
											<FontAwesomeIcon
												icon={faChevronDown}
												className="text-white/70 text-sm"
											/>
										</div>
									</div>
								</div>

								<div>
									<label className="block mb-1.5 text-white/60">
										Description{' '}
										<span className="text-[#FFC008]">
											*
										</span>
									</label>
									<textarea
										className="w-full bg-[#1C1C20] border border-[#6B6B6D] rounded-md px-3 py-2 resize-none h-30 text-sm text-white/50"
										value={description}
										onChange={(e) =>
											setDescription(
												e.target.value.slice(
													0,
													MAX_DESCRIPTION_LENGTH
												)
											)
										}
										maxLength={MAX_DESCRIPTION_LENGTH}
										placeholder="A quick summary of what the project is and what it does. Shown on cards/search."
									/>
									<p className="text-xs text-white/50 mt-1">
										{MAX_DESCRIPTION_LENGTH -
											description.length}{' '}
										characters remaining
									</p>
								</div>

								<div>
									<label className="block mb-1.5 text-white/60">
										Thumbnail Image{' '}
										<span className="text-[#FFC008]">
											*
										</span>
									</label>

									<div className="flex gap-4 items-center">
										<label
											htmlFor="thumbnail-upload"
											className="border border-dashed border-[#6B6B6D] rounded-md px-4 py-6 text-center cursor-pointer hover:bg-[#1F1F24] transition w-full"
										>
											<FontAwesomeIcon
												icon={faUpload}
												className="text-white/50 text-xl mb-2"
											/>
											<p className="text-white/50 text-sm">
												Click to upload or drag & drop
												file
											</p>
											<p className="text-white/25 text-xs mt-1">
												Recommended size: 1580x1060
											</p>
										</label>

										{/* Preview */}
										{thumbnailUrl && (
											<img
												src={thumbnailUrl}
												alt="Thumbnail Preview"
												className="w-[125px] h-[100px] rounded-md object-cover border border-[#6B6B6D]"
											/>
										)}
									</div>

									<input
										id="thumbnail-upload"
										type="file"
										accept="image/*"
										className="hidden"
										onChange={async (e) => {
											const file = e.target.files?.[0];
											if (!file) return;

											const fileExt = file.name
												.split('.')
												.pop();
											const filePath = `thumbnails/${Date.now()}.${fileExt}`;

											// Upload image
											const { error: uploadError } =
												await supabase.storage
													.from('project-thumbnails')
													.upload(filePath, file, {
														cacheControl: '3600',
														upsert: true,
														contentType: file.type,
													});

											if (uploadError) {
												console.error(
													'Upload failed:',
													uploadError.message
												);
												return;
											}

											// Get public URL
											const { data: publicUrlData } =
												supabase.storage
													.from('project-thumbnails')
													.getPublicUrl(filePath);

											setThumbnailUrl(
												publicUrlData.publicUrl
											);
										}}
									/>
								</div>

								<div>
									<label className="block mb-1.5 text-white/60">
										Difficulty Level{' '}
										<span className="text-[#FFC008]">
											*
										</span>
									</label>
									<div className="relative">
										<select
											className="cursor-pointer w-full bg-[#1C1C20] border border-[#6B6B6D] rounded-md px-3 py-2 pr-10 text-white/50 appearance-none focus:outline-none focus:ring-2 focus:ring-[#27BBFF] focus:ring-offset-0 font-medium text-sm"
											value={difficultyLevel}
											onChange={(e) =>
												setDifficultyLevel(
													e.target.value
												)
											}
										>
											<option value="">Select...</option>
											<option>Beginner</option>
											<option>Intermediate</option>
											<option>Advanced</option>
										</select>

										<div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
											<FontAwesomeIcon
												icon={faChevronDown}
												className="text-white/70 text-sm"
											/>
										</div>
									</div>
								</div>

								<div className="mb-4">
									<label className="block mb-1.5 text-white/60">
										Components Used
									</label>

									<div className="flex gap-2 mb-2">
										<input
											ref={inputRef}
											type="text"
											placeholder="e.g., 2 x 220Ω Resistors"
											value={newComponent}
											onChange={(e) =>
												setNewComponent(e.target.value)
											}
											className="flex-1 bg-[#1C1C20] border border-[#6B6B6D] rounded-md px-3 py-2 text-white/50 text-sm"
										/>

										{/* Insert Ω button */}
										<button
											type="button"
											title="Insert Ohm Symbol"
											onClick={() => {
												const input = inputRef.current;
												if (!input) return;

												const start =
													input.selectionStart;
												const end = input.selectionEnd;

												const newValue =
													newComponent.slice(
														0,
														start
													) +
													'Ω' +
													newComponent.slice(end);
												setNewComponent(newValue);

												// Move cursor after the Ω
												setTimeout(() => {
													input.setSelectionRange(
														start + 1,
														start + 1
													);
													input.focus();
												}, 0);
											}}
											className="px-3 py-2 bg-[#343437] text-white rounded-md text-sm hover:bg-[#2F2F31] transition cursor-pointer"
										>
											Ω
										</button>

										{/* Add Button */}
										<button
											type="button"
											onClick={handleAddComponent}
											className="bg-[#27BBFF] text-[#101014] px-3 py-2 cursor-pointer rounded-md text-sm font-medium hover:brightness-110"
										>
											Add
										</button>
									</div>

									<ul className="list-disc ml-6 text-white/70 text-sm -space-y-1">
										{components.map((item, idx) => (
											<li key={idx} className="relative">
												<div className="flex justify-between items-center gap-2">
													<span className="ml-2">
														{item}
													</span>
													<button
														type="button"
														onClick={() =>
															handleRemoveComponent(
																idx
															)
														}
														className="text-[#FF4B4B] px-3 py-2 cursor-pointer rounded-md text-sm font-medium transition-transform duration-200 hover:scale-110"
													>
														<FontAwesomeIcon
															icon={faTrashCan}
														/>
													</button>
												</div>
											</li>
										))}
									</ul>
								</div>

								<div>
									<label className="block mb-1.5 text-white/60">
										Estimated Time to Build
									</label>
									<input
										type="text"
										value={timeToBuild}
										placeholder="e.g., 30 minutes, 2 hours – sets expectations."
										onChange={(e) =>
											setTimeToBuild(e.target.value)
										}
										className="w-full bg-[#1C1C20] border border-[#6B6B6D] rounded-md px-3 py-2 text-sm text-white/50"
									/>
								</div>

								<div className="mb-4">
									<label className="block mb-1.5 text-white/60">
										Tags
										<span className="text-xs text-white/40 ml-1">
											(max 6)
										</span>
									</label>
									<div className="flex gap-2 mb-2">
										<input
											ref={tagInputRef}
											type="text"
											value={newTag}
											placeholder="e.g., arduino, electronics, diy"
											onChange={(e) =>
												setNewTag(e.target.value)
											}
											className="flex-1 bg-[#1C1C20] border border-[#6B6B6D] rounded-md px-3 py-2 text-white/50 text-sm"
										/>

										{/* Add Button */}
										<button
											type="button"
											onClick={handleAddTag}
											disabled={tags.length >= 6}
											className={`px-3 py-2 rounded-md text-sm font-medium ${
												tags.length >= 6
													? 'bg-[#27BBFF]/50 text-[#101014]/50 cursor-not-allowed'
													: 'bg-[#27BBFF] text-[#101014] hover:brightness-110 cursor-pointer'
											}`}
										>
											Add
										</button>
									</div>

									<ul className="list-disc ml-6 text-white/70 text-sm -space-y-1">
										{tags.map((item, idx) => (
											<li key={idx} className="relative">
												<div className="flex justify-between items-center gap-2">
													<span className="ml-2">
														{item}
													</span>
													<button
														type="button"
														onClick={() =>
															handleRemoveTag(idx)
														}
														className="text-[#FF4B4B] px-3 py-2 cursor-pointer rounded-md text-sm font-medium transition-transform duration-200 hover:scale-110"
													>
														<FontAwesomeIcon
															icon={faTrashCan}
														/>
													</button>
												</div>
											</li>
										))}
									</ul>
								</div>
							</div>
						</div>
					</div>
					{/* End main row */}
				</div>
			</section>
			<Footer />
		</div>
	);
}
