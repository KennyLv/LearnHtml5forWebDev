define(function(require, exports, module) {
	
	module.exports={
		  wxShareInit : function(){
				// ΢�ŷ���
				var option_wx = {};
				// �������
				if(utils.getItem("r-wx-title")!=''){
					option_wx.title = utils.getItem("r-wx-title");
				}
				// ����ͼ��
				if(utils.getItem("r-wx-img")!=''){
					option_wx.img = utils.getItem("r-wx-img");
				}
				// ��������
				if(utils.getItem("r-wx-con")!=''){
					option_wx.con = utils.getItem("r-wx-con");
				}
				// ��������
				if(utils.getItem("r-wx-link")!=''){
					option_wx.link = utils.getItem("r-wx-link");
				}
				
				return option_wx;

			}
	}
});