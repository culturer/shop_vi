var app = getApp()
Page({
  data: {
    vId: "",
    name:"",
    tel:"",
    pwd:""
  },
  onReady: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.initUserInfo()
    
  },
  initUserInfo:function(){
    var that=this
    //获取用户vId
    wx.getStorage({
      key: 'vId',
      success: function(res) {
         that.setData({vId:res.data})
         console.log(that.data.vId)
      },
    })
    
    //设置用户nicName
    that.setData({
      name: app.globalData.userInfo.nickName
    })

  },
  registerUser:function(e){
    var that=this
   // that.setData()
    wx.request({
      //获取openid接口  
      url: app.globalData.hostUrl +'register',
      data: {
        vId: that.data.vId,
        name: encodeURIComponent(that.data.name)  ,
        tel: that.data.tel,
        pwd: that.data.pwd,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        console.log(res.data)
        if(res.data.status=="200"){
          // wx.navigateTo({
          //   url: '../index/index',
          // })
          that.loginUser()
        } else if (res.data.status == "400"){
           wx.showToast({
             title:res.data.msg,
             icon:'none'
           })
        }

      }
    })
  },
  watchName:function(e){
   var that=this
   that.setData({ name: e.detail.value})
  },
  watchTel: function (e) {
    var that = this
    that.setData({ tel: e.detail.value })
  },
  watchPwd: function (e) {
    var that = this
    that.setData({ pwd: e.detail.value })
  },
  watchName: function (e) {
    var that = this
    that.setData({ name: e.detail.value })
  },
  //登陆
  loginUser: function () {
    var that = this
    wx.request({
      //获取openid接口  
      url: app.globalData.hostUrl + 'login',
      data: {
        options: 0,
        tel: that.data.tel,
        pwd: that.data.pwd

      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {

        if (res.data.status == "400") {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        } else if (res.data.status == "200") {
         
          //保存用户信息         
          app.globalData.uId = res.data.userId
          app.globalData.uIdSession = res.header["set-cookie"].split(';')[0]
          app.globalData.loginTime = res.data.time
          //跳转到home页面
          wx.showToast({
            title: '注册成功，正在为你跳转到首页',
            icon:"none"
          })
          setTimeout(function(){
            wx.switchTab({
              url: '../index/index',
              fail: function (res) {
                console.log(res)
              }
            })
          },2000)
        
        }

      },
      fail: function (res) {
        console.log(res)
        // wx.navigateTo({
        //   url: '../register/register',
        // })
      }
    })
  },

})