//在路由文件中加载 express 必要模块
var express = require('express')
var fs = require('fs')
var router = express.Router()//使用 express 的路由机制API
var User = require('./models/user')


//请求渲染首页
router.get('/',function(req,res){
    res.render('index.html',{
        user: req.session.user
    })
})

//请求渲染注册页面
router.get('/register',function(req,res){
    res.render('register.html')
})

//处理注册请求
router.post('/register',function(req,res){
    var body = req.body
    User.findOne({
        $or: [
            {
                email: body.email
            },{
                nickname: body.nickname
            }
        ]
    },function(err,data){
        if(err){
            return res.render('404.html')
        }
        if(data){
            return res.status(200).json({
                err_code: 1,
                message: '邮箱或者密码已存在，请重试'
            })
        }
        new User(body).save(function (err,user) {//第二个参数 user 为保存成功的数据对象
            if(err){
                res.status(500).join({
                    success: false,
                    message: '服务器错误'
                })
            }
            req.session.user = user
            res.status(200).json({
                err_code: 0,
                message: '注册成功'
            })

        })
    })
    
})

//渲染登录页面
router.get('/login',function(req,res){
    res.render('login.html')
})


//处理登录请求
router.post('/login',function(req,res){
    var body = req.body
    User.findOne({
        email:body.email,
        password:body.password
    },function(err,ret){
        if (err) {//第一个参数 err ，是针对服务端数据库错误 
            return res.status(500).json({
                err_code: 500,
                message: '数据库错误'
            })
        }
        if (!ret) {//第二个参数表示数据库无异常情况下，返回数据库中匹配条件的对象（未查找到则返回一个空对象）
            //当res.status为 500 时，客户端收到 500 响应的时候会在浏览器中的控制台报错，且不执行ajax中success成员中的函数
            //只有当res.status为 200 时，客户端接收到 200 ，才会执行ajax中success成员中的函数
            return res.status(200).json({
                err_code: 1,
                message: '邮箱或者密码错误'
            })
        }
        req.session.user = ret
        res.status(200).json({
            err_code: 0,
            message: '登录成功'
        })
        
    })
})

//请求退出
router.get('/logout',function(req,res){
    delete req.session.user
    res.redirect('/')
})



module.exports = router