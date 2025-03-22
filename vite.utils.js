import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

export const viteUtils = {
	plugins: [react(), basicSsl()],
	assetFileNames: (file) => {
		if (file.name.includes('.css')) {
			const suffix = file.name == 'index.css' ? `.css` : `.${file.name.toLowerCase()}`;
			return `assets/[ext]/styles${suffix}`;
		} else {
			return `assets/[ext]/[name].[ext]`;
		}
	},
	chunkFileNames: (file) => {
		return `assets/js/bundle.${file.name.toLowerCase()}.js`;
	},
	entryFileNames: () => {
		return `assets/js/bundle.js`;
	},
};
