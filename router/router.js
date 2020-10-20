const express = require('express')
const router = express.Router()
const fs = require("fs")

const path = require('path')
var options = { root: path.join(__dirname, '../data') }

// 首页数据
router.get('/', (req, res) => {
  res.sendFile("index.json", options)
})
router.get('/index', (req, res) => {
  res.sendFile("index.json", options)
})
// 分类
router.get('/classify', (req, res) => {
  res.sendFile("classify.json", options)
})
// 生活家
router.get('/family', (req, res) => {
  res.sendFile("family.json", options)
})
// 我的
router.get('/my', (req, res) => {
  res.sendFile("my.json", options)
})
// 购物车
router.get('/shopping', (req, res) => {
  res.sendFile("comdity.json", options)
})

// 城市列表
router.get('/city', (req, res) => {
  res.sendFile("city.json", options)
})
// 详情分类
router.get('/classdetails', (req, res) => {
  res.sendFile("classdetails.json", options)
})
// 热卖风格
router.get('/basesseller', (req, res) => {
  res.sendFile("basesseller.json", options)
})
// 本期新品
router.get('/news', (req, res) => {
  res.sendFile("news.json", options)
})
// 商品详情
router.get('/wares', (req, res) => {
  res.sendFile("wares.json", options)
})

/*
 * 获取指定文件中的数据
 * @params {string} f 文件路径
*/
function getData(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf-8", (err, data) => {
      if (err) {
        console.error(err)
        resolve("出错了！",err)
      }
      resolve(data);
    })
  })
}


// 登录
router.post("/login", (req, res) => {
  var account = req.body.account;
  var password = req.body.password;
  // console.log('00',account,req.body.account);
  getData(process.cwd() + "/data/user.json").then((data) => {
    data = JSON.parse(data);
    // console.log(data);
    let result = data.users.filter((e)=>{
      return(
        e.account == account &&
        e.password == password
      )
    })
    // console.log(result);
    if(result.length) {
      res.cookie("username",account,{ maxAge: 1000*60*10 });
      res.send('0')
    } else {
      res.send('1')
    }
  }).catch(error=>{
    console.log(error);
  })
})
// 登录 2
router.post("/logins", (req,res) => {
  var user = req.body.user;

  getData(process.cwd() + "/data/user.json").then( (d) => {
    let data = JSON.parse(d);

    var userAccount = [];
    data.users.filter((e,i)=>{
      userAccount.push(e.account)      
    })
    if(userAccount.indexOf(user.account) == -1) {
      res.send("没有此账号，去注册！")
      // 去注册
    } else {
      // 登录
    
      
      let result = data.users.filter((e)=>{
        return(
          e.account == user.account &&
          e.password == user.password &&
          e.status == 0
        )
      })
      // console.log(result);
      if(result.length) {
        // 设置cookie
        res.cookie("username",user.account,{ maxAge: 1000*60*10 });
        res.send('0')
      } else {
        res.send('1')
      }
    }
  }).catch(error=>{
    console.log(error);
  })
})
// 注册
router.post("/reister", (req,res) => {
  let user = req.body.user;
  console.log(user);
  getData(process.cwd() + "/data/user.json").then( (data) => {

    data = JSON.parse(data);
    var userAccount = [];
    data.users.filter((e,i)=>{
      userAccount.push(e.account)      
    })
    if(userAccount.indexOf(user.account) !== -1) {
      console.log("已有相同账号");
      res.send("已有相同账号，去登陆！");
    } else {   
      data.users.push(user);
      console.log(data);

      fs.writeFile("data/user.json",JSON.stringify(data), (e)=>{
        // 保存用户注册信息
        if(e) (console.log(e))
        res.send("注册成功，去登陆！");
      })
    }
  }).catch(error=>{
    console.log("请求失败",error);
  })
})
// 注销账号
router.post("/cancel", (req,res)=>{
  let user = req.body.user;
  // 1 get all user
  getData(process.cwd() +"/data/user.json").then((data)=>{
    data = JSON.parse(data);
    //2 delete user
    for(let i=0; i<data.users.length; i++) {
      if(data.users[i].account == user.account) {
        // data.users.splice(i,1);
        // 或者
        data.users[i].status = 2;
        console.log(data);
      }
    }
    // 3 save data
    console.log('cc');
    fs.writeFile("data/user.json",JSON.stringify(data), (e)=>{
      if(e) (console.log(e));
      res.send("账号注销成功！");
    })
  })
})

// 向购物车中添加商品
router.post("/addtoshopp", (req,res) => {
  var product = req.body.product;
  let userId = req.body.userId;

  getData(process.cwd() +"/data/shoppingcar.json").then((data)=>{
    data = JSON.parse(data);
    let allcar = data;
    
    // proId 新增商品的id， allId 购物车商品id的集合数组
    let proId; product.list.filter((e,i)=>{ proId = e.id });
    let allId=[];
    allcar.data.filter((e,i) => {
      e.list.filter((e,i)=>{ allId.push(e.id) });
    })
    // 如果商品id不一样 则添加商品  否则改变商品数量
    let shopIndex = allId.indexOf(proId);   //
    console.log(allId);
    if(shopIndex !== -1) {
      // list的商品索引
      let listIndex; allcar.data[shopIndex-1].list.filter((e,i)=>{ listIndex=i });

      // 问题 如何获取 当前商品 所在的 data 的索引
      // console.log("索引",listIndex,allcar.data[ ？ ].list[listIndex]);
      // listIndex,allcar.data[ ？ ].list[listIndex].count += 1;
      res.send("商品已在购物车中了！");
    } else{
      allcar.data.push(product);

      fs.writeFile("data/shoppingcar.json",JSON.stringify(allcar), (e)=>{
        // 保存用户注册信息
        if(e) (console.log(e));
        console.log('改动');
        res.send("成功添加到购物车");
      })
    }
  }).catch(error=>{
    console.log("请求失败",error);
  })
})

// 向购物车中添加商品
router.post("/adds", (req,res) => {
  var product = req.body.product;

  getData(process.cwd() +"/data/adds.json").then((data)=>{
    data = JSON.parse(data);
    let allcar = data;
    
    // proId 新增商品的id， allId 购物车商品id的集合数组
    let proId; product.shops.filter((e,i)=>{ proId = e.id });
    let allId=[];
    allcar.dity.filter((e,i) => {
      e.shops.filter((e,i)=>{ allId.push(e.id) });
    })
    // 如果商品id不一样 则添加商品  否则改变商品数量
    let shopIndex = allId.indexOf(proId);   //
    console.log(allId);
    if(shopIndex !== -1) {
      // list的商品索引
      let listIndex; allcar.dity[shopIndex-1].shops.filter((e,i)=>{ listIndex=i });

      // 问题 如何获取 当前商品 所在的 data 的索引
      // console.log("索引",listIndex,allcar.dity[ ？ ].list[listIndex]);
      // listIndex,allcar.dity[ ？ ].list[listIndex].count += 1;
      res.send("商品已在购物车中了！");
    } else{
      allcar.dity.push(product);

      fs.writeFile("data/adds.json",JSON.stringify(allcar), (e)=>{
        // 保存用户注册信息
        if(e) (console.log(e));
        console.log('改动');
        res.send("成功添加到购物车");
      })
    }
  }).catch(error=>{
    console.log("请求失败",error);
  })
})


module.exports = router