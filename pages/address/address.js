const district = require('../../utils/address_data.js')

Page({
  data: {

    receiverName:'',
    receiverPosition:'',
    foreignOrganization:'',
    giftName:'',
    giftPosition:'',
    remark:'',
           
    pickerValue1: '请选择',
    pickerValue2: '请选择',
    money:null,
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
    var pickerValue1 = this.data.pickerValue1
    var pickerValue2 = this.data.pickerValue2
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
    wx.setStorage({key:'missiontype', data:pickerValue1})
    wx.setStorage({key:'missionlevel', data:pickerValue2})

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
    var pickerValue1 = wx.getStorageSync('missiontype')
    var pickerValue2 = wx.getStorageSync('missionlevel')  
    if(pickerValue1 != "" && pickerValue2 != ""){
      this.setData({
        pickerValue1: wx.getStorageSync('missiontype'),
        pickerValue2: wx.getStorageSync('missionlevel'),          
      })
    }   
  },

  errorModal: function(content) {
    wx.showModal({
      title: '出现错误',
      content: content
    })
  },

  handlePickerChange1(e) {
    const selectedIndex = e.detail.value;
    const options = ['会见会谈', '出访'];
    const selectedValue = options[selectedIndex];

    this.setData({
      pickerValue1: selectedValue,
    });
  },

  handlePickerChange2(e) {
    const selectedIndex = e.detail.value;
    const options = ['部级', '司局级'];
    const selectedValue = options[selectedIndex];

    this.setData({
      pickerValue2: selectedValue,
    });
  },
  validateMoney: function () {
    const pickerValue1 = this.data.pickerValue1;
    const pickerValue2 = this.data.pickerValue2;
    let money = this.data.money;

    if (pickerValue1 === "会见会谈") {
      if (pickerValue2 === "部级" && money > 400) {
        wx.showToast({
          title: "会见会谈部级金额不能超过400",
          icon: "none",
        });
        money = null;
      } else if (pickerValue2 === "司局级" && money > 200) {
        wx.showToast({
          title: "会见会谈司局级金额不能超过200",
          icon: "none",
        });
        money = null;
      }
    } else if (pickerValue1 === "出访") {
      if (pickerValue2 === "部级" && money > 1000) {
        wx.showToast({
          title: "出访部级金额不能超过1000",
          icon: "none",
        });
        money = null;
      } else if (pickerValue2 === "司局级" && money > 500) {
        wx.showToast({
          title: "出访司局级金额不能超过500",
          icon: "none",
        });
        money = null;
      }
    }
    this.setData({
      money: money,
    });
  },

})
