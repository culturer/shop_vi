// pages/order/detail/detail.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    confirmOrder: null,
    payTypes:[{
      name:'微信支付',
      value:'wxPay',
      disabled:true,
      checked: false,
    },{
        name: '货到付款',
        value: 'cashPay',
        disabled: false,
        checked: true,
    }],
    payType: 'cashPay'
  },
  watchPayType:function(e){
    //console.log(e)
    this.setData({ payType: e.detail.value })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    wx.setNavigationBarTitle({
      title: '订单详情'
    })   
    wx.getStorage({
      key: 'confirmOrder',
      success: function(res) {
        for (var i=0;i< res.data.ModProducts.length;i++){
          res.data.ModProducts[i].Name = decodeURIComponent(res.data.ModProducts[i].Name)
        }
        res.data.TmpOrder.Address = decodeURIComponent(res.data.TmpOrder.Address)
        res.data.TmpOrder.Remark = decodeURIComponent(res.data.TmpOrder.Remark)
        that.setData({
          confirmOrder: res.data,
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
  
  },
  //获取商品
  confirmOrder: function () {
    var that = this
  
    wx.showLoading({
      title: '订单提交中',
    })
    wx.request({
      //获取openid接口  
      url: app.globalData.hostUrl + 'order',
      data: {
        act: 'createOrder',
        PayType:that.data.payType

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
          wx.setStorage({
            key: 'confirmOrder',
            data: null,
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
          wx.setStorage({
            key: 'confirmOrder',
            data: null,
          })
          wx.switchTab({
            url: '../list/list',
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