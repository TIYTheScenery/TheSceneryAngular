var TheSceneryapp = angular.module('TheSceneryapp', ['ngRoute','satellizer', 'angularjs-datetime-picker']);

TheSceneryapp.service("ourData", function(){
  var userInfo="I GOT IT!";
  var searchResults;
  var viewingPerf;
  var tAdd=true;
  var tEdit=true;
  var tView=false;
  var company;
  var associatedCompany;
  var companyCreate;

  return {
    borrowData: function(thing){
      if(thing==="userInfo")
      {return userInfo;}
      else if(thing === "viewingPerf")
      {return viewingPerf;}
      else if(thing === "companyCreate")
      {return companyCreate;}
      else if(thing==="searchResults")
      {return searchResults;}
      else if(thing==="company")
      {return company;}
      else if(thing==="associatedCompany")
      {return associatedCompany;}
      else if(thing==="tAdd")
      {return tAdd;}
      else if(thing==="tEdit")
      {return tEdit;}
      else if(thing==="tView")
      {return tView;}
      else
      {console.log("we cant return that info...");}
    },//end borrowData
    shareData: function(thing, what){
      if(thing==="userInfo")
      {userInfo = what;}
      else if(thing === "viewingPerf")
      {viewingPerf = what;}
      else if(thing === "companyCreate")
      {companyCreate = what;}
      else if(thing === "searchResults")
      {searchResults = what;}
      else if(thing === "company")
      {company = what;}
      else if(thing === "associatedCompany")
      {associatedCompany = what;}
      else if(thing==="tAdd")
      {tAdd = what;}
      else if(thing==="tEdit")
      {tEdit = what;}
      else if(thing==="tView")
      {tView = what;}
      else
      {console.log("we dont know what that is...");}
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
        .when('/userprofile', {
            templateUrl : 'partials/userprofile.html'
        })
        .when('/company', {
            templateUrl : 'partials/company.html'
        })
        .otherwise({
            redirectTo: '/'
        });
  });
