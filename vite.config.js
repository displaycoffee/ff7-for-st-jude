import { defineConfig } from 'vite';
import { viteUtils } from './vite.utils';

export default defineConfig({
	root: 'src',
	publicDir: '../public',
	plugins: viteUtils.plugins,
	server: {
		host: 'localhost',
		port: 3000,
	},
	build: {
		outDir: '../dist',
		emptyOutDir: false,
		rollupOptions: {
			output: {
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
