/* Packages */
import fs from 'fs';
import path from 'path';

const htmlPath = path.resolve('dist/index.html');
const bundle = 'bundle.tanstack'; // The name of the bundle you want to inject font blocks after.

if (fs.existsSync(htmlPath)) {
	let html = fs.readFileSync(htmlPath, 'utf8');

	// CSS print hack
	const cssRegex = /<link rel="stylesheet" crossorigin href="([^"]+)">/g;
	html = html.replace(cssRegex, (match, href) => {
		return `<link rel="stylesheet" href="${href}" media="print" onload="this.media='all'" />
		<noscript><link rel="stylesheet" href="${href}" /></noscript>`;
	});

	// Extract and remove the preloaded-styles block
	const preloadedStylesRegex = /<style id="preloaded-styles">([\s\S]*?)<\/style>/;
	const preloadedStylesMatch = html.match(preloadedStylesRegex);
	let fullStyleBlock = '';
	if (preloadedStylesMatch) {
		fullStyleBlock = preloadedStylesMatch[0];
		html = html.replace(preloadedStylesRegex, '');
	}

	// Re-inject font-face block after bundle
	if (fullStyleBlock) {
		const escapedBundle = bundle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const bundleLinkRegex = new RegExp(`<link rel="modulepreload" crossorigin href="/assets/js/${escapedBundle}\\.[^"]+\\.js">`);
		const bundleLinkMatch = html.match(bundleLinkRegex);
		if (bundleLinkMatch) {
			const linkTag = bundleLinkMatch[0];
			html = html.replace(linkTag, `${linkTag}\n${fullStyleBlock}`);
		}
	}

	// Collapse empty lines in <head>
	// This looks for the <head> section and finds any instance of 2+ newlines
	html = html.replace(/<head>([\s\S]*?)<\/head>/, (match, headContent) => {
		const cleanedContent = headContent
			.replace(/^\s*[\r\n]/gm, '')
			.replace(/[ \t]+$/gm, '')
			.trimEnd();
		return `<head>${cleanedContent}\n</head>`;
	});

	// Build html
	fs.writeFileSync(htmlPath, html);

	console.log('🚀 Successfully built dist/index.html. Preloads added and custom order applied!');
} else {
	console.error('❌ Error: dist/index.html not found. Run "npm run build" first.');
}
