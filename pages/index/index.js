const productUtil = require('../../utils/product.js')
var app = getApp()

Page({
  data: {
    items: [],
    slides: [{img:"../../images/asset_100100300100.jpg"}],
    navs: [{icon: "../../images/icon-new-list1.png", name: "资产", typeId: 0},
           {icon: "../../images/icon-new-list2.png", name: "直销", typeId: 1},
           {icon: "../../images/icon-new-list3.png", name: "甄选", typeId: 2},
           {icon: "../../images/icon-new-list4.png", name: "管到", typeId: 3}],

    popularity_products: [                 
                  ],
    new_products: [],
    hot_products: [],
    promotions: []
  },

  onShareAppMessage: function () {
    return {
      title: "巴爷供销社",
      desc: "商城首页",
      path: `pages/index/index`
    }
  },

  bindShowProduct: function (e) {
    console.log(e.currentTarget.dataset.id)
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: `../show_product/show_product?id=${e.currentTarget.dataset.id}`
    })
  },

  catchTapCategory: function (e) {
    wx.navigateTo({
      url: `../category/category?type=${e.currentTarget.dataset.type}&typeId=${e.currentTarget.dataset.typeid}`
    })
  },

  onPullDownRefresh: function() {
    this.getSlidesFromServer()
    this.getProductsFromServer()
    wx.stopPullDownRefresh()
  },

  onLoad: function() {
    var that = this
    wx.getStorage({
      key: 'products',
      success: function(res){
        var data = res.data
        that.setData({
          items: data,
          popularity_products: data.filter(product => (product.flag === '最热' && product['promotion-url'])),
          new_products:        data.filter(product => (product.flag === '新品' && product['promotion-url'])),
          hot_products:        data.filter(product => (product.flag === '火爆' && product['promotion-url'])),
        })
      },
      fail: function() {},
      complete: function() {}
    })

    wx.getStorage({
      key: 'missiontype',
      success: function(res){
        var type = 0
        var data = res.data
        if(data == "会见会谈")
          type = 0
        else if(data == "出访")
          type = 1

        that.getProductsFromServer(type)
      
      },
      fail: function() {
        wx.showModal({
          title: '提示',
          content: '必须先填写受礼信息',
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              // wx.redirectTo({
              //   url: 'pages/address/address'
              // })
              wx.navigateTo({
                url: '../address/address' // 跳转到目标页面
              })             
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        
      },

    })

    wx.getStorage({
      key: 'indexSlides',
      success: function(res){
        that.setData({'slides': res.data})
      },
      fail: function() {},
      complete: function() {
        that.getSlidesFromServer()
      }
    })
  },

  getSlidesFromServer: function() {
    var that = this
    productUtil.getSlides(function(result) {
      var data = app.store.sync(result.data)
      that.setData({'slides': data})
      wx.setStorage({
        key:'indexSlides',
        data:data
      })
    })
  },

  getProductsFromServer: function(type) {
    var that = this
    console.log(type)
    productUtil.getProducts(type,function(result) {
      console.log(result)
      var data = result.data
      that.setData({
        items: data,
        popularity_products: data.data.goods
      })
      wx.setStorage({
        key:'products',
        data:data
      })
    })
  }
})
