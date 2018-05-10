// pages/mine/mine.js
var app = getApp()
const APP_ID = 'wx7db7b53153ae27dd';//输入小程序appid  
const APP_SECRET = '22cacdf349b14646350ecf6026d79129';//输入小程序app_secret  
var OPEN_ID = ''//储存获取到openid  
var SESSION_KEY = ''//储存获取到session_key  
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName:"",
    avatarUrl:"",
    loginTime:"请点击下面登陆按钮",
    tel:"建议手机号作为账号",
    pwd:"",
    user:""
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    var that=this;
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo
        that.setData({
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl,
        })
      }
    })
    this.getLoginUser()
  },
  bitphone:function(){
    wx.makePhoneCall({
      phoneNumber: '1340000' 
    })
  },
  //获取openId
  getOpenId: function () {
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
    
          }
        })
      }
    })
  },
  //跳转到登陆页面
  goToLoginPage:function(){
    wx.navigateTo({
      url: '../login/login',
    })

  },
  //获取用户
  getLoginUser:function(){
    var that=this
    wx.request({
      //获取openid接口  
      url: app.globalData.hostUrl+ 'user',
      data: {
        page: "login",       

      },
      header:{
        Cookie: app.globalData.uIdSession 
      },
      method: 'Get',
      success: function (res) {

        console.log(res.data)
        //var date = JSON.parse(res.data)
        if (res.data.status == "400") {
         wx.showToast({
           title: '获取用户信息失败',
           icon:'none'
         })
        } else if (res.data.status == "200") {
          
          that.setData({ tel: res.data.user.Tel, user: res.data.user,pwd:res.data.user.Password,
          loginTime:app.globalData.loginTime
          })
        }
       

      },
      fail: function (res) {
        console.log(res)       
      }
    })
  },
  //显示修改密码对话框
  showPwdDialog:function(){},
  //修改密码
   editPwd(){},
  //退出登陆
  logout(){
    var that=this
    wx.request({
      //获取openid接口  
      url: app.globalData.hostUrl +'user',
      data: {
        page: "logout",

      },
      header: {
        Cookie: app.globalData.uIdSession
      },
      method: 'Get',
      success: function (res) {

        console.log(res.data)
        //var date = JSON.parse(res.data)
        if (res.data.status == "400") {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        } else if (res.data.status == "200") {
         app.globalData.uIdSession=null
         app.globalData.uid = null
         app.globalData.loginTime = null
         that.setData({ tel: "请登陆", user: "", loginTime:"请点击下面登陆"})
         wx.navigateTo({
           url: '../login/login',
         })
        }
      

      },
      fail: function (res) {
        console.log(res)
      }
    })
  } 
 

 
})