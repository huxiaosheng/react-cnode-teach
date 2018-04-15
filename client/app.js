/**
 * Created by huyuan on 2018/4/1.
 */
import React from 'react'
import ReactDOM from 'react-dom'
// import { hot } from "react-hot-loader"
import App from './App.jsx'


const root = document.getElementById('root')
const render = (Component) => {
  const renderMethod = module.hot ? ReactDOM.render : ReactDOM.hydrate
  renderMethod(<Component />, root)
}
render(App);

//hyrate 用于混合容器
// ReactDOM.hydrate(<App />, document.getElementById('root'))


/*

if (module.hot) {
    module.hot.accept('./App.jsx', () => {
        const NextApp = require('./App.jsx')
        render(NextApp)
    })
}
 */
