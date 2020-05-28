function isPro() {
	return process.env.NODE_ENV === "production"
}

module.exports = {
	publicPath: isPro() ? "/" : "/",
	productionSourceMap: isPro() ? false : true,
	devServer: {
		proxy: {
			'/api': {
				target: 'http://relics-dev.wegfan.cn',
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					'^/api': '/api'
				}
			}
		}
	}
}
