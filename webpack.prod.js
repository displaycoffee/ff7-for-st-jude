const { merge } = require('webpack-merge');
const webpCommonConfig = require('./webpack.common.js');

// Prod config
const webpProdConfig = {
	mode: 'production'
};

module.exports = merge(webpCommonConfig, webpProdConfig);