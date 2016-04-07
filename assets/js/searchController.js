
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

  $('.landing-header-text').css({"margin-top": "10px", "margin-bottom": "25px", "transition-duration": "1s"});
  // $('.landing-header-desc').css({"margin-bottom": "20px", "transition-duration": "1s"});
  $('.landing-header-desc').fadeOut(1000).css({"margin-bottom": "-50px", "color": "#ddd", "transition-duration": "1s"});
  // $('.landing-footer').css({"display": "none"});
  $('.landing-footer').fadeOut(1000);
  // $('.performance-show-wrapper').removeClass('hidden');
  $('.performance-show-wrapper').fadeIn(1000);

}//end searchDB

});//end controller
