const district = require('../../utils/address_data.js')

Page({
  data: {

    receiverName:'',
    receiverPosition:'',
    foreignOrganization:'',
    giftName:'',
    giftPosition:'',
    remark:'',
           
  },

  // bindChangeProvince: function(e) {
  //   var that = this
  //   var p = this.data.arrayProvince[e.detail.value]
  //   district.cities(p, function(arrayCity){
  //     that.setData({arrayCity: arrayCity, indexCity: 0})
  //     district.counties(p, arrayCity[0], function(arrayCounty){
  //       that.setData({arrayCounty: arrayCounty, indexCounty: 0})
  //     })
  //   })

  //   this.setData({indexProvince: e.detail.value})
  //   wx.setStorageSync('currentDistrict', [this.data.indexProvince, this.data.indexCity, this.data.indexCounty])
  // },

  // bindChangeCity: function(e) {
  //   var that = this
  //   var p = this.data.arrayProvince[this.data.indexProvince]
  //   var c = this.data.arrayCity[e.detail.value]
  //   district.counties(p, c, function(arrayCounty){
  //     that.setData({arrayCounty: arrayCounty, indexCounty: 0})
  //   })
  //   this.setData({indexCity: e.detail.value})
  //   wx.setStorageSync('currentDistrict', [this.data.indexProvince, this.data.indexCity, this.data.indexCounty])
  // },

  // bindChangeCounty: function(e) {
  //   this.setData({
  //     indexCounty: e.detail.value
  //   })
  //   wx.setStorageSync('currentDistrict', [this.data.indexProvince, this.data.indexCity, this.data.indexCounty])
  // },

  formSubmit: function(e) {
    console.log(e)

    var receiverName = e.detail.value.receiverName.trim()
    var giftPosition = e.detail.value.giftPosition.trim()
    var receiverPosition = e.detail.value.receiverPosition.trim()
    var foreignOrganization = e.detail.value.foreignOrganization.trim()            
    var giftName = e.detail.value.giftName.trim()
    var remark = e.detail.value.remark.trim()

    if (!(receiverName)) {
      this.errorModal('不能为空')
      return
    }
    // if (!receiverMobile.match(/^1[3-9][0-9]\d{8}$/)) {
    //   this.errorModal('手机号格式不正确，仅支持国内手机号码')
    //   return
    // }
    wx.setStorage({key:'receiverName', data: receiverName})
    wx.setStorage({key:'receiverPosition', data: receiverPosition})
    wx.setStorage({key:'foreignOrganization', data:foreignOrganization})
    wx.setStorage({key:'giftName', data:giftName})
    wx.setStorage({key:'giftPosition', data:giftPosition})
    wx.setStorage({key:'remark', data:remark})

    var pages = getCurrentPages()
    var cartPage = pages[pages.length - 2]
    cartPage.setData({refreshAddress: true})
    wx.navigateBack()
  },

  onLoad (params) {
    var that = this

    this.setData({
      detailAddress:  wx.getStorageSync('detailAddress'),
      receiverName:   wx.getStorageSync('receiverName'),
      receiverPosition: wx.getStorageSync('receiverPosition'),
      receiverName:   wx.getStorageSync('receiverName'),
      receiverPosition: wx.getStorageSync('receiverPosition'),
      foreignOrganization:   wx.getStorageSync('foreignOrganization'),
      giftName: wx.getStorageSync('giftName') ,
      giftPosition: wx.getStorageSync('giftPosition'),
      remark: wx.getStorageSync('remark')

    })
  },

  errorModal: function(content) {
    wx.showModal({
      title: '出现错误',
      content: content
    })
  }
})
