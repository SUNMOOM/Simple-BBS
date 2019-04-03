//加载 fs 文件模块
var fs = require('fs')
//加载 express 框架
var express = require('express')
//加载路由文件
var router = require('./router_mongo')
//加载 path 模块
var path = require('path')

//express 中间件模块：
//1. 加载 bodyParser 模块
var bodyParser = require('body-parser')
//2. 加载 expres-session
var session = require('express-session')

//启用 express 框架对象
var app = express()


//调用各类中间件:

//使用body-parser中间件
app.use(bodyParser.urlencoded({ extended: false }))
// 解析 application/json 
app.use(bodyParser.json())
//使用expre-session中间件
app.use(session({
    secret: 'keyboard m',//配置加密字符串，在原有加密的基础上加上这个加密字符串拼起来再加密
    resave: false,
    saveUninitialized: true//无论是否使用session，都会默认配置一个凭证（钥匙）
}))

//开放静态资源
app.use('/public',express.static('./public'))
app.use('/node_modules',express.static('./node_modules'))


//使用模板引擎中间件：express-art-template 较为特殊
app.engine('html',require('express-art-template'))

//使用路由中间件：最后使用全局应用级中间件挂载路由文件
app.use(router)

//错误处理中间件：防止非法访问
// app.use(function(req,res){
//     res.render('404.html')
// })

//开启端口，启动服务器
app.listen(3000,function(){
    console.log('server is running ....')
})