# 简单论坛项目

## 1. 项目结构设计
```
./
|—— app.js			项目启动入口文件
|—— controllers
|—— models 			存放mongoose设计的各类模型 Schema 文件，如：users、comments...
|—— node_models     第三方包
|—— package.json    包描述文件
|—— package-lock.json   第三方包锁定文件
|—— public      公共静态文件
|—— README.md   项目说明文件
|—— routers 	路由文件夹，当业务比较多，代码量大的时候，将路由按照业务的分类存储到 routers 目录中
|—— router.js	路由主文件
|—— views       存储视图目录
```

## 2. 业务设计

- 用户注册
- 用户登录
- 用户退出
- 用户信息修改

## 2. 静态页设计

使用 art-template 模板引擎设计静态页面

- include
- block
- extend

## 3. 数据库设计

用户信息模型设计

| 属性 |    id    |  昵称  |     性别     | email  |  密码  | 创建时间 | 最后修改时间 | 生日 |    权限     |
| :--: | :------: | :----: | :----------: | :----: | :----: | :------: | :----------: | :--: | :---------: |
| 类型 |  string  | string |    number    | string | string |   date   |     date     | date |   number    |
| 约束 | 默认生成 |  必填  |     必填     |  必填  |  必填  | 默认生成 |   默认生成   | 默认 |  默认生成   |
| 范围 |          |        | enum[-1,0,1] |        |        | date.now |   date.now   | 空值 | enum[0,1,2] |

## 4. 详细代码实现

### 4.1 业务处理

- 客户端
  - 先处理好客户端页面的内容（表单控件中的 name、id、value等属性）
  - 收集表单数据，Ajax 发起提交请求
- 服务器端
  - 获取客户端表单请求数据
  - 根据业务，操作数据库
  - 根据不同业务返回操作结果，或相应的响应数据

### 2. 路由设计

session路由设计：

| 请求路径  | 请求方法 | get参数 | post参数 | 是否需要权限 | 备注     |
| --------- | -------- | ------- | -------- | ------------ | -------- |
| /         | get      |         |          |              | 渲染首页  |
| /register | get      |         |          |              | 渲染注册页面 |
| /register | post |         | nickname、email、password |              | 处理注册请求 |
| /login | get |  |          |              | 渲染登录页面 |
| /login | post |         | email、password |              | 处理登录请求 |
| /logout | get |         |  | | 退出请求 |

### 4. 设计业务状态码

设计一个业务状态码，用于在客户端 Ajax 异步接收各种类型错误，例如：

- err_code:
  - 成功：0
  - 邮箱或者昵称存在：1
  - 服务端错误：500
  - 等等

### 5.MD5加密隐私信息

github doc：https://github.com/blueimp/JavaScript-MD5

注意：对于相同密码加密一次后的加密码是一样的。所以需要制定规则进行对此复合加密处理

例如：

```
123
```

一次加密后。始终为如下数据：

```
202cb962ac59075b964b07152d234b70
```

对第一次加密后的数据，进行第二次加密：

```
d9b1d7db4cd6e70935368a1efb10e377
```

###  6. Ajax异步提交表单

在表单中，具有默认的提交行为，默认提交方式是同步的，但同步方式表单提交，浏览器会锁死（即一直转圈儿）等待服务端的响应结果。

在表单的同步提交之后，无论服务端响应的是什么，都会直接把响应的结果覆盖渲染掉当前页面。

所以在html中采用 Ajax 异步方式提交表单

**优点：**可以是表单提交后不会跳转或覆盖当前页面，即将响应信息在当前页面接收到并响应

```html
<script>
    $('#register_form').on('submit', function (e) {
      e.preventDefault()
      var formData = $(this).serialize()
      $.ajax({
        url: '/register',
        type: 'post',
        data: formData,
        dataType: 'json',
        success: function (data) {
          var err_code = data.err_code
          if (err_code === 0) {
            // window.alert('注册成功！')
            // 服务端重定向针对异步请求无效
            window.location.href = '/'
          } else if (err_code === 1) {
            window.alert('邮箱已存在！')
          } else if (err_code === 2) {
            window.alert('昵称已存在！')
          } else if (err_code === 500) {
            window.alert('服务器忙，请稍后重试！')
          }
        }
      })
    })
  </script>
```

**注意：**在异步方式请求的时候，服务端重定向无效（可以发出请求，但是不能覆盖当前页面，即无效），只有在同步请求时才有效！

所以为了解决这个问题，只能在异步请求成功后，**在客户端重定向**，如：

```js
window.location.href = '/'
```

### 7. Cookie 和Session

- cookie 保存于客户端，其可以记录不敏感的数据，但不能保存用户的登录状态

  cookie一般记录：用户名、购物车等等不敏感信息

- Session保存于服务端，通常将敏感信息及相应的状态数据保存于服务端，并且会返回给客户端唯一凭证

  此凭证是唯一的，且不可重复，一旦丢失，则不可找回保存于服务器中的状态

  - **注意：**session是存储于服务器中的内存当中，当服务器服务重启或退出后会丢失 session 信息！！

## 

