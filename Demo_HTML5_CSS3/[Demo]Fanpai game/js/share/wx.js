define(function(require, exports, module) {
	
	module.exports={
		  wxShareInit : function(){
				// 微信分享
				var option_wx = {};
				// 分享标题
				if(utils.getItem("r-wx-title")!=''){
					option_wx.title = utils.getItem("r-wx-title");
				}
				// 分享图标
				if(utils.getItem("r-wx-img")!=''){
					option_wx.img = utils.getItem("r-wx-img");
				}
				// 分享内容
				if(utils.getItem("r-wx-con")!=''){
					option_wx.con = utils.getItem("r-wx-con");
				}
				// 分享链接
				if(utils.getItem("r-wx-link")!=''){
					option_wx.link = utils.getItem("r-wx-link");
				}
				
				return option_wx;

			}
	}
});