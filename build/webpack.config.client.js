const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const CleanWebpackPlugin = require('clean-webpack-plugin')


const isDev = process.env.NODE_ENV === 'development'


const config = {
    // 入口文件
    entry: {
        app: path.join(__dirname, '../client/app.js')
    },

    devtool: 'inline-source-map',


    //出口文件
    output: {
        filename: '[name].[hash].js',
        path: path.join(__dirname, '../dist'),
        publicPath: '/public/',
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


        /*         //没起作用
                new CleanWebpackPlugin(['../dist'], {
                    root: __dirname,  //根目录
                    verbose: true,  //开启在控制台输出信息
                    dry: false    //启用删除文件
                }),
         */
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '../client/template.html')
        })
    ]


}


if (isDev) {
    config.entry = {
        app: [
            'react-hot-loader/patch',   //在客户端热更新代码时用到的内容
            path.join(__dirname, '../client/app.js')
        ]
    }

    config.devServer = {
        host: '0.0.0.0',
        port: '8888',
        contentBase: path.join(__dirname, '../dist'),
        hot: true,
        overlay: {   //
            errors: true
        },
        publicPath: '/public/',
        historyApiFallback: {
            index: '/public/index.html'
        }
    }

    config.plugins.push(new webpack.HotModuleReplacementPlugin())
}
module.exports = config