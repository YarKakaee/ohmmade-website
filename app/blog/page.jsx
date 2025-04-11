import prisma from '@/prisma/client';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import ImageWithFallback from '@/app/components/ImageWithFallback';

export default async function BlogPage() {
	const blogs = await prisma.blog.findMany({
		where: {
			published: true,
		},
		include: {
			author: {
				select: {
					name: true,
					image: true,
				},
			},
		},
		orderBy: {
			createdAt: 'desc',
		},
	});

	return (
		<div className="min-h-screen bg-gradient-to-b from-[#101014] to-[#1a1a1f] pt-24 pb-12">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="text-center mb-16 relative">
					<div className="absolute inset-0 bg-gradient-to-r from-[#27BBFF]/20 to-[#FF4D4D]/20 blur-3xl -z-10" />
					<h1 className="text-5xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#27BBFF] to-[#FF4D4D]">
						OhmMade Blog
					</h1>
					<p className="text-white/70 max-w-2xl mx-auto text-lg">
						Discover the latest in electronics, Arduino, Raspberry
						Pi, and more. From tutorials to project ideas, we've got
						you covered.
					</p>
				</div>

				{/* Blog Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{blogs.map((blog) => (
						<Link
							key={blog.id}
							href={`/blog/${blog.slug}`}
							className="group"
						>
							<article className="bg-[#1C1C20]/50 backdrop-blur-sm rounded-2xl overflow-hidden transition-all duration-300 hover:transform hover:scale-[1.02] border border-white/10 hover:border-[#27BBFF]/30">
								{blog.imageUrl && (
									<div className="relative h-48 w-full">
										<ImageWithFallback
											src={blog.imageUrl}
											alt={blog.title}
											fallbackSrc="/images/placeholder-blog.jpg"
											fill
											className="object-cover transition-transform duration-300 group-hover:scale-110"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
									</div>
								)}
								<div className="p-6">
									<div className="flex items-center gap-2 mb-4">
										{blog.author.image && (
											<div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-[#27BBFF]/30">
												<ImageWithFallback
													src={blog.author.image}
													alt={blog.author.name}
													fallbackSrc="/images/default-avatar.png"
													fill
													className="object-cover"
												/>
											</div>
										)}
										<span className="text-white/80 text-sm font-medium">
											{blog.author.name}
										</span>
										<span className="text-white/40">•</span>
										<span className="text-white/60 text-sm">
											{formatDistanceToNow(
												new Date(blog.createdAt),
												{
													addSuffix: true,
												}
											)}
										</span>
									</div>
									<h2 className="text-xl font-bold text-white mb-3 group-hover:text-[#27BBFF] transition-colors">
										{blog.title}
									</h2>
									<p className="text-white/60 line-clamp-2 mb-4">
										{blog.excerpt}
									</p>
									<div className="flex flex-wrap gap-2">
										{blog.tags.map((tag) => (
											<span
												key={tag}
												className="px-3 py-1 bg-[#2C2F36]/50 text-white/70 text-sm rounded-full border border-white/10 hover:border-[#27BBFF]/30 transition-colors"
											>
												{tag}
											</span>
										))}
									</div>
								</div>
							</article>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
