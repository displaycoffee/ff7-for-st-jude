const { merge } = require('webpack-merge');
const webpCommonConfig = require('./webpack.common.js');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const historyApiFallback = require('connect-history-api-fallback');

// Dev config
const webpDevConfig = {
	mode: 'development',
};

// Add browserstack for dev testing
webpCommonConfig.plugins.push(
	new BrowserSyncPlugin({
		host: 'localhost',
		port: 3333,
		files: ['*.html'],
		server: {
			baseDir: webpCommonConfig.output.path,
			middleware: [historyApiFallback()],
		},
	})
);

module.exports = merge(webpCommonConfig, webpDevConfig);
