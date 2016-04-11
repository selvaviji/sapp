(function () {
		var app = angular.module('Demo', ['AxelSoft']);
				
		app.controller('DemoController', ['$scope', function ($scope) {
				$scope.x = window.user;
				$scope.savestatus = "add";
				$scope.queryString = "";
				var bc ="";
				var spltdata = [];
				console.log("demo---------" +$scope.x);
				$scope.edit = function(){
					$scope.savestatus = "edit";
					bc = document.getElementById("bcrumb").innerText;
					console.log(document.getElementById("addgeofix").innerText);
					spltdata = bc.split("/");
					var lendata = spltdata.length-1;
					$scope.queryString = spltdata[lendata].trim();
					document.getElementById("name").value = $scope.queryString;
				};
				$scope.delete = function(){
					$scope.savestatus = "delete";
					bc = document.getElementById("bcrumb").innerText;
					spltdata = bc.split("/");
					var lendata = spltdata.length-1;
					$scope.queryString = spltdata[lendata].trim();
					document.getElementById("name").value = $scope.queryString;
					
					
					//console.log("Delete Triggered");
				};
				$scope.saveGeography = function(){
					var name = document.getElementById("name").value;
					var cname = document.getElementById("bcrumb").innerText;
					//console.log("Name :"+name);
					//console.log("Status :"+$scope.savestatus);
					if($scope.savestatus == "add"){
						if(name != "" && cname !=""){	
							$.ajax({ 
							    url: '/geography/addgeography',
							    type: 'POST',
							    cache: false, 
							    data: { field1: name, field2: cname }, 
							    success: function(data){
							        alert('Success!')
							    }
							    , error: function(jqXHR, textStatus, err){
							        alert('text status '+textStatus+', err '+err)
							    }
							});
							window.location.href = '/geography';
						}else{
							$("#error").text("Error in input");
						}	
					}else if($scope.savestatus == "edit"){
						var name = document.getElementById("name").value;
						var cname = document.getElementById("bcrumb").innerText;
						var qname = $scope.queryString;
						if(name != "" && cname !="" && qname !=""){	
							$.ajax({ 
							    url: '/geography/updategeography',
							    type: 'POST',
							    cache: false, 
							    data: { field1: name, field2: cname, field3: qname }, 
							    success: function(data){
							        alert('Success!')
							    }
							    , error: function(jqXHR, textStatus, err){
							        alert('text status '+textStatus+', err '+err)
							    }
							});
							window.location.href = '/geography';
						}else{
							$("#error").text("Error in input");
						}	
					}else if($scope.savestatus == "delete"){
						var name = document.getElementById("name").value;
						var cname = document.getElementById("bcrumb").innerText;
						var qname = $scope.queryString;
						if(name != "" && cname !="" && qname !=""){	
							$.ajax({ 
							    url: '/geography/deletegeography',
							    type: 'POST',
							    cache: false, 
							    data: { field1: name, field2: cname, field3: qname }, 
							    success: function(data){
							        alert('Success!')
							    }
							    , error: function(jqXHR, textStatus, err){
							        alert('text status '+textStatus+', err '+err)
							    }
							});
							window.location.href = '/geography';
						}else{
							$("#error").text("Error in input");
						}	
					}//end of delete if
							
				};


				$scope.displayData = function (argument) {
					//console.log("Argument :"+argument);
					$scope.struct = "";
					$scope.editStatus = false;
					if (Object.keys(argument).length == 0){
						$scope.struct = '{"folders": [{"name":"Root"}]}';
					}else{		
						$scope.arg = JSON.stringify(argument);
						$scope.result = $scope.arg.substring(1, $scope.arg.length-1);
						$scope.struct = '{"folders": [{"name":"Root",'+$scope.result+ '}]}';
					}
					//console.log("String :"+$scope.struct);
					
					$scope.breadcrums = [''];
					var obj = JSON.parse($scope.struct);
					//console.log("Object :"+obj);
					$scope.structure = obj; // argument;
					//console.log("Triggered displayData :"+$scope.structure);
					$scope.options = {
						onNodeSelect: function (node, breadcrums) {
							console.log("click Triggered000");
							$scope.breadcrums = breadcrums;
							document.getElementById("name").value = "";
						}
					};
					
					$scope.options2 = {
						collapsible: false
					};
					
					var iconClassMap = {
							txt: 'icon-file-text',
							jpg: 'icon-picture blue',
							png: 'icon-picture orange',
							gif: 'icon-picture'
					},
					defaultIconClass = 'icon-file';
					
					$scope.options3 = {
						mapIcon: function (file) {
							var pattern = /\.(\w+)$/,
								match = pattern.exec(file.name),
								ext = match && match[1];
							
							return iconClassMap[ext] || defaultIconClass;
						}
					};

					//console.log("Status :"+$scope.editStatus);
				};
				$scope.getJsonData = function (user) {
					//console.log("Arg :"+$scope.x);	
					var data =  $scope.x;
					if (Object.keys(data).length == 0){

						return $scope.displayData({});
					}
					//console.log("Arg :"+Object.keys(data).length);
					//console.log("step-1 :"+JSON.stringify(data));
					var hierarchy = { folders : [] },
					dataIndex=[],
					nested = ["country_name","zone_name","state_name","district_name","area_name"];
					var fstatus=false;
					data.forEach(function(d){
						
						var jsonDummy = hierarchy.folders;
						nested.forEach(function( jsonValue, jsonIndex ){
							
							var index;	
							fstatus=false;		
							jsonDummy.forEach(function(child,i){
								
								//console.log("JV :"+d[jsonValue] + "==="+child.name);
								if ( d[jsonValue] == child.name ) index = i;
							});
							if(d[jsonValue] != null){
								
								if ( isNaN(index)) {
									
									
										if(jsonIndex==4){
											jsonDummy.push({ name : d[jsonValue]});
											index = jsonDummy.length - 1;
										}else{
											fstatus=true;
											jsonDummy.push({ name : d[jsonValue], folders : []});
											index = jsonDummy.length - 1;
										}	
								}
								
								jsonDummy = jsonDummy[index].folders;
							
							}	
							
						});
						
					});

					$scope.displayData(hierarchy);
				}		
			}]);
				
		})();