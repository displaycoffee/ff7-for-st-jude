/* Packages */
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

/* Scripts */
import { viteUtils } from './vite.utils.js';

const modules = 'node_modules/';
const reactChunks = [`${modules}react/`, `${modules}react-dom/`];
const tanstackChunks = [`${modules}@tanstack/react-router/`, `${modules}@tanstack/react-query/`];

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
		tsconfigPaths: true, // Resolve the @/ alias (maps to src) from tsconfig.json paths
	},
	css: {
		preprocessorOptions: {
			scss: {
				loadPaths: [fileURLToPath(new URL('./src', import.meta.url))], // Lets Sass @use files from src without relative paths, e.g. @use '_core/styles/_theme'
			},
		},
	},
	build: {
		outDir: '../dist',
		emptyOutDir: true,
		cssTarget: viteUtils.cssTarget,
		modulePreload: {
			polyfill: false,
		},
		rollupOptions: {
			output: {
				manualChunks: (id) => {
					if (tanstackChunks.some((chunk) => id.includes(chunk))) return 'tanstack';
					if (reactChunks.some((chunk) => id.includes(chunk))) return 'vendor';
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
