var fs = require("fs");
var readline = require('readline');

var localpath = "D:\\[FavoritesUri]";
var bookmarks = {};

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

										//console.log(path+"\\"+file);
										explorer(path+'\\'+file);
										
								}else{
										//console.log(path + "\\" + file);
										/*
										fs.readFile(path + "\\" + file, 'utf-8', function(err,data){ 
													if(err){ 
															console.log(err); 
													}else{ 
															//console.log(data); 
													} 
										});
										*/
										/*
										var rd = readline.createInterface({
												input: fs.createReadStream(path + "\\" + file),
												output: process.stdout,
												terminal: false
										});
										rd.on('line', function(line) {
												if(line.indexOf('URL=') != -1){
														console.log( path + "\\" + file + " : " + line.split('URL=')[1]);
												}
												process.stdout.clearLine();
												process.stdout.cursorTo(0);
												
												rd.prompt(true);
												rd.close();
										});
										*/
									
										readLines(fs.createReadStream(path + "\\" + file), function func(data) {
													if(data.indexOf('URL=') != -1){
															console.log( path + "\\" + file + " : " + data.split('URL=')[1]);
													}
										});
										
										
								}

						});
				});

		});    
}


function readLines(input, func) {
			var remaining = '';
			input.on('data', function(data) {
						remaining += data;
						var index = remaining.indexOf('\n');
						while (index > -1) {
									var line = remaining.substring(0, index);
									remaining = remaining.substring(index + 1);
									func(line);
									index = remaining.indexOf('\n');
						}
			});

			input.on('end', function() {
						if (remaining.length > 0) {
									func(remaining);
						}
			});
}


explorer(localpath);