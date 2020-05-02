module.exports = {
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
