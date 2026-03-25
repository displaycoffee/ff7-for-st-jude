import fs from 'fs';
import path from 'path';

// Path to your built index.html
const htmlPath = path.resolve('dist/index.html');

if (fs.existsSync(htmlPath)) {
	let html = fs.readFileSync(htmlPath, 'utf8');

	// 1. CSS print hack
	const cssRegex = /<link rel="stylesheet" crossorigin href="([^"]+)">/g;
	html = html.replace(cssRegex, (match, href) => {
		return `<link rel="stylesheet" href="${href}" media="print" onload="this.media='all'" />
		<noscript><link rel="stylesheet" href="${href}" /></noscript>`;
	});

	// 2. Extract and remove the preloaded-styles block
	const preloadedStylesRegex = /<style id="preloaded-styles">([\s\S]*?)<\/style>/;
	const preloadedStylesMatch = html.match(preloadedStylesRegex);
	let fullStyleBlock = '';

	if (preloadedStylesMatch) {
		fullStyleBlock = preloadedStylesMatch[0];
		html = html.replace(preloadedStylesRegex, '');
	}

	// 3. Re-inject font-face block after bundle.vendor.js
	if (fullStyleBlock) {
		const linkTag = '<link rel="modulepreload" crossorigin href="/assets/js/bundle.vendor.js">';
		html = html.replace(linkTag, `${linkTag}\n${fullStyleBlock}`);
	}

	// 4. Collapse empty lines in <head>
	// This looks for the <head> section and finds any instance of 2+ newlines
	html = html.replace(/<head>([\s\S]*?)<\/head>/, (match, headContent) => {
		const cleanedContent = headContent
			.replace(/^\s*[\r\n]/gm, '') // remove empty lines
			.replace(/[ \t]+$/gm, '') // remove trailing spaces on lines
			.trimEnd(); // clean up the very end before </head>

		return `<head>${cleanedContent}\n</head>`;
	});

	// Update html
	fs.writeFileSync(htmlPath, html);

	console.log('🚀 Lighthouse Optimization: Preloads added and custom order applied!');
} else {
	console.error('❌ Error: dist/index.html not found. Run "npm run build" first.');
}
