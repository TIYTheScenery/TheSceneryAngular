
TheSceneryapp.controller('searchController', function($scope, $http){
$scope.message3 ="GO!";


$scope.searchDB = function()
{
  console.log("searching!");
  var searchName = $('#searchName').val();
  var searchLocation =$('#searchLocation').val();
  var searchGenre =$('#searchGenre').val();

  var settings = {
   "async": true,
   "crossDomain": true,
   "url": "http://infinite-reef-76606.herokuapp.com/search/index?search_term="+searchName+"&genre_id="+searchGenre+"&location="+searchLocation,
   "method": "GET",
   "headers": {
     "content-type": "application/json",
     "cache-control": "no-cache"
   },
   "processData": false,
    };

  $.ajax(settings).done(function (response) {
   console.log(response);
   //$scope.userinfo = response;
  });//end ajax call

}//end searchDB

});//end controller
