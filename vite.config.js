import { defineConfig } from 'vite';
import { viteUtils } from './vite.utils.js';

export default defineConfig({
	root: 'src',
	publicDir: '../public',
	envDir: '../',
	plugins: viteUtils.plugins,
	server: {
		host: 'localhost',
		port: 3000,
	},
	resolve: {
		dedupe: ['react', 'react-dom'],
	},
	build: {
		outDir: '../dist',
		emptyOutDir: false,
		modulePreload: {
			polyfill: false,
		},
		rollupOptions: {
			output: {
				manualChunks: (id) => {
					if (id.includes('node_modules/@tanstack/react-query/')) {
						return 'tanstack';
					}
					if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react-router-dom/')) {
						return 'vendor';
					}
				},
				assetFileNames: (file) => {
					return viteUtils.assetFileNames(file);
				},
				chunkFileNames: (file) => {
					return viteUtils.chunkFileNames(file);
				},
				entryFileNames: () => {
					return viteUtils.entryFileNames();
				},
			},
		},
	},
});
