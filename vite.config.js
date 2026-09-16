import { defineConfig } from 'vite';
import { viteUtils } from './vite.utils.js';

const modules = 'node_modules/';
const reactChunks = [`${modules}react/`, `${modules}react-dom/`, `${modules}react-router-dom/`];
const tanstackChunks = [`${modules}@tanstack/react-query/`];

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
					if (tanstackChunks.includes(id)) return 'tanstack';
					if (reactChunks.includes(id)) return 'vendor';
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
