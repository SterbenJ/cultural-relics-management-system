module.exports = {
	publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
	devServer: {
		proxy: {
			'/api': {
				target: 'http://relics.wegfan.cn',
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					'^/api': '/api'
				}
			}
		}
	}
}
