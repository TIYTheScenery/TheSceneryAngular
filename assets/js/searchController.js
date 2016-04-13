TheSceneryapp.controller('searchController', function($scope, $http, ourData){
$scope.message3 ="GO!"
  window.onload = genrePull('genre-search', $('.landing-search-genre-wrapper'));
  var isacompany = false;
  var isaprofessional = false;
  var isaperformance = false;
// $('li').on("click", function(){
//   console.log("inside click");
//   $(this).attr("id");
//   console.log(performanceid);
// });


//confirm that the ourdata service works.
// console.log(ourData.borrowData("userInfo"));
// ourData.shareData("userInfo","something else");
// console.log(ourData.borrowData("userInfo"));


$scope.searchDB = function()
{
  console.log("searching!");
  var searchName = $('#name-search').val();
  var searchCity =$('#city-search').val();
  var searchState =$('#state-search').val();
  var searchGenre =$('#genre-search').val();
  var searchType =$('#type-search').val();

  var settings = {
   "async": true,
   "crossDomain": true,
   "url": "https://infinite-reef-76606.herokuapp.com/search/index?search_term="+searchName+"&genre_id="+searchGenre+"&city="+searchCity+"&state="+searchState+"&type="+searchType,
   "method": "GET",
   "headers": {
     "content-type": "application/json",
     "cache-control": "no-cache"
   },
   "processData": false,
    };

  $.ajax(settings).done(function (response) {
   console.log(response);
   //console.log(response.performances);

   //var iClickedDis = response.performances[clickedPerformance];
   //console.log(iClickedDis);

   //Remove Past Search results
   $('li').remove();
  //  Append Performances
   for (var i=0; i<response.performances.length; i++){
     $('.performance-show-container').append("<li id='"+i+"'><a href='#/performance'><div class='performance-box'><div class='box box-performance-name'>"+ response.performances[i].name + "</div><div class='box box-performance-date'>Company Name</div></div></a></li>");
   }
  //  Append companies
   for (var i=0; i<response.companies.length; i++){
     $('.performance-show-container').append("<li id='"+i+"'><a href='#/company'><div class='performance-box'><div class='box box-performance-name'>"+ response.companies[i].name + "</div><div class='box box-performance-date'>" + response.companies[i].description + "</div></div></a></li>");
   }
  //  Append Professionals
   for (var i=0; i<response.professionals.length; i++){
     $('.performance-show-container').append("<li id='"+i+"'><a href='#/userprofile'><div class='performance-box'><div class='box box-performance-name'>"+ response.professionals[i].display_name + "</div><div class='box box-performance-date'>User since: " + response.professionals[i].created_at + "</div></div></a></li>");
   }

  if (response.performances.length > 0){
    ourData.shareData("searchResults", response.performances);
    isaperformance = true;
  }
  if (response.companies.length > 0){
    ourData.shareData("searchResults", response.companies);
    isacompany = true;
  }
  if (response.professionals.length > 0){
    ourData.shareData("searchResults", response.professionals);
    isaprofessional =  true;
  }
  //  console.log(ourData.borrowData("searchResults"));

  });//end ajax call



  var clickedPerformance;

  $(".performance-show-container").on("click", "li", (function()
  {
    clickedPerformance = $(this).attr("id");

    // console.log(ourData.borrowData("searchResults")[clickedPerformance]);

    var clickedthing = ourData.borrowData("searchResults")[clickedPerformance];

    ourData.shareData("searchResults", clickedthing);//puts the clicked result into ourdata

    //puts the clicked result's id into local storage
    if (isaperformance = true){
      localStorage.setItem("perfID", JSON.stringify(ourData.borrowData("searchResults").id));
      isaperformance = false;
    }
    if (isacompany = true){
      localStorage.setItem("compID", JSON.stringify(ourData.borrowData("searchResults").id));
      isacompany = false;
    }
    if (isaprofessional = true){
      localStorage.setItem("profID", JSON.stringify(ourData.borrowData("searchResults").id));
      isaprofessional = false;
    }

    // console.log(ourData.borrowData("searchResults"));

    // console.log($(this).attr("id"));
  }));

  // $('.landing-header-text').css({"margin-top": "10px", "margin-bottom": "25px", "transition-duration": "1s"});
  // // $('.landing-header-desc').css({"margin-bottom": "20px", "transition-duration": "1s"});
  // $('.landing-header-desc').fadeOut(750).css({"margin-bottom": "-50px", "color": "#ddd", "transition-duration": "1s"});
  // // $('.landing-footer').css({"display": "none"});
  // $('.landing-footer').fadeOut(1000);
  // // $('.performance-show-wrapper').removeClass('hidden');
  $('.performance-show-wrapper').fadeIn(1000);
  // $('.landing-wrapper').css({"padding-bottom": "0px"});
  // $('.landing-search').val("");
  // $('.genre-search').prop('selectedIndex',0);

  $(".landing-input-wrapper").css({"padding-bottom": "2%", "transition-duration": "1s"});
  $(".landing-header-desc").fadeOut(1000)
  //.css({"transform": "perspecitve(50px);","transition-duration": "1s"})

}//end searchDB

});//end controller
