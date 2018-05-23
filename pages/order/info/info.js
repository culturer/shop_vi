// pages/order/detail/detail.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    confirmOrder: null,
    payTypes: [{
      name: '微信支付',
      value: 'wxPay',
      disabled: true,
      checked: false,
    }, {
      name: '货到付款',
      value: 'cashPay',
      disabled: false,
      checked: true,
    }],
    payType: 'cashPay'
  },
  watchPayType: function (e) {
    //console.log(e)
    this.setData({ payType: e.detail.value })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.setNavigationBarTitle({
      title: '订单详情'
    })
    wx.getStorage({
      key: 'orderId',
      success: function (res) {
        that.getOrder(res.data)
       
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
  getOrder: function (id) {
    var that = this

    wx.showLoading({
      title: '订单提交中',
    })
    wx.request({
      //获取openid接口  
      url: app.globalData.hostUrl + 'order',
      data: {
        act: 'getOrderPageByUser',
        where:'and id='+id,
       index:1,
        size:1

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
          for (var key in res.data.dataList[0].OrderInfo){
            res.data.dataList[0].OrderInfo[key] = decodeURIComponent(res.data.dataList[0].OrderInfo[key])
          }
          res.data.dataList[0].OrderInfo["TranslateStatus"] = res.data.dataList[0].OrderInfo["TranslateStatus"].replace(/<br\/>/g,"")
          
          for (var i = 0; i < res.data.dataList[0].OrderItems.length;i++){
            for (var key in res.data.dataList[0].OrderItems[i]) {
              res.data.dataList[0].OrderItems[i][key] = decodeURIComponent(res.data.dataList[0].OrderItems[i][key])
            }
          }
          that.setData({
            confirmOrder: res.data.dataList[0],
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