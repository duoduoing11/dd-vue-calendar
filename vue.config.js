//  vue.config.js
const path = require('path')
module.exports = {
    baseUrl: './',
    pages: {
        index: {
            entry: 'src/main.js',
            template: 'public/index.html',
            filename: 'index.html',
        }
    },
    chainWebpack: config => {
        config.resolve.alias
            .set('plugins', path.join(__dirname, './src/plugins'))
            .set('@components', path.join(__dirname, './src/components'))
            .set('@styles', path.join(__dirname, './src/styles'))
            .set('@assets', path.join(__dirname, './src/assets'))
            .set('@images', path.join(__dirname, './src/assets/images'))
            .set('@', path.join(__dirname, 'src'))
            .set('jquery', path.join(__dirname, 'node_modules/jquery/src/jquery'))
    }
}
