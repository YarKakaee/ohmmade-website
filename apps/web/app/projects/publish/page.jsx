'use client';
import CodexEditorWrapper from '@/app/components/codex/CodexEditorWrapper';
import LayoutContainer from '@ohmmade/ui/layout-container';
import { useAuthModal } from '@ohmmade/providers';
import { supabase } from '@/lib/supabaseClient';
import {
	faArrowUpRightFromSquare,
	faChevronDown,
	faSpinner,
	faTrashCan,
	faUpload,
	faLightbulb,
	faCode,
	faImage,
	faListUl,
	faListOl,
	faHeading,
	faParagraph,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSessionContext } from '@supabase/auth-helpers-react';
import axios from 'axios';
import { Inter_Tight } from 'next/font/google';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

const interTight = Inter_Tight({ subsets: ['latin'] });
export default function PublishProjectPage() {
	const { session, isLoading } = useSessionContext();
	const router = useRouter();
	const { openAuthModal } = useAuthModal();

	// All hooks must be called before any return
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
	const editorRef = useRef(null);

	useEffect(() => {
		if (!isLoading && !session) {
			router.replace('/');
			setTimeout(() => openAuthModal('login'), 200);
		}
	}, [isLoading, session, router, openAuthModal]);

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

	if (isLoading || session === undefined) {
		return <div className="fixed inset-0 bg-[#101014] z-50" />;
	}
	if (!session) {
		return <div className="fixed inset-0 bg-[#101014] z-50" />;
	}
	if (checkingSession) return null;

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

		// Check if editor has content
		if (!editorRef.current) {
			toast.error(
				'Editor not ready. Please wait a moment and try again.'
			);
			return;
		}

		try {
			setIsPublishing(true);

			const editorData = await editorRef.current.save();

			// Validate editor content - Editor.js format
			if (
				!editorData ||
				!editorData.blocks ||
				editorData.blocks.length === 0
			) {
				toast.error(
					'Please add some content to your project before publishing.'
				);
				return;
			}

			// Check if content is just empty blocks - Editor.js format
			const hasRealContent = editorData.blocks.some((block) => {
				if (block.type === 'paragraph' || block.type === 'header') {
					// Editor.js paragraph/header structure
					return (
						block.data &&
						block.data.text &&
						block.data.text.trim().length > 0
					);
				}
				if (block.type === 'list') {
					// Editor.js list structure
					return (
						block.data &&
						block.data.items &&
						block.data.items.length > 0 &&
						block.data.items.some((item) => item.trim().length > 0)
					);
				}
				if (block.type === 'code') {
					// Editor.js code block structure
					return (
						block.data &&
						block.data.code &&
						block.data.code.trim().length > 0
					);
				}
				// Other block types (images, files, custom blocks) are considered content
				return true;
			});

			if (!hasRealContent) {
				toast.error(
					'Please add some meaningful content to your project before publishing.'
				);
				return;
			}

			const slugBase = title.trim().toLowerCase().replace(/\s+/g, '-');
			const slug = `${slugBase}-${Math.floor(
				10000000 + Math.random() * 90000000
			)}`;

			const flatTags = Array.isArray(tags)
				? tags.map((t) => String(t).trim())
				: [];

			const projectData = {
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
			};

			console.log('Publishing project with data:', projectData);

			const response = await axios.post(
				'/api/projects/create',
				projectData
			);

			if (response.data.success) {
				toast.success('Project published successfully! 🎉');

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

				// Redirect to the published project
				router.push(`/projects/${response.data.project.slug}`);
			} else {
				throw new Error('Project creation failed');
			}
		} catch (err) {
			console.error('Error publishing project:', err);
			if (err.response?.data?.error) {
				toast.error(`Publishing failed: ${err.response.data.error}`);
			} else if (err.message) {
				toast.error(`Publishing failed: ${err.message}`);
			} else {
				toast.error(
					'Something went wrong while publishing. Please try again.'
				);
			}
		} finally {
			setIsPublishing(false);
		}
	};

	return (
		<div className="relative min-h-screen bg-[#101014] overflow-hidden">
			<section className="relative w-full pt-16">
				<LayoutContainer className="py-12 sm:py-16 md:py-20">
					{/* Header Section */}
					<div className="text-center mb-12">
						<h1
							className={`text-3xl md:text-4xl font-black mb-6 text-white leading-tight relative z-10 ${interTight.className}`}
						>
							Publish Your Project
						</h1>
						<p className="text-lg md:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
							Share your electronics knowledge with the world.
							Create beautiful, step-by-step tutorials that
							inspire others to build amazing things.
						</p>
					</div>

					{/* Title Input with Modern Design */}
					<div className="mb-8">
						<div className="relative w-full mx-auto">
							<input
								type="text"
								value={title}
								onChange={(e) =>
									setTitle(
										e.target.value.slice(
											0,
											MAX_TITLE_LENGTH
										)
									)
								}
								placeholder="Enter your project title here..."
								className="w-full bg-[#13151A] backdrop-blur-xl border border-[#3A3A3C]/60 rounded-2xl px-8 py-6 text-white placeholder-white/40 focus:outline-none focus:border-[#27BBFF] focus:ring-4 focus:ring-[#27BBFF]/20 transition-all duration-300 text-2xl font-semibold text-center"
								style={{ fontSize: '16px' }}
							/>
							<div className="absolute right-6 top-1/2 transform -translate-y-1/2">
								<span className="text-white/40 text-sm font-medium">
									{title.length}/{MAX_TITLE_LENGTH}
								</span>
							</div>
						</div>
					</div>

					{/* Main Content Area */}
					<div className="flex flex-col xl:flex-row gap-8 max-w-7xl mx-auto">
						{/* Left: Editor */}
						<div className="w-full xl:w-2/3">
							<div className="bg-[#13151A] backdrop-blur-xl border border-[#3A3A3C]/60 rounded-2xl p-6 overflow-hidden">
								{/* Editor Header */}
								<div className="flex items-center justify-between mb-6 pb-4 border-b border-[#2C2F36]">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 bg-gradient-to-br from-[#27BBFF] to-[#1E40AF] rounded-xl flex items-center justify-center">
											<FontAwesomeIcon
												icon={faCode}
												className="text-white text-lg"
											/>
										</div>
										<div>
											<h3 className="text-white font-bold text-lg">
												Project Content
											</h3>
											<p className="text-white/60 text-sm">
												Write your tutorial here
											</p>
										</div>
									</div>
								</div>

								{/* Editor.js Wrapper */}
								<CodexEditorWrapper ref={editorRef} />
							</div>
						</div>

						{/* Right: Sidebar */}
						<div className="w-full xl:w-1/3 space-y-6">
							{/* Publishing Guidelines Card */}
							<div className="bg-[#13151A] border border-[#3A3A3C]/60 rounded-2xl p-6">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-8 h-8 bg-gradient-to-br from-[#FFC008] to-[#bb8f0e] rounded-lg flex items-center justify-center">
										<FontAwesomeIcon
											icon={faLightbulb}
											className="text-white text-sm"
										/>
									</div>
									<h3 className="text-white font-bold text-lg">
										Writing Tips
									</h3>
								</div>
								<p className="text-white/70 text-sm mb-4 leading-relaxed">
									Break your project into clear steps using
									text, images, and code blocks. This helps
									others follow along easily and brings your
									project to life.
								</p>
								<div className="space-y-2 mb-4">
									<div className="flex items-center gap-2 text-white/60 text-sm">
										<FontAwesomeIcon
											icon={faHeading}
											className="text-[#27BBFF]"
										/>
										<span>
											Use headings to organize sections
										</span>
									</div>
									<div className="flex items-center gap-2 text-white/60 text-sm">
										<FontAwesomeIcon
											icon={faCode}
											className="text-[#35AC47]"
										/>
										<span>
											Add code blocks for technical
											details
										</span>
									</div>
									<div className="flex items-center gap-2 text-white/60 text-sm">
										<FontAwesomeIcon
											icon={faImage}
											className="text-[#FFC008]"
										/>
										<span>
											Include images for visual clarity
										</span>
									</div>
									<div className="flex items-center gap-2 text-white/60 text-sm">
										<FontAwesomeIcon
											icon={faListOl}
											className="text-[#27BBFF]"
										/>
										<span>
											Number steps for easy following
										</span>
									</div>
								</div>
								<a
									href="https://support.ohmmade.ca/articles/publishing-guidelines"
									className="inline-flex items-center text-sm bg-[#2C2F36] hover:bg-[#3A3A3C] rounded-lg px-4 py-2 text-white transition-all duration-200"
								>
									View Guidelines{' '}
									<FontAwesomeIcon
										icon={faArrowUpRightFromSquare}
										className="ml-2 text-xs"
									/>
								</a>
							</div>

							{/* Form Fields */}
							<div className="bg-[#13151A] backdrop-blur-xl border border-[#3A3A3C]/60 rounded-2xl p-6 space-y-6">
								{/* Category Selection */}
								<div>
									<label className="block mb-3 text-white font-semibold text-sm">
										Category / Microcontroller{' '}
										<span className="text-[#FFC008]">
											*
										</span>
									</label>
									<div className="relative">
										<select
											className="cursor-pointer text-sm w-full bg-[#2C2F36] border border-[#3A3A3C]/60 rounded-xl px-4 py-3 text-white/80 focus:outline-none focus:ring-2 focus:ring-[#27BBFF] focus:border-[#27BBFF] transition-all duration-200 font-medium appearance-none"
											value={category}
											onChange={(e) =>
												setCategory(e.target.value)
											}
										>
											<option value="" disabled>
												Select category...
											</option>
											<option>Basic Circuits</option>
											<option>Arduino UNO</option>
											<option>Raspberry Pi 4</option>
											<option>Raspberry Pi Pico W</option>
											<option>Other</option>
										</select>
										<div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
											<FontAwesomeIcon
												icon={faChevronDown}
												className="text-white/80 text-sm"
											/>
										</div>
									</div>
								</div>

								{/* Description */}
								<div>
									<label className="block mb-3 text-white font-semibold text-sm">
										Description{' '}
										<span className="text-[#FFC008]">
											*
										</span>
									</label>
									<textarea
										className="text-sm w-full bg-[#2C2F36] border border-[#3A3A3C]/60 rounded-xl px-4 py-3 resize-none h-24 text-white/80 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#27BBFF] focus:border-[#27BBFF] transition-all duration-200"
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
										placeholder="A quick summary of what the project is and what it does..."
									/>
									<div className="flex justify-between items-center mt-2">
										<span className="text-xs text-white/40">
											{MAX_DESCRIPTION_LENGTH -
												description.length}{' '}
											characters remaining
										</span>
									</div>
								</div>

								{/* Thumbnail Upload */}
								<div>
									<label className="block mb-3 text-white font-semibold text-sm">
										Thumbnail Image{' '}
										<span className="text-[#FFC008]">
											*
										</span>
									</label>
									<div className="space-y-3">
										<label
											htmlFor="thumbnail-upload"
											className="block border-2 border-dashed border-[#3A3A3C] hover:border-[#27BBFF] rounded-xl p-6 text-center cursor-pointer hover:bg-[#2C2F36]/50 transition-all duration-200 group"
										>
											<div className="w-12 h-12 bg-[#2C2F36] group-hover:bg-[#27BBFF]/20 rounded-xl flex items-center justify-center mx-auto mb-3 transition-all duration-200">
												<FontAwesomeIcon
													icon={faUpload}
													className="text-white/60 group-hover:text-[#27BBFF] text-xl transition-all duration-200"
												/>
											</div>
											<p className="text-white/60 group-hover:text-white text-sm font-medium transition-all duration-200">
												Click to upload or drag & drop
											</p>
											<p className="text-white/40 text-xs mt-1">
												Recommended: 1580×1060
											</p>
										</label>

										{/* Preview */}
										{thumbnailUrl && (
											<div className="relative">
												<img
													src={thumbnailUrl}
													alt="Thumbnail Preview"
													className="w-full h-32 rounded-xl object-cover border border-[#3A3A3C]"
												/>
												<button
													onClick={() =>
														setThumbnailUrl(null)
													}
													className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
												>
													×
												</button>
											</div>
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

											try {
												const { error: uploadError } =
													await supabase.storage
														.from(
															'project-thumbnails'
														)
														.upload(
															filePath,
															file,
															{
																cacheControl:
																	'3600',
																upsert: true,
																contentType:
																	file.type,
															}
														);

												if (uploadError) {
													toast.error(
														'Upload failed. Please try again.'
													);
													return;
												}

												const { data: publicUrlData } =
													supabase.storage
														.from(
															'project-thumbnails'
														)
														.getPublicUrl(filePath);

												setThumbnailUrl(
													publicUrlData.publicUrl
												);
												toast.success(
													'Image uploaded successfully!'
												);
											} catch (error) {
												toast.error(
													'Upload failed. Please try again.'
												);
											}
										}}
									/>
								</div>

								{/* Difficulty Level */}
								<div>
									<label className="block mb-3 text-white font-semibold text-sm">
										Difficulty Level{' '}
										<span className="text-[#FFC008]">
											*
										</span>
									</label>
									<div className="relative">
										<select
											className="cursor-pointer text-sm w-full bg-[#2C2F36] border border-[#3A3A3C]/60 rounded-xl px-4 py-3 text-white/80 focus:outline-none focus:ring-2 focus:ring-[#27BBFF] focus:border-[#27BBFF] transition-all duration-200 font-medium appearance-none"
											value={difficultyLevel}
											onChange={(e) =>
												setDifficultyLevel(
													e.target.value
												)
											}
										>
											<option value="">
												Select difficulty...
											</option>
											<option>Beginner</option>
											<option>Intermediate</option>
											<option>Advanced</option>
										</select>
										<div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
											<FontAwesomeIcon
												icon={faChevronDown}
												className="text-white/80 text-sm"
											/>
										</div>
									</div>
								</div>

								{/* Components Used */}
								<div>
									<label className="block mb-3 text-white font-semibold text-sm">
										Components Used
									</label>
									<div className="space-y-3">
										<div className="flex gap-2">
											<input
												ref={inputRef}
												type="text"
												placeholder="e.g., 2 × 220Ω Resistors"
												value={newComponent}
												onChange={(e) =>
													setNewComponent(
														e.target.value
													)
												}
												className="text-sm flex-1 bg-[#2C2F36] border border-[#3A3A3C]/60 rounded-xl px-3 py-3 text-white/80 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#27BBFF] focus:border-[#27BBFF] transition-all duration-200"
											/>
											<button
												type="button"
												title="Insert Ohm Symbol"
												onClick={() => {
													const input =
														inputRef.current;
													if (!input) return;
													const start =
														input.selectionStart;
													const end =
														input.selectionEnd;
													const newValue =
														newComponent.slice(
															0,
															start
														) +
														'Ω' +
														newComponent.slice(end);
													setNewComponent(newValue);
													setTimeout(() => {
														input.setSelectionRange(
															start + 1,
															start + 1
														);
														input.focus();
													}, 0);
												}}
												className="cursor-pointer px-3 py-2 bg-[#2C2F36] hover:bg-[#3A3A3C] text-white rounded-lg text-sm transition-all duration-200 font-medium"
											>
												Ω
											</button>
											<button
												type="button"
												onClick={handleAddComponent}
												className="cursor-pointer bg-[#27BBFF] text-[#101014] px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
											>
												Add
											</button>
										</div>

										{/* Components List */}
										{components.length > 0 && (
											<div className="space-y-2">
												{components.map((item, idx) => (
													<div
														key={idx}
														className="flex items-center justify-between bg-[#2C2F36] border border-[#3A3A3C]/60 rounded-xl px-3 py-2"
													>
														<span className="text-white text-sm">
															{item}
														</span>
														<button
															type="button"
															onClick={() =>
																handleRemoveComponent(
																	idx
																)
															}
															className="cursor-pointer text-red-400 hover:text-red-300 transition-colors p-1"
														>
															<FontAwesomeIcon
																icon={
																	faTrashCan
																}
																className="text-sm"
															/>
														</button>
													</div>
												))}
											</div>
										)}
									</div>
								</div>

								{/* Time to Build */}
								<div>
									<label className="block mb-3 text-white font-semibold text-sm">
										Estimated Time to Build
									</label>
									<input
										type="text"
										value={timeToBuild}
										placeholder="e.g., 30 minutes, 2 hours"
										onChange={(e) =>
											setTimeToBuild(e.target.value)
										}
										className="text-sm w-full bg-[#2C2F36] border border-[#3A3A3C]/60 rounded-xl px-4 py-3 text-white/80 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#27BBFF] focus:border-[#27BBFF] transition-all duration-200"
									/>
								</div>

								{/* Tags */}
								<div>
									<label className="block mb-3 text-white font-semibold text-sm">
										Tags
										<span className="text-xs text-white/40 ml-2">
											(max 6)
										</span>
									</label>
									<div className="space-y-3">
										<div className="flex gap-2">
											<input
												ref={tagInputRef}
												type="text"
												value={newTag}
												placeholder="e.g., arduino, electronics, diy"
												onChange={(e) =>
													setNewTag(e.target.value)
												}
												className="text-sm flex-1 bg-[#2C2F36] border border-[#3A3A3C]/60 rounded-xl px-3 py-3 text-white/80 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#27BBFF] focus:border-[#27BBFF] transition-all duration-200"
											/>
											<button
												type="button"
												onClick={handleAddTag}
												disabled={tags.length >= 6}
												className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
													tags.length >= 6
														? 'bg-[#2C2F36] text-white/40 cursor-not-allowed'
														: 'bg-[#27BBFF] text-[#101014] hover:scale-105'
												}`}
											>
												Add
											</button>
										</div>

										{/* Tags List */}
										{tags.length > 0 && (
											<div className="flex flex-wrap gap-2">
												{tags.map((item, idx) => (
													<div
														key={idx}
														className="flex items-center gap-2 bg-[#27BBFF]/20 border border-[#27BBFF]/30 rounded-xl px-3 py-1"
													>
														<span className="text-[#27BBFF] text-sm font-medium">
															{item}
														</span>
														<button
															type="button"
															onClick={() =>
																handleRemoveTag(
																	idx
																)
															}
															className="cursor-pointer text-[#27BBFF] transition-colors"
														>
															×
														</button>
													</div>
												))}
											</div>
										)}
										<div className="text-center mt-6">
											<button
												onClick={handlePublish}
												disabled={isPublishing}
												className={`w-full cursor-pointer px-8 py-3 text-lg font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 ${
													isPublishing
														? 'bg-[#27BBFF] opacity-50 cursor-not-allowed'
														: 'bg-[#27BBFF] text-[#101014] shadow-lg hover:shadow-lg hover:shadow-[#27BBFF]/25'
												}`}
											>
												{isPublishing ? (
													<div className="flex items-center justify-center gap-3">
														<FontAwesomeIcon
															icon={faSpinner}
															spin
															className="text-xl"
														/>
														<span className="font-semibold">
															Publishing Your
															Project...
														</span>
													</div>
												) : (
													<div className="flex items-center justify-center gap-3">
														<span className="font-semibold">
															Publish Project
														</span>
													</div>
												)}
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</LayoutContainer>
			</section>
		</div>
	);
}
