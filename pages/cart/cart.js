const district = require('../../utils/address_data.js')
const order = require('../../utils/order.js')
const pay = require('../../utils/pay.js')
var app = getApp()

Page({
  data: {
    refreshAddress: true,
    wantToDeleteItem: '',
    address: null,
    cartItems: [],
    amount: 0,
    accountType: '',
    coupon: null,
    address: {}
  },

  onLoad: function (params) {
    this.changeCartAmount()
  },

  onShow: function (params) {
    var that = this
    // 判断要显示什么类型的价格
    if (app.globalData.currentCustomer) {
      var accountType = app.globalData.currentCustomer.account_type
      this.setData({accountType: accountType})
    }

    var cartItems = wx.getStorageSync("cartItems")
    this.setData({cartItems: cartItems || []})

    this.changeCartAmount()

    if (this.data.refreshAddress) {
      var receiverName  = wx.getStorageSync('receiverName')
      var receiverPosition   = wx.getStorageSync('receiverPosition')
      var foreignOrganization = wx.getStorageSync('foreignOrganization')
      var giftName  = wx.getStorageSync('giftName')
      var giftPosition   = wx.getStorageSync('giftPosition')
      var remark = wx.getStorageSync('remark')

      var address = {receiverName: receiverName, receiverPosition: receiverPosition, foreignOrganization: foreignOrganization, 
        giftName: giftName, giftPosition: giftPosition, remark: remark}


        that.setData({address: address})

    }
  },

  bindSelectCoupon: function() {
    var product_ids = this.data.cartItems.map(function(ele){return ele.id})
    var products_order_quantities = this.data.cartItems.map(function(ele){return ele.quantity})
    wx.navigateTo({
      url: `coupon?product_ids=${product_ids}&products_order_quantities=${products_order_quantities}`
    })
  },

  bindChangeQuantity: function (e) {
    if (e.detail.value === "") { return "" }

    var cartItems = this.data.cartItems
    var item = cartItems.filter(function(ele){
      return ele.id === e.currentTarget.dataset.id
    })[0]
    if (e.detail.value >= 1) {
      item.quantity = parseInt(e.detail.value)
    } else {
      item.quantity = 1
    }
    this.setData({ cartItems: cartItems })
    wx.setStorage({
      key: 'cartItems',
      data: cartItems
    })
    this.changeCartAmount()
    return item.quantity.toString()
  },

  // tap on item to delete cart item
  catchTapOnItem: function (e) {
    var that = this
    this.setData({
      wantToDeleteItem: e.currentTarget.dataset.id
    })

    wx.showModal({
      title: '删除商品',
      content: '是否要删除这件商品？',
      confirmText: '删除',
      cancelText: '别删',
      success: function(res) {
        if (res.confirm) {
          var cartItems = that.data.cartItems
          var index = cartItems.findIndex(function(ele){
            return ele.id === that.data.wantToDeleteItem
          })
          cartItems.splice(index, 1)
          that.setData({ cartItems: cartItems })
          wx.setStorage({
            key: 'cartItems',
            data: cartItems
          })
          that.changeCartAmount()
        }
      }
    })
  },

  bindBilling: function () {
    wx.showToast({
      title: '购买中...',
      icon: 'loading',
      duration: 5000
    })

    var that = this
    if (!this.addressValid()) {
      wx.hideToast()
      return
    }
    var cartItems = wx.getStorageSync('cartItems')
    if (!cartItems || cartItems.length === 0) {
      wx.hideToast()
      wx.showModal({
        title: '未选购礼品',
        content: '您需要将礼品加入购物车后才能下单',
        showCancel: false,
        success: function(res) {}
      })
      return
    }


    var params = JSON.parse(JSON.stringify(this.data.address))
    var item_order = {}
    item_order['info'] = params
    item_order['item'] = this.data.cartItems
    item_order['total'] = this.data.amount
    console.log(item_order)

    let missiontype = wx.getStorageSync('missiontype')
    let missionlevel = wx.getStorageSync('missionlevel')

    console.log(missiontype)
    console.log(missionlevel)
    if( missiontype == "会见会谈"){

        if(missionlevel == "部级"){

          if(this.data.amount > 400){
            wx.showModal({
              title: '提示',
              content: '会见会谈部级金额不能超过400',
              success (res) {
                if (res.confirm) {
                  return
                } else if (res.cancel) {
                  return
                }
              }
            })
            return
          }
        }else if (missionlevel == "司局级"){
          if(this.data.amount > 200){
            wx.showModal({
              title: '提示',
              content: '会见会谈司局级金额不能超过200',
              success (res) {
                if (res.confirm) {
                  return
                } else if (res.cancel) {
                  return
                }
              }
            })   
            return         
          }
        }
    }else if (missiontype == "出访"){

        if(missionlevel == "部级"){

          if(this.data.amount > 1000){
            wx.showModal({
              title: '提示',
              content: '出访部级金额不能超过1000',
              success (res) {
                if (res.confirm) {
                  return
                } else if (res.cancel) {
                  return
                }
              }
            })     
            return           
          }
        }else if (missionlevel == "司局级"){

          if(this.data.amount > 500){
            wx.showModal({
              title: '提示',
              content: '出访司局级金额不能超过500',
              success (res) {
                if (res.confirm) {
                  return
                } else if (res.cancel) {
                  return
                }
              }
            })  
            return              
          }          
        }
    }
    if(this.data.amount)
    order.postBilling(item_order, function(result){
      if (parseInt(result.statusCode) === 403) {
        wx.hideToast()
        if (parseInt(result.data.code) === 4001) {
          that.setData({coupon: ''})
        }
        wx.showModal({
          title: '出错',
          content: result.data.msg,
          showCancel: false,
          success: function(res) {}
        })
        return
      }else if(parseInt(result.statusCode) === 200){
        wx.showModal({
          title: '提示',
          content: '你已成功下单礼品',
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
              that.setData({
                cartItems: [],
                coupon: ''
              })
              wx.setStorage({
                key: 'cartItems',
                data: ''
              })
              that.changeCartAmount()
            }
          }
        })        
      }
      wx.hideToast()

      // pay.pay(result.data.hash, function(){
      //   wx.removeStorage({
      //     key: 'cartItems',
      //     success: function(res) {
      //       wx.showModal({
      //         title: '提示',
      //         content: '你已成功下单礼品',
      //         showCancel: false,
      //         success: function(res) {
      //           if (res.confirm) {
      //             that.setData({
      //               cartItems: [],
      //               coupon: ''
      //             })
      //             that.changeCartAmount()
      //           }
      //         }
      //       })
      //     }
      //   })
      // })
    })
  },

  addressValid: function() {
    var address = this.data.address
    var valid = address && address.receiverName && address.receiverPosition && address.foreignOrganization && address.giftName && address.giftPosition && address.remark
    if (!valid) {
      wx.showModal({
        title: '提示',
        content: '请填写完整受礼人信息',
        showCancel: false,
        success: function(res) {}
      })
    }
    return valid
  },

  changeCartAmount: function () {
    var amount = 0
      this.data.cartItems.forEach(function(entry){
        amount += entry.quantity * entry.product['goods_price']
      })
    

    this.setData({amount: amount})
  },

  addQuantity: function(e) {
    this.changeCartItemQuantity('+', e)
  },

  minusQuantity: function(e) {
    this.changeCartItemQuantity('-', e)
  },

  changeCartItemQuantity: function(op, e) {
    var cartItems = this.data.cartItems
    var item = cartItems.filter(function(ele){
      return ele.id === e.currentTarget.dataset.id
    })[0]
    if (op === '-' && item.quantity > 1) {
      item.quantity -= 1
    } else if (op === '+' && item.quantity <= item.product.goods_number) {
      item.quantity += 1
    }

    this.setData({ cartItems: cartItems })
    wx.setStorage({
      key: 'cartItems',
      data: cartItems
    })
    this.changeCartAmount()
  },

  bindTapAddress () {
    wx.navigateTo({
      url: '../address/address'
    })
  }
})
