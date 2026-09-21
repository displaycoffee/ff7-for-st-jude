/* Packages */
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';
import sitemap from 'vite-plugin-sitemap';
import Icons from 'unplugin-icons/vite';

/* Scripts */
import { sitemapConfig } from './vite.sitemap.js';

export const viteUtils = {
	plugins: [
		react(),
		basicSsl(),
		sitemap(sitemapConfig),
		Icons({
			compiler: 'jsx',
			jsx: 'react',
		}),
	],
	assetFileNames: (file) => {
		if (file.name.includes('.css')) {
			const stem = file.name == 'index.css' ? `` : `.${file.name.toLowerCase().replace(/\.css$/, '')}`;
			return `assets/[ext]/styles${stem}.[hash].css`;
		} else {
			return `assets/[ext]/[name].[hash].[ext]`;
		}
	},
	chunkFileNames: (file) => {
		return `assets/js/bundle.${file.name.toLowerCase()}.[hash].js`;
	},
	entryFileNames: () => {
		return `assets/js/bundle.[hash].js`;
	},
};
