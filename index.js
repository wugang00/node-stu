const express = require('express')

const bodyParser = require('body-parser')
const router = require('./router/router')
const path = require('path')

const app = express();
let port = 3100

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(router)

app.use(express.static(path.join(__dirname, 'data')))

// 设置静态资源目录 /serimg代指向data/images   例  http://127.0.0.1:3100/serimg/homg/7.png
app.use("/serimg", express.static(path.join(__dirname, 'data/images')))

app.use("/images", express.static(path.join(__dirname, 'public/img')))
app.use("/icon", express.static(path.join(__dirname, 'public/icon')))
// http://127.0.0.1:3100/serimg/homg/7.png
// http://127.0.0.1:3100/images/7.png


// 登录
// router.post("/login",(req,res)=> {
//   let account = req.body.account;
//   let password = req.body.password;
//   console.log("====>", process.cwd());
//   getData(process.cwd() +  "./public/data/user.json").then((data) => {
//     data = JOSN.parse(data);
//     let user = {};
//     data.users.forEach((e) => {
//       if (e.account == account && e.password == password) {
//         user = e;
//       }
//     });
//     res.json(user)
//   })
// })

app.listen(port, () => {
  console.log(`http://127.0.0.1:3100`);
})



