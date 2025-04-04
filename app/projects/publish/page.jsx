'use client';
import CodexEditorWrapper from '@/app/components/CodexEditorWrapper';
import Footer from '@/app/components/Footer';
import {
	faArrowUpRightFromSquare,
	faChevronDown,
	faSpinner,
	faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createClient } from '@supabase/supabase-js';
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
	const [tags, setTags] = useState('');
	const [thumbnailUrl, setThumbnailUrl] = useState(null);
	const [user, setUser] = useState(null);
	const [isPublishing, setIsPublishing] = useState(false);

	const [checkingSession, setCheckingSession] = useState(true);

	const MAX_TITLE_LENGTH = 32;
	const MAX_DESCRIPTION_LENGTH = 195;

	const editorRef = useRef(null);
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
	);

	useEffect(() => {
		const fetchUser = async () => {
			const { data: sessionData } = await supabase.auth.getSession();
			if (sessionData?.session?.user) {
				setUser(sessionData.session.user);
			} else {
				redirect('/signin');
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

			await axios.post('/api/projects/create', {
				title: title,
				description: description,
				category,
				difficultyLevel,
				timeToBuild,
				tags: tags.split(',').map((t) => t.trim()),
				thumbnailUrl,
				content: editorData,
				slug,
				userId: user.id,
				username:
					user.user_metadata?.full_name || user.email?.split('@')[0],
				email: user.email,
				status: 'published',
			});

			toast.success('Project published!');

			// Clear everything
			await editorRef.current.clear();
			setTitle('');
			setDescription('');
			setCategory('');
			setDifficultyLevel('');
			setTimeToBuild('');
			setTags('');
			setThumbnailUrl(null);
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
						className={`text-[44px] font-extrabold mb-4 text-white leading-tight ${interTight.className}`}
					>
						Publish Your Project
					</h2>

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
							<button className="bg-[#343437] cursor-pointer text-white px-5 py-2 font-medium rounded-md text-sm hover:bg-[#3A3A3A] transition">
								Save draft
							</button>
							<button
								onClick={handlePublish}
								disabled={isPublishing}
								className={`px-5 py-2 text-sm font-medium rounded-md transition ${
									isPublishing
										? 'bg-[#27BBFF] opacity-50 cursor-not-allowed'
										: 'bg-[#27BBFF] text-[#101014] hover:brightness-110 cursor-pointer'
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
									want general information about what’s
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
										Category / Device{' '}
										<span className="text-[#FFC008]">
											*
										</span>
									</label>
									<div className="relative">
										<select
											className="cursor-pointer w-full bg-[#1C1C20] border border-[#6B6B6D] rounded-md px-3 py-2 pr-10 text-white/50 appearance-none focus:outline-none focus:ring-2 focus:ring-[#27BBFF] focus:ring-offset-0 font-medium text-[14px]"
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
										className="w-full bg-[#1C1C20] border border-[#6B6B6D] rounded-md px-3 py-2 resize-none h-30 placeholder:text-white/50 text-[14px]"
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
												className="w-[80px] h-[80px] rounded-md object-cover border border-[#6B6B6D]"
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

											console.log(
												'Thumbnail URL:',
												publicUrlData.publicUrl
											);
											setThumbnailUrl(
												publicUrlData.publicUrl
											); // 🟢 update preview
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
											className="cursor-pointer w-full bg-[#1C1C20] border border-[#6B6B6D] rounded-md px-3 py-2 pr-10 text-white/50 appearance-none focus:outline-none focus:ring-2 focus:ring-[#27BBFF] focus:ring-offset-0 font-medium text-[14px]"
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

								<div>
									<label className="block mb-1.5 text-white/60">
										Estimated Time to Build
									</label>
									<input
										type="text"
										value={timeToBuild}
										onChange={(e) =>
											setTimeToBuild(e.target.value)
										}
										className="w-full bg-[#1C1C20] border border-[#6B6B6D] rounded-md px-3 py-2 placeholder:text-white/50 text-[14px]"
										placeholder="e.g., 30 minutes, 2 hours – sets expectations."
									/>
								</div>

								<div className="mb-4">
									<label className="block mb-1.5 text-white/60">
										Tags
									</label>
									<input
										type="text"
										value={tags}
										onChange={(e) =>
											setTags(e.target.value)
										}
										className="w-full bg-[#1C1C20] border border-[#6B6B6D] rounded-md px-3 py-2 placeholder:text-white/50 text-[14px]"
										placeholder="e.g., arduino, RGB LED - helpful for search."
									/>
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
