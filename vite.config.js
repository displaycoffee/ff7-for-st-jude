import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
	plugins: [react(), basicSsl()],
	server: {
		host: 'localhost',
		port: 3000,
	},
	root: 'src',
	build: {
		outDir: '../dist',
		rollupOptions: {
			output: {
				assetFileNames: (file) => {
					if (file.name.includes('.css')) {
						const suffix = file.name == 'index.css' ? `.css` : `.${file.name.toLowerCase()}`;
						return `assets/[ext]/styles${suffix}`;
					} else {
						return `assets/[ext]/[name].[ext]`;
					}
				},
				chunkFileNames: (file) => {
					return `assets/js/app.${file.name.toLowerCase()}.js`;
				},
				entryFileNames: 'assets/js/app.js',
			},
		},
	},
});