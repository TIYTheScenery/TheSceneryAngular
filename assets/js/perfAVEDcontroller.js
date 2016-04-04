var TheSceneryapp = angular.module('TheSceneryapp', ['ngRoute']);

TheSceneryapp.controller('perfAVEDcont', function($scope){
  console.log("this works!");
  $scope.message = "you are now working with angular";
  $scope.tAdd;
  $scope.tEdit;
  $scope.tView;


  $scope.toggle = function(turnOn){
    console.log('were in the toggle function');
    if(turnOn === 'ADD')
    {
      $scope.tAdd = false; //its false because we're using ngHide in the html.
      $scope.tEdit = true;
      $scope.tView = true;
    }
    else if(turnOn === 'EDIT')
    {
      $scope.tEdit = false;
      $scope.tView = true;
      $scope.tAdd = true;
    }
    else//if we're not editing, and we're not adding, we must be viewing...
    {
      $scope.tEdit = true;
      $scope.tView = false;
      $scope.tAdd = true;
    }
  }//end scope.toggle


});
