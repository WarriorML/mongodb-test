// 引入express模块
const exp = require('express')
// 引入body-parser用于解析请求体
const bodyParser = require('body-parser')
// 引入art-template模型引擎，用于服务端渲染
const template = require('art-template')
// 引入mongoose用于数据库操作
const mongoose = require('mongoose')
// 实例化express
const app = exp()

// 设置静态目录
app.use(exp.static('public'))
// 使用bodyParser的url编解码，对对象进行解析
app.use(bodyParser.urlencoded({ extended: true }))

// 设置template为express的模型引擎，并渲染views文件夹下的html文件
app.engine('html', template.__express)
app.set('view engine', 'html')

// 连接数据库地址 mongodb://类似于http://  数据库协议
mongoose.connect('mongodb://localhost:27017/data/db')
// 发起数据库连接
var db = mongoose.connection

// 连接有两种状态
// 第一种失败
db.on('error', function () {
    console.log('数据库连接失败')
})
// 第二种成功打开
db.once('open', function () {
    console.log('数据库连接成功')
})

// 获取数据库的文件模型
var Schema = mongoose.Schema
// 新建一个文件模型，第一个参数是表的内容类型，第二个参数collection(集合) 名称
var userSchema = new Schema({ name: String, age: Number }, { collection: 'Users' })
// 根据文件模型创建一个对应的模型，返回构造函数
var User = mongoose.model('User', userSchema)

app.listen(3000, function (req, res) {
    console.log('服务器运行在3000端口......')
})

// 获取所有数据
app.get('/', function (req, res) {
    // 查询所有的用户
    User.find(function (error, data) {
        if (error) {
            res.send('获取数据失败')
        } else {
            res.render('index', {
                list: data.map(function (item) {
                    item = item.toObject()
                    // _id是自带属性，自动生成
                    item.id = item._id.toString()
                    delete item._id
                    return item
                })
            })
        }
    })
})
// 增加一个用户
app.post('/api/v1/add', function (req, res) {
    var user = User(req.body)
    // 保存
    user.save(function (err) {
        if (err) {
            res.json({
                code: 'error',
                message: '添加失败'
            })
        } else {
            res.json({
                code: 'success',
                message: '添加成功'
            })
        }
    })
})

// 跳转到编辑页面时
app.get('/edit/:id', function (req, res) {
    console.log(req.params)
    // 查找id得到一个数据(用户)
    User.findById(req.params.id, function (err, data) {
        if (err) {

        } else {
            var user = data.toObject()
            user.id = user._id.toString()
            delete user._id
            res.render('edit', {
                user: user
            })
        }
    })
})
// 编辑一个用户(改)
app.post('/api/v1/edit/:id', function (req, res) {
    User.findByIdAndUpdate(req.params.id, req.body, function (err) {
        if (err) {
            res.json({
                code: 'error',
                message: '修改失败'
            })
        } else {
            res.json({
                code: 'success',
                message: '修改成功'
            })
        }
    })
})

// 删除一个用户
app.post('/api/v1/remove/:id', function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.json({ code: 'error', message: '系统错误' })
        } else {
            res.json({ code: 'success', message: '删除成功' })
        }
    })
})




