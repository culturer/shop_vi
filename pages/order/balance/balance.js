// pages/order/balance/balance.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartList: [],
    sumMonney: 0,
    cutMonney: 0,
    cupNumber:0,
    address:"",
    position:'',
    remark:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    wx.setNavigationBarTitle({
      title: '订单详情'
    })
    this.setData({
      cartList: wx.getStorageSync('cartList'),
      sumMonney: wx.getStorageSync('sumMonney'),
      // cutMonney: wx.getStorageSync('sumMonney'),
      cupNumber: wx.getStorageSync('cupNumber'),
    })
    that.chooseAddress()
 
  },
  gopay:function(){
    var that = this
    //格式化购物车数据
    var _list=new Array()
    for (var i = 0; i < that.data.cartList.length;i++){
      _list[i] = JSON.stringify(that.data.cartList[i])
    }
    
    wx.showLoading({
      title: '正在提交订单',
    })
    wx.request({
      //获取openid接口  
      url: app.globalData.hostUrl + 'order',
      data: {
        act: "confirmOrder",
        products: JSON.stringify(that.data.cartList) ,
        orderParam: JSON.stringify({
          Position:JSON.stringify(that.data.position),
          Remark: encodeURIComponent( that.data.remark),
          Address: encodeURIComponent(that.data.address),
          UserId: app.globalData.uId,
          OrderNum: "U" + app.globalData.uId+'T'+new Date().getTime()
        })

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
            url: '../../mine/mine',
            fail: function (e) {
              console.log(e)
            }
          })
        }
        else if (res.data.status == "200") {        
          console.log(res.data)
          wx.setStorage({
            key: 'confirmOrder',
            data: res.data.confirmOrder,
          })
          wx.navigateTo({
            url: '../detail/detail'
          })
        }

      },
      fail: function (res) {
        wx.showToast({
          title: res,
          icon: 'none'
        })

      },
      complete: function () {
        wx.hideLoading()
      }
    })
   
  },
  watchAddress:function(e){
    this.setData({ address: e.detail.value })
  },
  watchRemark: function (e) {
    this.setData({ remark: e.detail.value })
  },
  chooseAddress:function(){
    var that=this
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        that.setData({
          address: res.address,
          position: { latitude: res.latitude, longitude: res.longitude}
        })

      },
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})