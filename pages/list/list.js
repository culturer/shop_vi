// pages/list/list.js
var goods = require('data.js')
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type_list:[],
    listData: [],//商品列表数据
    activeProductType: 0,//商品类别
    where:"",//搜索条件
    pageIndex:1,//页码
    cartList: [],//购物车
    sumMonney: 0,//总金额
    // scrollTop: 100,
    screenWidth: 667,
    showModalStatus: false,
    // currentType: 0,
    // currentIndex: 0,
    // sizeIndex: 0,
    // sugarIndex: 0,
    // temIndex: 0,
    // sugar: ['现宰', '冰鲜', '生活'],
    // tem: ['常规冰', '多冰', '少冰', '去冰', '温', '热'],
    // size: ['泰国', '越南', '菲律宾'],
   
    cupNumber:0,
    showCart: false,
    loading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var sysinfo = wx.getSystemInfoSync().windowHeight;
    console.log(sysinfo)
    wx.showLoading({
      title: '努力加载中',
    })
    //将本来的后台换成了easy-mock 的接口，所有数据一次请求完 略大。。
    // that.setData({
    //   listData: goods.goods,
    //   loading: true
    // })
    this.getTypeList()
    this.getProductList(1,10,0,"")
    wx.hideLoading();
    // wx.request({
    //   url: 'https://easy-mock.com/mock/59abab95e0dc66334199cc5f/coco/aa',
    //   method: 'GET',
    //   data: {},
    //   header: {
    //     'Accept': 'application/json'
    //   },
    //   success: function (res) {
    //      wx.hideLoading();
    //     // console.log(res)
    //     // that.setData({
    //     //   listData: res.data,
    //     //   loading: true
    //     // })
    //    that.setData({
    //       listData: goods.goods,
    //       loading: true
    //     })
    //   }
    // })
  },
  selectMenu: function (e) {
    var productTypeId = e.currentTarget.dataset.index
    console.log(productTypeId)
    this.setData({
      activeProductType: productTypeId,
      pageIndex: 1,
      // scrollTop: 1186
    })
    this.getProductList(1, 10, productTypeId,this.data.where)
  },
  scrollToLower: function (e) {
    console.log(e)
    var index= ++this.data.pageIndex
    this.getProductList(index, 10, this.data.activeProductType, this.data.where,true)
   // var dis = e.detail.scrollTop
 
    // if (dis > 4986) {
    //   this.setData({
    //     activeProductType: 8,
    //   })
    // }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  selectInfo: function (e) {
    var type = e.currentTarget.dataset.type;
    var index = e.currentTarget.dataset.index;
    this.setData({
      showModalStatus: !this.data.showModalStatus,
      currentType: type,
      currentIndex: index,
      sizeIndex: 0,
      sugarIndex: 0,
      temIndex: 0
    });
  },

  chooseSE: function (e) {
    var index = e.currentTarget.dataset.index;
    var type = e.currentTarget.dataset.type;
    if (type == 0) {
      this.setData({
        sizeIndex: index
      });
    }
    if (type == 1) {
      this.setData({
        sugarIndex: index
      });
    }
    if (type == 2) {
      this.setData({
        temIndex: index
      });
    }
  },

  addToCart: function (e) {
    var product
    var sumMonney
    if (app.globalData.tmpProduct!=null){
      product = app.globalData.tmpProduct
      sumMonney = this.data.sumMonney + parseFloat(product.Price)
      product.SumPrice = product.Price
      //清除临时商品
      app.globalData.tmpProduct=null
    }else{
       product = e.currentTarget.dataset.item
       sumMonney = this.data.sumMonney + parseFloat(product.Price)
    }
    
    var cartList = this.data.cartList
    product.BuyNum=1
    cartList.push(product);
    
    this.setData({
      cartList: cartList,
      showModalStatus: false,
      sumMonney: sumMonney,
      cupNumber: this.data.cupNumber + 1
    });
    console.log(this.data.cartList)
  },
  showCartList: function () {
    console.log(this.data.showCart)
    if (this.data.cartList.length != 0) {
      this.setData({
        showCart: !this.data.showCart,
      });
    }

  },
  clearCartList: function () {
    this.setData({
      cartList: [],
      showCart: false,
      sumMonney: 0
    });
  },
  addNumber: function (e) {
    var index = e.currentTarget.dataset.index;
    console.log(index)
    var cartList = this.data.cartList;
    cartList[index].BuyNum++;
    var sum = parseFloat(this.data.sumMonney) + parseFloat(cartList[index].Price);
    cartList[index].SumPrice += cartList[index].Price;

    this.setData({
      cartList: cartList,
      sumMonney: sum,
      cupNumber: this.data.cupNumber+1
    });
  },
  decNumber: function (e) {
    var index = e.currentTarget.dataset.index;
    console.log(index)
    var cartList = this.data.cartList;

    var sumMonney = this.data.sumMonney - cartList[index].Price;
    cartList[index].SumPrice -= cartList[index].Price;
    cartList[index].BuyNum == 1 ? cartList.splice(index, 1) : cartList[index].BuyNum--;
    this.setData({
      cartList: cartList,
      sumMonney: sumMonney,
      showCart: cartList.length == 0 ? false : true,
      cupNumber: this.data.cupNumber-1
    });
  },
  goBalance: function () {
    if (this.data.sumMonney != 0) {
      wx.setStorageSync('cartList', this.data.cartList);
      wx.setStorageSync('sumMonney', this.data.sumMonney);
      wx.setStorageSync('cupNumber', this.data.cupNumber);
      wx.navigateTo({
        url: '../order/balance/balance'
      })
    }
  },

  goDetails: function (e) {
    wx.setStorage({
      key: 'param',
      data: '?productId=' + e.currentTarget.dataset.id + '&Cookie=' + app.globalData.uIdSession ,
    });
   
    wx.navigateTo({
      url: '../details/details'
    })
  },

  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      this.addToCart()
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
  //获取商品分类
  getTypeList:function(){
    var that=this
    wx.request({
      //获取openid接口  
      url: app.globalData.hostUrl + 'products',
      data: {
        types: 0,
        options: 0,
        // productTypeId: 1,
        //getType: 0,
        pageNo: 1,
        pageSize: 0

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
        } else if (res.data.status == "302"){
          wx.switchTab({
            url: '../mine/mine',
          })
        }
         else if (res.data.status == "200") {
          var _list =new Array();
          var list = res.data.productTypes
          _list.push({ Id: 0, TypeName: "热销推选" })
          for (var i = 0; i < list.length; i++) {
            list[i].TypeName = decodeURIComponent(list[i].TypeName)
            _list.push(list[i])
          }
          
         that.setData({
           type_list:_list
         })     
         

        }

      },
      fail: function (res) {
        console.log(res)
       
      }
    })
  },
 //获取商品
  getProductList: function (index, size, productTypeId,where,isAppend) {
    var that = this
    //构造where
    if(where!=""){
      where=encodeURIComponent(where)
      where =' and name like \'%'+ where+'%\' '
    }
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
        where:where

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
            fail:function(e){
              console.log(e)
            }
          })
        }
        else if (res.data.status == "200") {
          if (isAppend){
            var _list = that.data.listData;
          }else{
            var _list = new Array();
          }
         
          var list = res.data.products
         // _list.push({ Id: 0, Name: "热销推选" })
          for (var i = 0; i < list.length; i++) {
            list[i].Name = decodeURIComponent(list[i].Name)
            list[i].CoverUrl = app.globalData.hostUrl + list[i].CoverUrl
            list[i].SumPrice = list[i].Price
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
      complete:function(){
        wx.hideLoading()
      }
    })
  },
  //监控搜索输入
  watchWhere:function(e){
    this.setData({ where: e.detail.value})
  },
  //搜索商品
  searchProduct:function(){
    this.getProductList(1, 10, 0,this.data.where)
  }
})