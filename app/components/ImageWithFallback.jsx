'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function ImageWithFallback({
	src,
	alt,
	fallbackSrc,
	className,
	fill,
	...props
}) {
	const [imgSrc, setImgSrc] = useState(src);

	return (
		<Image
			src={imgSrc}
			alt={alt}
			className={className}
			fill={fill}
			onError={() => setImgSrc(fallbackSrc)}
			{...props}
		/>
	);
}
