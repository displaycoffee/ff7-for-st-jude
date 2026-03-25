import packageJSON from './package.json';
const hostname = packageJSON.homepage || 'https://localhost:3000';
const location = new URL(hostname);

let sitemap = {
	hostname: location.origin,
	readable: true,
	exclude: [
		'/assets',
		'/assets/css',
		'/assets/documents',
		'/assets/fonts',
		'/assets/images',
		'/assets/images/art',
		'/assets/images/articles',
		'/assets/images/cheat-codes',
		'/assets/images/projects',
		'/assets/images/theme',
		'/assets/js',
	],
	dynamicRoutes: ['/about', '/projects', '/art', '/resume', '/articles', '/cheat-codes'],
};
if (location?.pathname && location.pathname != '/') {
	sitemap.basePath = location.pathname;
}

export const sitemapConfig = sitemap;
