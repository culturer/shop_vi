// pages/details/details.js

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
    productId:0,
    infoUrl:""
 
  },


  addToCart:function(e){
    console.log(e.detail );
    app.globalData.tmpProduct=e.detail.data[0]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
   
    wx.getStorage({
      key: 'param',
      success: function(res) {
      
        that.setData({ infoUrl:'https://localhost/static/product_info.html'+res.data})
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
  wx.hideLoading()
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
  //获取商品详情
  getProduct: function (id) {
    var that = this
   
    wx.request({
      //获取openid接口  
      url: app.globalData.hostUrl + 'get',
      data: {
      
        options: 3,
        productId: id,
       
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
          var _data =res.data.product
          var pictures=_data.Pictures
          for(var i=0;i<pictures.length;i++){
            pictures[i].Url = app.globalData.hostUrl + pictures[i].Url
          }
         _data.Product.Msg = decodeURIComponent(_data.Product.Msg)
         _data.Product.Desc = decodeURIComponent(_data.Product.Desc)
         _data.Product.Name = decodeURIComponent(_data.Product.Name)
         console.log(JSON.stringify( _data))
          that.setData({
            product: _data,
            //pictures: pictures
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
