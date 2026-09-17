/* Packages */
import { createServer } from 'vite';

/* Scripts */
import packageJSON from '../package.json' with { type: 'json' };

/* Note: theme.ts pulls in a .scss CSS-module export, which only plain `node` can't
   process on its own — load it through Vite's SSR pipeline instead so the
   same transforms (Sass, CSS modules) apply as in the app itself. */
const viteServer = await createServer({
	server: { middlewareMode: true },
	appType: 'custom',
});
const { theme } = await viteServer.ssrLoadModule('/_core/scripts/theme.ts');
await viteServer.close();

/* Variables */
const fontsPath = '/assets/fonts/';

/* Set favicons from public folder */
const favicons = {
	favicon16: {
		file: '/favicon.ico',
		size: '16x16',
	},
	favicon32: {
		file: '/favicon.svg',
		size: '32x32',
	},
	favicon92: {
		file: '/favicon-92x92.png',
		size: '92x92',
	},
	favicon180: {
		file: '/apple-touch-icon.png',
		size: '180x180',
	},
	favicon192: {
		file: '/favicon-192x192.png',
		size: '192x192',
	},
	favicon512: {
		file: '/favicon-512x512.png',
		purpose: 'maskable',
		size: '512x512',
	},
};

/* Add properties to favicons */
const faviconKeys = Object.keys(favicons);
faviconKeys.forEach((icon) => {
	const current = favicons[icon];

	// Set rel attribute
	const rel = current.file.includes('apple-touch-icon') ? 'apple-touch-icon' : 'icon';

	// Set type attribute
	let type = 'image/png';
	if (current.file.includes('.svg')) {
		type = 'image/svg+xml';
	} else if (current.file.includes('.ico')) {
		type = 'image/x-icon';
	}

	// Add properties
	favicons[icon]['rel'] = rel;
	favicons[icon]['type'] = type;
});

export const config = {
	site: {
		name: packageJSON.displayName || '',
		description: packageJSON.description || '',
		url: packageJSON.homepage || 'https://localhost:3000',
	},
	targets: [
		{
			name: `index`,
			file: `./targets/index/Index.tsx`,
			hasTabindex: true,
			isScript: true,
		},
		{
			name: `portal`,
			file: `./targets/portal/Portal.tsx`,
			hasTabindex: false,
			isScript: false,
		},
	],
	theme: {
		...theme,
		favicons: favicons,
		fonts: [
			{
				family: `Open Sans`,
				file: `${fontsPath}open-sans-regular.woff2`,
				weight: `normal`,
				style: `normal`,
				display: `swap`,
			},
			{
				family: `Open Sans`,
				file: `${fontsPath}open-sans-italic.woff2`,
				weight: `normal`,
				style: `italic`,
				display: `swap`,
			},
			{
				family: `Open Sans`,
				file: `${fontsPath}open-sans-bold.woff2`,
				weight: `700`,
				style: `normal`,
				display: `swap`,
			},
			{
				family: `Open Sans`,
				file: `${fontsPath}open-sans-bold-italic.woff2`,
				weight: `700`,
				style: `italic`,
				display: `swap`,
			},
			{
				family: `Montserrat`,
				file: `${fontsPath}montserrat-regular.woff2`,
				weight: `normal`,
				style: `normal`,
				display: `swap`,
			},
			{
				family: `Montserrat`,
				file: `${fontsPath}montserrat-italic.woff2`,
				weight: `normal`,
				style: `italic`,
				display: `swap`,
			},
			{
				family: `Montserrat`,
				file: `${fontsPath}montserrat-bold.woff2`,
				weight: `700`,
				style: `normal`,
				display: `swap`,
			},
			{
				family: `Montserrat`,
				file: `${fontsPath}montserrat-bold-italic.woff2`,
				weight: `700`,
				style: `italic`,
				display: `swap`,
			},
		],
	},
};
