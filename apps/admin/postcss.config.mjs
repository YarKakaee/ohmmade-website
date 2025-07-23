/** @type {import('postcss-load-config').Config} */
const config = {
	plugins: [
		[
			'@tailwindcss/postcss',
			{
				content: [
					'./app/**/*.{js,jsx,tsx,mdx}',
					'./components/**/*.{js,jsx,tsx,mdx}',
					'!./**/node_modules/**',
					'!./**/.next/**',
				],
			},
		],
	],
};

export default config;
