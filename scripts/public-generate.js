/* Packages */
import fs from 'fs';
import path from 'path';

/* Scripts */
import { config } from './config.js';

const { site, theme } = config;
const { colors, favicons } = theme;
const jsonPath = path.resolve('./public/manifest.json');

/* Function to create favicon object */
const createFavicon = (favicon, sizes) => {
	return {
		src: favicon.file,
		type: favicon.type,
		sizes: sizes ?? favicon.size,
		purpose: favicon.purpose ?? 'any',
	};
};

/* Create manifest json object */
const jsonManifest = {
	short_name: site.name,
	name: site.description,
	icons: [createFavicon(favicons.favicon32, 'any'), createFavicon(favicons.favicon192), createFavicon(favicons.favicon512)],
	start_url: '.',
	display: 'standalone',
	theme_color: colors.color03,
	background_color: colors.color03,
};

/* Build manifest json */
fs.writeFileSync(jsonPath, JSON.stringify(jsonManifest));

console.log('🚀 Successfully built public/manifest.json. Re-build to generate new public code.');
