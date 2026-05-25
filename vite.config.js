import { defineConfig } from 'vite';
import { viteUtils } from './vite.utils';

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
				manualChunks: {
					tanstack: ['@tanstack/react-query'],
					vendor: ['react', 'react-dom', 'react-router-dom'],
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
