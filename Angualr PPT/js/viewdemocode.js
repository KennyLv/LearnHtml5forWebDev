
var demo_map = {
		'5_0' : "demo/demo_code.html?img=1",
		'6_0' : "demo/demo_direct_basic.html",
		'2_6' : "controller/helloCtr.js"
};
var viewdemoClickfn = function(){
	var demo_page_adress = null;
	for (var _page in demo_map)
	{
		if(_page == pageIndex.h + '_' + pageIndex.v){
				demo_page_adress = demo_map[_page];
				break;
		}
	}

	if( demo_page_adress == null){
		return;
	}
	//alert('./angularJs/'+ demo_page_adress);
	window.open('./angularJs/'+ demo_page_adress, "_blank", '');
}

var $view_demo = document.getElementById('btn_viewdemo');
if($view_demo.addEventListener){  
		$view_demo.addEventListener("click",viewdemoClickfn,false);  
}else if($view_demo.attachEvent){  
		$view_demo.attachEvent("onclick",viewdemoClickfn); 
}
