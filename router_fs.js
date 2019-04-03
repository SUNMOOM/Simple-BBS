//在路由文件中加载 express 必要模块
var express = require('express')
var fs = require('fs')
var router = express.Router()//使用 express 的路由机制API



//请求渲染首页
router.get('/',function(req,res){
    res.render('index.html')
})

//请求渲染注册页面
router.get('/register',function(req,res){
    res.render('register.html')
})

//处理注册请求
router.post('/register',function(req,res){
    fs.readFile('./db_test.json',function(err,data){
        if (err){
            res.render('404.html')
        }
        var temp = JSON.parse(data).user
        temp.push(req.body)
        var fileData = {
            user:temp
        }
        fs.writeFile('./db_test.json',JSON.stringify(fileData),function(err){
            if (err){
                res.render('404.html')
            }
            console.log('注册成功！')
        })
    })
})

//渲染登录页面
router.get('/login',function(req,res){
    res.render('login.html')
})


//处理登录请求
router.post('/login',function(req,res){
    fs.readFile('./db_test.json',function(err,data){
        if (err) {
            res.render('404.html')
        }
        var users = JSON.parse(data).user
        for(var i = 0;i< users.length;i++){
            if (users[i].email === req.body.email && users[i].password === req.body.password) {
                return console.log('第' + parseInt(i+1) + '找到了')
            }
        }
        console.log('抱歉未找到')
    })
})

//请求退出
router.get('/logout',function(req,res){
    res.send('请求退出')
})



module.exports = router