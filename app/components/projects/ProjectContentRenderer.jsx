'use client';
import React from 'react';

export default function ProjectContentRenderer({ data }) {
	const renderBlock = (block) => {
		const { type, data } = block;
		switch (type) {
			case 'paragraph':
				return <p>{data.text}</p>;
			case 'header':
				return React.createElement(`h${data.level}`, {}, data.text);
			case 'list':
				const Tag = data.style === 'unordered' ? 'ul' : 'ol';
				return (
					<Tag>
						{data.items.map((item, i) => (
							<li key={i}>{item}</li>
						))}
					</Tag>
				);
			case 'code':
				return (
					<pre>
						<code>{data.code}</code>
					</pre>
				);
			case 'quote':
				return <blockquote>{data.text}</blockquote>;
			case 'image':
				return (
					<figure>
						<img
							src={data.file?.url}
							alt={data.caption || 'Image'}
						/>
						<figcaption>{data.caption}</figcaption>
					</figure>
				);
			default:
				return null;
		}
	};

	return (
		<div className="space-y-6 text-white max-w-2xl">
			{data?.blocks?.map((block, i) => (
				<div key={i}>{renderBlock(block)}</div>
			))}
		</div>
	);
}
