var fs = require("fs");

function explorer(path){
		fs.readdir(path, function(err,files){
				if(err){
					console.log("error:\n"+err);
					return;
				}

				files.forEach(function(file){
						fs.stat(path+"\\"+file+'',function(err,stat){
								if(err){
										console.log(err);
										return;
								}

								if(stat.isDirectory()){
										console.log(path+"\\"+file);
										explorer(path+'\\'+file);
								}else{
										console.log(path + "\\" + file);
								}

						});
				});

		});    
}

explorer("C:\\Users\\lv_qing\\Desktop\\VP2C_Artifacts");