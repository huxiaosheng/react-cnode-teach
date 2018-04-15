const path = require('path')

module.exports = {
    // 入口文件
    entry: {
        app: path.join(__dirname, '../client/server-entry.js')
    }, 
    devtool: 'inline-source-map',


    //出口文件
    output: {
        filename: 'server-entry.js',
        path: path.join(__dirname, '../dist'),
        publicPath: 'public',
        libraryTarget:'commonjs2'   //通用模块定义，这里使用commonjs2 的模块化方案
    },


    //module 配置
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /.(js|jsx)$/,
                loader: 'eslint-loader',
                exclude:[
                    path.resolve(__dirname,'../node_modules')
                ]
            },
            {
                test: /\.jsx$/,
                loader: 'babel-loader'
            },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader'
            }
        ]
    },


    plugins: [

    ]


}