/* Packages */
import tanstackRouter from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';
import sitemap from 'vite-plugin-sitemap';
import Icons from 'unplugin-icons/vite';
import { assetFileNames, chunkFileNames, entryFileNames, tokensWatch } from '@displaycoffee/burmecia/vite';

/* Scripts */
import { sitemapConfig } from './vite.sitemap.js';

export const viteUtils = {
	plugins: [
		tanstackRouter({
			routesDirectory: './routes',
			generatedRouteTree: './routeTree.gen.ts',
			routeFileIgnorePattern: '^(scripts|styles)$',
		}),
		react(),
		basicSsl(),
		sitemap(sitemapConfig),
		tokensWatch(),
		Icons({
			compiler: 'jsx',
			jsx: 'react',
		}),
	],
	assetFileNames,
	chunkFileNames,
	entryFileNames,
};
