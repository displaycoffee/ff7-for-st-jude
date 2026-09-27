/* Packages */
import { execFile } from 'child_process';
import path from 'path';

/* Paths */
const projectPath = path.resolve(import.meta.dirname, '..');
const tokensPath = path.resolve(projectPath, 'src/_core/tokens');
const scriptPath = path.resolve(import.meta.dirname, 'tokens-generate.js');

/* Vite plugin that rebuilds tokens when a token file changes during dev, so the regenerated Sass hot reloads like any other change */
/* Note: theme.json is generated into the tokens folder, so it's ignored to avoid a rebuild loop */
export const tokensWatch = () => {
	let isRunning = false;
	let isQueued = false;

	return {
		name: 'tokens-watch',
		apply: 'serve',
		configureServer(server) {
			const { logger } = server.config;

			// Run tokens-generate.js, queuing one more run if a token file changes while it's still building
			const buildTokens = () => {
				if (isRunning) {
					isQueued = true;
					return;
				}

				isRunning = true;
				execFile(process.execPath, [scriptPath], { cwd: projectPath }, (error, _stdout, stderr) => {
					isRunning = false;

					if (error) {
						logger.error(`[tokens] ${stderr || error.message}`, { timestamp: true });
					} else {
						logger.info('[tokens] rebuilt _root.scss, _theme.scss, and theme.json', { timestamp: true });
					}

					if (isQueued) {
						isQueued = false;
						buildTokens();
					}
				});
			};

			// Only rebuild for token source files (not the generated theme.json)
			const handleTokenFile = (file) => {
				const filePath = path.resolve(file);
				const isTokenFile = path.dirname(filePath) === tokensPath && filePath.endsWith('.json') && path.basename(filePath) !== 'theme.json';
				if (isTokenFile) buildTokens();
			};

			server.watcher.add(tokensPath);
			server.watcher.on('add', handleTokenFile);
			server.watcher.on('change', handleTokenFile);
			server.watcher.on('unlink', handleTokenFile);
		},
	};
};
