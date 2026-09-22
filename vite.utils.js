/* Packages */
import tanstackRouter from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';
import sitemap from 'vite-plugin-sitemap';
import Icons from 'unplugin-icons/vite';

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
		Icons({
			compiler: 'jsx',
			jsx: 'react',
		}),
	],
	getRouteName: (filePath) => {
		if (!filePath) return null;
		const segments = filePath.replace(/\\/g, '/').split('/');
		const routesIndex = segments.lastIndexOf('routes');

		if (routesIndex == -1) return null;
		const routeSegments = segments.slice(routesIndex + 1, -1).filter((segment) => !segment.startsWith('('));

		return routeSegments.length != 0 ? routeSegments[routeSegments.length - 1] : 'index';
	},
	assetFileNames: (file) => {
		if (file.name.includes('.css')) {
			const routeName = file.name == 'index.css' ? viteUtils.getRouteName(file.originalFileNames?.[0]) : file.name.replace(/\.css$/, '');
			const stem = routeName ? `.${routeName.toLowerCase()}` : '';
			return `assets/[ext]/styles${stem}.[hash].css`;
		} else {
			return `assets/[ext]/[name].[hash].[ext]`;
		}
	},
	chunkFileNames: (file) => {
		const isGenericName = file.name == 'index' || file.name == 'index.lazy';
		const routeName = isGenericName ? viteUtils.getRouteName(file.facadeModuleId) : null;
		const suffix = file.name.endsWith('.lazy') ? '.lazy' : '';
		return `assets/js/bundle.${(routeName ?? file.name).toLowerCase()}${routeName ? suffix : ''}.[hash].js`;
	},
	entryFileNames: () => {
		return `assets/js/bundle.[hash].js`;
	},
};
