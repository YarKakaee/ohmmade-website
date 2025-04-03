'use client';
import {
	faArrowUpRightFromSquare,
	faChevronDown,
	faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Inter_Tight } from 'next/font/google';
import { useState } from 'react';
import CodexEditorWrapper from '@/app/components/CodexEditorWrapper';
import { createClient } from '@supabase/supabase-js';

const interTight = Inter_Tight({ subsets: ['latin'] });

export default function PublishProjectPage() {
	const [thumbnailUrl, setThumbnailUrl] = useState(null); // 🟡 store uploaded image
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
	);
	const [title, setTitle] = useState('');

	return (
		<div className="relative min-h-screen bg-[#101014] overflow-hidden">
			<section className="relative w-full py-16 px-8 sm:px-16 lg:px-24">
				<div className="max-w-[1700px] mx-auto px-8 sm:px-16 py-20">
					<h2
						className={`text-[44px] font-extrabold mb-4 text-white leading-tight ${interTight.className}`}
					>
						Publish Your Project
					</h2>

					<div className="w-full h-17 flex items-center justify-between px-8 border-b border-white/60">
						<input
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Enter title here..."
							className="bg-transparent text-white text-[17px] placeholder-white/50 focus:outline-none w-2/3 font-medium"
						/>
						<div className="space-x-2">
							<button className="bg-[#343437] cursor-pointer text-white px-5 py-2 font-medium rounded-md text-sm hover:bg-[#3A3A3A] transition">
								Save draft
							</button>
							<button className="bg-[#27BBFF] cursor-pointer text-[#101014] px-5 py-2 font-medium rounded-md text-sm hover:brightness-110 transition">
								Publish
							</button>
						</div>
					</div>

					{/* Main Content Area */}
					<div className="flex">
						{/* Left: Editor */}
						<div className="w-2/3 border-r border-white/60 min-h-[600px] p-8 text-white/50">
							<CodexEditorWrapper />
						</div>

						{/* Right: Sidebar */}
						<div className="w-1/3 space-y-6">
							<div className="px-8 pt-4.5 text-sm text-white">
								<p className="text-sm text-[#055160]/90 bg-[#CFF4FC] px-3 py-2 rounded-md mb-4">
									Please note that your tutorial will be
									posted after review.
								</p>
								<h3 className="text-white font-bold text-lg mb-2">
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
									href="/project-guidelines"
									className="inline-flex items-center mt-4 text-sm bg-[#343437] rounded-md px-3 py-2 text-white hover:bg-[#2F2F31] transition"
								>
									Project Guidelines{' '}
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
											defaultValue=""
										>
											<option value="" disabled>
												Select...
											</option>
											<option>General Circuitry</option>
											<option>Arduino UNO</option>
											<option>Raspberry Pi 4</option>
											<option>Raspberry Pi Pico W</option>
											<option>Others</option>
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
										maxLength={195}
										placeholder="A quick summary of what the project is and what it does. Shown on cards/search."
									/>
									<p className="text-xs text-white/50 mt-1">
										Description is limited to 195 characters
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
												JPG, PNG (recommended size:
												1580x1060)
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
											defaultValue=""
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
										className="w-full bg-[#1C1C20] border border-[#6B6B6D] rounded-md px-3 py-2 placeholder:text-white/50 text-[14px]"
										placeholder="e.g., 30 minutes, 2 hours – sets expectations."
									/>
								</div>

								<div className="mb-10">
									<label className="block mb-1.5 text-white/60">
										Tags
									</label>
									<input
										type="text"
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
		</div>
	);
}
