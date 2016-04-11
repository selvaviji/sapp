angular.module("myapp", [])
         .controller("HelloController", function($scope) {
            $scope.helloTo = {};
            $scope.helloTo.title = "AngularJS";
			
			
			$scope.showChilds = function(index){
  
        		$scope.items[index].active = !$scope.items[index].active;
        		collapseAnother(index);
    		};
    
			var collapseAnother = function(index){
				for(var i=0; i<$scope.items.length; i++){
					if(i!=index){
						$scope.items[i].active = false;
					}
				}
			};
    
			$scope.items = [
			
				{
					iconname : "icon-dashboard",
					name: "Dashboard",
					url: ""
				},
				{
					iconname : "icon-bell",
					name: "Alarm",
					url: "live-page.php"
				}
				,
				{
					iconname : "icon-bullhorn",
					name: "Live",
					url: "alarm-page.php"
				}
				,
				{
					iconname : "icon-book",
					name: "Raw Data",
					url: ""
				}
				,
				{
					iconname : "icon-bar-chart",
					name: "Reports",
					dropicon: "icon-angle-down",
					subItems: [
						{iconname : "icon-circle-arrow-right",name: "Alarm Panel", urls : ""},
						{iconname : "icon-file-text",name: "All Tickets", urls : ""},
						{iconname : "icon-bell-alt",name: "All Alarm Reports", urls : ""},
						{iconname : "icon-building",name: "Chest Door", urls : ""},
						{iconname : "icon-gear",name: "Custom", urls : ""},
						{iconname : "icon-file-alt",name: "Deterrence Ticket", urls : ""}
					]
				},
				{
					iconname : "icon-th",
					name: "Trouble Tickets",
					url: ""
				},
				{
					iconname : "icon-list-alt",
					name: "Energy Data",
					url: ""
				}
			];
         });