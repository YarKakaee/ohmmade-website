import prisma from '@/prisma/client';
import { notFound } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import CodexViewer from '@/app/components/CodexViewer';
import ImageWithFallback from '@/app/components/ImageWithFallback';

export default async function BlogPostPage({ params }) {
	const slug = await Promise.resolve(params.slug);

	const blog = await prisma.blog.findUnique({
		where: { slug },
		include: {
			author: {
				select: {
					name: true,
					image: true,
				},
			},
		},
	});

	if (!blog || !blog.published) {
		notFound();
	}

	// Increment view count
	await prisma.blog.update({
		where: { id: blog.id },
		data: { views: { increment: 1 } },
	});

	return (
		<div className="min-h-screen bg-gradient-to-b from-[#101014] to-[#1a1a1f] pt-24 pb-12">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<header className="mb-16 relative">
					{blog.imageUrl && (
						<div className="relative h-[400px] w-full mb-12 rounded-2xl overflow-hidden">
							<ImageWithFallback
								src={blog.imageUrl}
								alt={blog.title}
								fallbackSrc="/images/placeholder-blog.jpg"
								fill
								className="object-cover"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-[#101014] via-[#101014]/80 to-transparent" />
						</div>
					)}
					<div className="relative z-10">
						<div className="absolute inset-0 bg-gradient-to-r from-[#27BBFF]/20 to-[#FF4D4D]/20 blur-3xl -z-10" />
						<h1 className="text-5xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#27BBFF] to-[#FF4D4D]">
							{blog.title}
						</h1>
						<div className="flex items-center gap-4 text-white/70">
							<div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-[#27BBFF]/30">
								<ImageWithFallback
									src={blog.author.image}
									alt={blog.author.name}
									fallbackSrc="/images/default-avatar.png"
									fill
									className="object-cover"
								/>
							</div>
							<div>
								<p className="text-white font-medium">
									{blog.author.name}
								</p>
								<p className="text-sm">
									{formatDistanceToNow(
										new Date(blog.createdAt),
										{
											addSuffix: true,
										}
									)}
									{' • '}
									<span className="text-[#27BBFF]">
										{blog.views} views
									</span>
								</p>
							</div>
						</div>
					</div>
				</header>

				{/* Content */}
				<article className="prose prose-invert max-w-none prose-headings:text-white prose-a:text-[#27BBFF] prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-code:text-[#27BBFF] prose-pre:bg-[#1C1C20]/50 prose-pre:border prose-pre:border-white/10">
					<CodexViewer data={blog.content} />
				</article>

				{/* Tags */}
				<div className="mt-16 pt-8 border-t border-white/10">
					<h2 className="text-2xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#27BBFF] to-[#FF4D4D]">
						Tags
					</h2>
					<div className="flex flex-wrap gap-3">
						{blog.tags.map((tag) => (
							<span
								key={tag}
								className="px-4 py-2 bg-[#2C2F36]/50 text-white/70 rounded-full border border-white/10 hover:border-[#27BBFF]/30 transition-colors"
							>
								{tag}
							</span>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export async function generateMetadata({ params }) {
	const slug = await Promise.resolve(params.slug);
	const blog = await prisma.blog.findUnique({
		where: { slug },
		select: { title: true, excerpt: true },
	});

	if (!blog) {
		return {
			title: 'Blog Post Not Found | OhmMade',
		};
	}

	return {
		title: `${blog.title} | OhmMade Blog`,
		description: blog.excerpt,
	};
}
