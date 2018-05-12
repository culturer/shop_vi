//index.js
//获取应用实例
var app = getApp()
const APP_ID = 'wx7db7b53153ae27dd';//输入小程序appid  
const APP_SECRET = '22cacdf349b14646350ecf6026d79129';//输入小程序app_secret  
var OPEN_ID = ''//储存获取到openid  
var SESSION_KEY = ''//储存获取到session_key  
Page({
  data: {
    //轮播图
    listData:[],
    typeList:[],
    // imgUrls: [
    //   '../../images/seafood_1.jpg',
    //   '../../images/seafood_2.jpg',
    //   '../../images/seafood_3.jpg',
    //   '../../images/seafood_4.jpg',
    //   '../../images/seafood_5.jpg'
    // ],
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 500,
    circular:true,
    
  },
  onLoad: function () {
    this.getOpenId(this.loginUser)
    this.getProductList(1,5,0)
    this.getProductTypeList()
  },
  golist: function () {
    wx.navigateTo({
      url: '../list/list'
    })
  },
  //获取openId
  getOpenId: function (loginUser) {
    var that = this;
    wx.login({
      success: function (res) {
        wx.request({
          //获取openid接口  
          url: 'https://api.weixin.qq.com/sns/jscode2session',
          data: {
            appid: APP_ID,
            secret: APP_SECRET,
            js_code: res.code,
            grant_type: 'authorization_code'
          },
          method: 'GET',
          success: function (res) {
            console.log(res.data)
            OPEN_ID = res.data.openid;//获取到的openid 
            that.setData({ OPEN_ID: OPEN_ID})
            wx.setStorage({
              key: 'vId',
              data: OPEN_ID,
            }) 
            SESSION_KEY = res.data.session_key;//获取到session_key  
            // wx.showToast({
            //   title: OPEN_ID,
            // })
            loginUser(OPEN_ID)

          }
        })
      }
    })
  },
  //登录用户
  loginUser: function (OPEN_ID) {
    wx.request({
      //获取openid接口  
      url: app.globalData.hostUrl+'login',
      data: {
        options: 2,
        vId: OPEN_ID,
       
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
      
        console.log(res)
        //var date = JSON.parse(res.data)
        if (res.data.status=="400"){
          wx.navigateTo({
            url: '../register/register',
          })
        } else if (res.data.status == "200"){
          wx.showToast({
            title: "欢迎选购",
          })
          //保存用户信息
         
          app.globalData.uIdSession = res.header["set-cookie"].split(';')[0]
          app.globalData.loginTime = res.data.time
          app.globalData.uId = res.data.userId
        }

      },
      fail:function(res){
        console.log(res)
        // wx.navigateTo({
        //   url: '../register/register',
        // })
      }
    })
  },
  tapLogin:function(){
    this.loginUser(OPEN_ID)
  },
  //获取轮播商品
  getProductList: function (index, size, productTypeId,  isAppend) {
    var that = this
    //构造where
    var where=" and is_carousel=1 "
    wx.showLoading({
      title: '努力加载中',
    })
    wx.request({
      //获取openid接口  
      url: app.globalData.hostUrl + 'products',
      data: {
        types: 1,
        options: 0,
        productTypeId: productTypeId,
        getType: 0,
        pageNo: index,
        pageSize: size,
        where: where

      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        Cookie: app.globalData.uIdSession
      },
      method: 'POST',
      success: function (res) {

        if (res.data.status == "400") {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        } else if (res.data.status == "302") {
          wx.switchTab({
            url: '../mine/mine',
            fail: function (e) {
              console.log(e)
            }
          })
        }
        else if (res.data.status == "200") {
          if (isAppend) {
            var _list = that.data.listData;
          } else {
            var _list = new Array();
          }

          var list = res.data.products
          // _list.push({ Id: 0, Name: "热销推选" })
          for (var i = 0; i < list.length; i++) {
            list[i].Name = decodeURIComponent(list[i].Name)
            list[i].CoverUrl = app.globalData.hostUrl + list[i].CoverUrl
            list[i].Msg = decodeURIComponent(list[i].Msg)
           // list[i].SumPrice = list[i].Price
            _list.push(list[i])
          }

          that.setData({
            listData: _list
          })


        }

      },
      fail: function (res) {
        console.log(res)

      },
      complete: function () {
        wx.hideLoading()
      }
    })
  },
  //获取商品类别
  getProductTypeList: function () {
    var that = this
    //构造where
   
    wx.showLoading({
      title: '努力加载中',
    })
    wx.request({
      //获取openid接口  
      url: app.globalData.hostUrl + 'products',
      data: {
        types: 0,
        options: 0,        
        pageNo: 1,
        pageSize: 0,
       

      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        Cookie: app.globalData.uIdSession
      },
      method: 'POST',
      success: function (res) {

        if (res.data.status == "400") {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        } else if (res.data.status == "302") {
          wx.switchTab({
            url: '../mine/mine',
            fail: function (e) {
              console.log(e)
            }
          })
        }
        else if (res.data.status == "200") {
        
            var _list = new Array();
          

          var list = res.data.productTypes
          // _list.push({ Id: 0, Name: "热销推选" })
          for (var i = 0; i < list.length; i++) {
            list[i].TypeName = decodeURIComponent(list[i].TypeName)
          
            // list[i].SumPrice = list[i].Price
            _list.push(list[i])
          }

          that.setData({
            typeList: _list
          })


        }

      },
      fail: function (res) {
        console.log(res)

      },
      complete: function () {
        wx.hideLoading()
      }
    })
  },
})
