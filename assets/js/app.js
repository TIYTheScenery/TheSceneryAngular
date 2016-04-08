var TheSceneryapp = angular.module('TheSceneryapp', ['ngRoute']);

TheSceneryapp.service("ourData", function(){
  var userInfo="I GOT IT!";
  var tAdd=true;
  var tEdit=true;
  var tView=false;

  return {
    borrowData: function(thing){
      if(thing==="userInfo")
      {return userInfo;}
      else if(thing==="tAdd")
      {return tAdd;}
      else if(thing==="tEdit")
      {return tEdit;}
      else if(thing==="tView")
      {return tView;}
      else
      {console.log("we're not holding onto that info...");}
    },//end borrowData
    shareData: function(thing, what){
      if(thing==="userInfo")
      {userInfo = what;}
      else if(thing==="tAdd")
      {tAdd = what;}
      else if(thing==="tEdit")
      {tEdit = what;}
      else if(thing==="tView")
      {tView = what;}
      else
      {console.log("we're not holding onto that info...");}
      // userInfo = what;
    }//sendData


  }//end return object


})//end sharedata service

 TheSceneryapp.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl : 'partials/landing.html'
        })
        .when('/performance', {
            templateUrl : 'partials/performanceAVED.html'
        })
        // .otherwise({
        //     redirectTo: '/'
        // });
  });
