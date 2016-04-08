

TheSceneryapp.controller('searchController', function($scope, $http, ourData){
$scope.message3 ="GO!"

//confirm that the ourdata service works.
// console.log(ourData.borrowData("userInfo"));
// ourData.shareData("userInfo","something else");
// console.log(ourData.borrowData("userInfo"));


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
  //  console.log(response);
  //  console.log(response.performances);
   $('li').remove();
   for (var i=0; i<response.performances.length; i++){
     $('.performance-show-container').append("<li><a href='#/performance'><div class='performance-box'><div class='box box-performance-name'>"+ response.performances[i].name + "</div><div class='box box-performance-date'>Company Name</div></div></a></li>");
   }
  });//end ajax call

  $('.landing-header-text').css({"margin-top": "10px", "margin-bottom": "25px", "transition-duration": "1s"});
  // $('.landing-header-desc').css({"margin-bottom": "20px", "transition-duration": "1s"});
  $('.landing-header-desc').fadeOut(1000).css({"margin-bottom": "-50px", "color": "#ddd", "transition-duration": "1s"});
  // $('.landing-footer').css({"display": "none"});
  $('.landing-footer').fadeOut(1000);
  // $('.performance-show-wrapper').removeClass('hidden');
  $('.performance-show-wrapper').fadeIn(1000);
  $('.landing-wrapper').css({"padding-bottom": "0px"});
  $('.landing-search').val("");
  $('.genre-search').prop('selectedIndex',0);

}//end searchDB

});//end controller
