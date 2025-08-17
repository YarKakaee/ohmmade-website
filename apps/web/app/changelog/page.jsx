'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faPlus,
	faWrench,
	faBug,
	faCog,
	faChevronDown,
	faChevronUp,
	faCalendarAlt,
	faTag,
	faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import { Inter } from 'next/font/google';
import LayoutContainer from '@ohmmade/ui/layout-container';
import { changelog } from '@/lib/changelog';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

const categoryIcons = {
	added: {
		icon: faPlus,
		color: 'text-green-400',
		bg: 'bg-green-400/10',
		border: 'border-green-400/20',
	},
	improved: {
		icon: faWrench,
		color: 'text-blue-400',
		bg: 'bg-blue-400/10',
		border: 'border-blue-400/20',
	},
	fixed: {
		icon: faBug,
		color: 'text-orange-400',
		bg: 'bg-orange-400/10',
		border: 'border-orange-400/20',
	},
	technical: {
		icon: faCog,
		color: 'text-purple-400',
		bg: 'bg-purple-400/10',
		border: 'border-purple-400/20',
	},
};

const categoryLabels = {
	added: 'New Features',
	improved: 'Improvements',
	fixed: 'Bug Fixes',
	technical: 'Technical',
};

export default function ChangelogPage() {
	const [expandedItems, setExpandedItems] = useState({});
	const [expandedVersions, setExpandedVersions] = useState({ '1.1.0': true });

	const toggleItem = (versionId, categoryType, itemIndex) => {
		const key = `${versionId}-${categoryType}-${itemIndex}`;
		setExpandedItems((prev) => ({
			...prev,
			[key]: !prev[key],
		}));
	};

	const toggleVersion = (version) => {
		setExpandedVersions((prev) => ({
			...prev,
			[version]: !prev[version],
		}));
	};

	return (
		<div className="min-h-screen bg-[#101014] text-white">
			<LayoutContainer className="py-24 sm:py-32">
				{/* Header */}
				<div className="mb-12">
					<Link
						href="/"
						className="inline-flex items-center gap-2 text-[#27BBFF] hover:text-white transition-colors mb-6 group"
					>
						<FontAwesomeIcon
							icon={faArrowLeft}
							className="text-sm"
						/>
						<span className="group-hover:underline">
							Back to Home
						</span>
					</Link>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<h1
							className={`text-4xl md:text-5xl font-black mb-6 text-white leading-tight ${inter.className}`}
						>
							Changelog
						</h1>
						<p className="text-lg text-white/70 max-w-2xl leading-relaxed">
							Track the evolution of OhmMade with detailed release
							notes, new features, improvements, and bug fixes for
							each version.
						</p>
					</motion.div>
				</div>

				{/* Changelog Entries */}
				<div className="space-y-8">
					{changelog.map((version, versionIndex) => (
						<motion.div
							key={version.version}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{
								duration: 0.6,
								delay: versionIndex * 0.1,
							}}
							className="bg-[#13151A] border border-[#3A3A3C]/60 rounded-2xl overflow-hidden"
						>
							{/* Version Header */}
							<div
								className="p-6 border-b border-[#3A3A3C]/60 cursor-pointer hover:bg-[#1A1A1E] transition-colors"
								onClick={() => toggleVersion(version.version)}
							>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-4">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 bg-gradient-to-br from-[#27BBFF] to-[#1E40AF] rounded-xl flex items-center justify-center">
												<FontAwesomeIcon
													icon={faTag}
													className="text-white text-lg"
												/>
											</div>
											<div>
												<h2 className="text-2xl font-bold text-white">
													v{version.version}
												</h2>
												<div className="flex items-center gap-2 text-white/60">
													<FontAwesomeIcon
														icon={faCalendarAlt}
														className="text-sm"
													/>
													<span>{version.date}</span>
												</div>
											</div>
										</div>
									</div>
									<FontAwesomeIcon
										icon={
											expandedVersions[version.version]
												? faChevronUp
												: faChevronDown
										}
										className="text-white/60"
									/>
								</div>

								<div className="mt-4">
									<h3 className="text-xl font-semibold text-white mb-2">
										{version.title}
									</h3>
									<p className="text-white/70 leading-relaxed">
										{version.description}
									</p>
								</div>
							</div>

							{/* Version Content */}
							{expandedVersions[version.version] && (
								<div className="p-6 space-y-6">
									{version.categories.map(
										(category, categoryIndex) => {
											const categoryStyle =
												categoryIcons[category.type];

											return (
												<div
													key={category.type}
													className="space-y-4"
												>
													{/* Category Header */}
													<div className="flex items-center gap-3">
														<div
															className={`w-8 h-8 rounded-lg flex items-center justify-center ${categoryStyle.bg} border ${categoryStyle.border}`}
														>
															<FontAwesomeIcon
																icon={
																	categoryStyle.icon
																}
																className={`text-sm ${categoryStyle.color}`}
															/>
														</div>
														<h4 className="text-lg font-semibold text-white">
															{
																categoryLabels[
																	category
																		.type
																]
															}
														</h4>
														<div
															className={`px-2 py-1 rounded-md text-xs font-medium ${categoryStyle.bg} ${categoryStyle.color}`}
														>
															{
																category.items
																	.length
															}{' '}
															{category.items
																.length === 1
																? 'item'
																: 'items'}
														</div>
													</div>

													{/* Category Items */}
													<div className="space-y-3 ml-11">
														{category.items.map(
															(
																item,
																itemIndex
															) => {
																const isExpanded =
																	expandedItems[
																		`${version.version}-${category.type}-${itemIndex}`
																	];

																return (
																	<div
																		key={
																			itemIndex
																		}
																		className="bg-[#1A1A1E] border border-[#3A3A3C]/40 rounded-xl p-4"
																	>
																		<div
																			className="cursor-pointer"
																			onClick={() =>
																				toggleItem(
																					version.version,
																					category.type,
																					itemIndex
																				)
																			}
																		>
																			<div className="flex items-center justify-between">
																				<h5 className="font-semibold text-white hover:text-[#27BBFF] transition-colors">
																					{
																						item.title
																					}
																				</h5>
																				<FontAwesomeIcon
																					icon={
																						isExpanded
																							? faChevronUp
																							: faChevronDown
																					}
																					className="text-white/40 text-sm"
																				/>
																			</div>
																			<p className="text-white/70 text-sm mt-2 leading-relaxed">
																				{
																					item.description
																				}
																			</p>
																		</div>

																		{/* Item Details */}
																		{isExpanded &&
																			item.details && (
																				<motion.div
																					initial={{
																						opacity: 0,
																						height: 0,
																					}}
																					animate={{
																						opacity: 1,
																						height: 'auto',
																					}}
																					exit={{
																						opacity: 0,
																						height: 0,
																					}}
																					transition={{
																						duration: 0.3,
																					}}
																					className="mt-4 pt-4 border-t border-[#3A3A3C]/40"
																				>
																					<ul className="space-y-2">
																						{item.details.map(
																							(
																								detail,
																								detailIndex
																							) => (
																								<li
																									key={
																										detailIndex
																									}
																									className="flex items-start gap-2 text-sm text-white/60"
																								>
																									<span className="text-[#27BBFF] mt-1">
																										•
																									</span>
																									<span className="leading-relaxed">
																										{
																											detail
																										}
																									</span>
																								</li>
																							)
																						)}
																					</ul>
																				</motion.div>
																			)}
																	</div>
																);
															}
														)}
													</div>
												</div>
											);
										}
									)}
								</div>
							)}
						</motion.div>
					))}
				</div>

				{/* Footer */}
				<div className="mt-12 text-center">
					<p className="text-white/40 text-sm">
						Have suggestions or found a bug?
						<a
							href="https://support.ohmmade.ca"
							className="text-[#27BBFF] hover:text-white transition-colors ml-1"
						>
							Let us know
						</a>
					</p>
				</div>
			</LayoutContainer>
		</div>
	);
}
