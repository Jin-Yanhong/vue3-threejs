const {defineConfig} = require('@vue/cli-service');

module.exports = defineConfig({
    publicPath: process.env.NODE_ENV === 'production' ? '/vue3-threejs' : '/',
    lintOnSave: process.env.NODE_ENV === 'development',
    transpileDependencies: true,
    productionSourceMap: false,
    devServer: {
        port: 3000,
        open: true,
        host: 'localhost',
        proxy: {
            [process.env.VUE_APP_BASE_API]: {
                target: process.env.VUE_APP_SERVER_URL,
                changeOrigin: true, // needed for virtual hosted sites
                ws: true, // proxy websockets
                pathRewrite: {
                    ['^' + process.env.VUE_APP_BASE_API]: ''
                }
            }
        }
    },
    configureWebpack: {
        experiments: {
            topLevelAwait: true
        }
    }
});
