const axios = require('axios')
const path = require('path')
const webpack = require('webpack')
const MemoryFs = require('memory-fs')
const proxy = require('http-proxy-middleware')
const ReactDomServer = require('react-dom/server')

const serverConfig = require('../../build/webpack.config.server')



const getTemplate = () => {
    return new Promise((resolve, reject) => {
        axios.get('http://localhost:8888/public/index.html')
            .then(res => {
                resolve(res.data)
            })
            .catch(reject)
    })
}

const Module = module.constructor
const mfs = new MemoryFs    //通过内存的方式读写文件，有nodejs，fs模块的所有方法 
const serverCompiler = webpack(serverConfig)
serverCompiler.outputFileSystem = mfs   //使用内存读写，更快
let serverBundle

/** 一、
 * 1.使用服务端webpack文件，并监听
 * 2.使用内存读写的方式，然后导出commjs的js模块
 */
serverCompiler.watch({}, (err, stats) => {
    if (err) throw err
    stats = stats.toJson()
    stats.errors.forEach(err => console.error(err))
    stats.warnings.forEach(warn => console.warn(warn))

    const bundlePath = path.join(
        serverConfig.output.path,
        serverConfig.output.filename
    )

    //1.读取webpack导出文件，是字符串
    //2.转换成commjs 模块文件，并导出
    const bundle = mfs.readFileSync(bundlePath, 'utf-8')
    const m = new Module()
    m._compile(bundle, 'server-entry.js')
    serverBundle = m.exports.default
    // console.log(serverBundle);
})



/**二、
 * 1.调用getTemplate获取模版
 * 2.将获取到的js模块转化成string字符串
 * 3.将内容替换到到模版上
 * 
 * @param {*} app 
 */
module.exports = function (app) {
    app.use('/public', proxy({
        target:'http://localhost:8888'
    }))

    app.get('*', function (req, res) {
        getTemplate().then(template => {
            const content = ReactDomServer.renderToString(serverBundle) 
            res.send(template.replace('<!-- app -->', content))
        })
    })
}