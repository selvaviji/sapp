var app = angular.module("myApp", ['ngSanitize']);
app.controller("myCtrl", ['$scope', '$http', '$sce', function($scope,$http,$sce) {

    $scope.userselection = "cam1";
    $scope.myVar ="";
    $scope.url = "";
    $scope.txt = " ";
    $scope.iframeUrl="";
     
    $scope.setChoiceForQuestion = function(reqdata){
        if(reqdata == "STOP"){
             myStopFunction();
         }else{
            $scope.userselection = $scope.response;
            myStopFunction();
            $scope.test($scope.txt,$scope.url);
        }    
    }
    $scope.test = function(title,url){
        console.log("Test Triggered");
        $scope.frameUrl="";
        $scope.url = url;
        $scope.txtTitle = " ";
        $scope.txt =  title;
        $scope.txtTitle = "Image for the Site : "+ $scope.txt;
        if($scope.userselection=="cam1"){
             document.getElementById('r1').checked =true;
            $scope.frameUrl = 'http://admin:admin@'+url+'/cgi-bin/snapshot.cgi?channel=0';
        }else if($scope.userselection=="cam2"){
             document.getElementById('r2').checked =true;
            $scope.frameUrl = 'http://admin:admin@'+url+'/cgi-bin/snapshot.cgi?channel=1';
        }else{
            document.getElementById('r3').checked =true;
            $scope.frameUrl = "";
            myStopFunction();
        }
        $scope.iframeUrl = $sce.trustAsResourceUrl($scope.frameUrl);
        $scope.oldframe = $scope.iframeUrl;
        $scope.myVar = setInterval(function(){
           refreshiframe();
        }, 20000);
    }
    function refreshiframe() {
        $('#testframe').attr('src', $('#testframe').attr('src'));
    }

    function myStopFunction() {
        clearInterval($scope.myVar);
    }
}]);
