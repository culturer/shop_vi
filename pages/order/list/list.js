// pages/order/list/list.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusType: ["待付款", "待发货", "待收货", "待评价", "已完成"],
    currentType: 0,
    tabClass: ["", "", "", "", ""],
    countList:0,
    orderList:null,
    tabIndex:0,//即时/列表
    showModalStatus:false,
    operate:'',//操作
    id:null,
    comments:"",
    confirmOrder:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  onShow:function(){
    var that = this
    that.getOrderList()
    wx.getStorage({
      key: 'confirmOrder',
      success: function(res) {
        that.setData({
          confirmOrder:res.data
        })
      },
    })
  },
  changeTab:function(e){
    var index = e.currentTarget.dataset.index
    this.setData({
      tabIndex: index,
    })
  },
  statusTap: function (e) {
    var curType = e.currentTarget.dataset.index;
    this.data.currentType = curType
    this.setData({
      currentType: curType
    });
    this.onShow();
  },
  //获取订单列表
  getOrderList:function(){
    var that = this
    //构造where参数
    var where=""
    if (that.data.currentType==0){
      where = ' and is_cancel=0 and is_pay=0 and user_id=' + app.globalData.uId
      
    } else if (that.data.currentType == 1){
      where = ' and is_cancel=0  and is_dlivery=0 and user_id=' + app.globalData.uId
    }
    else if (that.data.currentType == 2) {
      where = ' and is_cancel=0  and is_sign=0 and is_dlivery=1 and user_id=' + app.globalData.uId
    }
    else if (that.data.currentType == 3) {
      where = ' and is_cancel=0 and is_comment=0 and is_sign=1 and user_id=' + app.globalData.uId
    }
    else if (that.data.currentType == 4) {
      where = ' and is_cancel=0 and is_sign=1 and user_id=' + app.globalData.uId
    }
    wx.showLoading({
      title: '正在获取订单'
    })
    wx.request({
      //获取openid接口  
      url: app.globalData.hostUrl + 'order',
      data: {
        act: 'getOrderPage',
        where: where,
        size:8,
        index:1
        
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
        
          if (res.data.count==0){
            that.setData({
              countList: res.data.count,
              orderList: null
            })
          }else{
            for (var i = 0; i < res.data.dataList.length;i++){
              res.data.dataList[i].OrderInfo.Remark = decodeURIComponent(res.data.dataList[i].OrderInfo.Remark)
              for(var j=0;j<res.data.dataList[i].OrderItems.length;j++){
                res.data.dataList[i].OrderItems[j].Name = decodeURIComponent(res.data.dataList[i].OrderItems[j].Name)
                       
              }

            }
            that.setData({
              countList: res.data.count,
              orderList: res.data.dataList
            })
          }
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
  golist: function () {
    wx.navigateTo({
      url: '../../list/list'
    })
  },
  //取消订单
  cancelOrderTap:function(){
    var that=this
    this.setData({
      showModalStatus: !this.data.showModalStatus  

    });
    wx.showLoading({
      title: '数据提交中'
    })
    wx.request({
   
      url: app.globalData.hostUrl + 'order',
      data: {
        act: 'cancelOrder',
        comments: encodeURIComponent(that.data.comments),        
        orderId: that.data.id
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
          wx.showToast({
            title: '提交完成',
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
  //评论
  commentOrderTap: function () {
    var that = this
    this.setData({
      showModalStatus: !this.data.showModalStatus

    });
    wx.showLoading({
      title: '数据提交中'
    })
    wx.request({

      url: app.globalData.hostUrl + 'order',
      data: {
        act: 'commentOrder',
        comments: encodeURIComponent(that.data.comments),
        orderId: that.data.id
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
          wx.showToast({
            title: '提交完成',
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
  toggleModal:function(e){
    var operate = e.currentTarget.dataset.operate;
    var id = e.currentTarget.dataset.id;
    this.setData({
      showModalStatus: !this.data.showModalStatus,
      operate: operate,
      id: id,
 
    });
  },
  watchComments: function (e) {
    this.setData({ comments: e.detail.value })
  },
  goPay:function(e){
    wx.navigateTo({
      url: '../detail/detail'
    })
  }
})