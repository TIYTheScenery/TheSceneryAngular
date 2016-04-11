TheSceneryapp.controller('companyCont', function($scope, $http, ourData){

  var person = JSON.parse(localStorage.getItem('user'));
  var token = person.user_info.login_token;
  var ownerID = person.user_info.id;


  var createCompany = JSON.stringify({
  "company": {
    "id": "1",
    "user_id": ownerID,
    "name": $(".edit-company-name").val(),
    "description": $(".edit-company-description").val(),
    "website_link": $(".edit-company-url").val(),
    "facebook_link": $(".edit-company-facebook").val(),
    "twitter_link": $(".edit-company-twitter").val(),
    "instagram_link": $(".edit-company-instagram").val(),
    "youtube_link": $(".edit-company-youtube").val(),
    "address": $(".edit-company-location-address").val(),
    "city": $(".edit-company-location-city").val(),
    "state": $(".edit-company-location-state option:selected" ).text(),
    "zip_code": $(".edit-company-location-zip").val()
  },
  "user_info": {
    "login_token": token
  }
  });
  console.log(createCompany);

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "http://infinite-reef-76606.herokuapp.com/companies",
    "method": "POST",
    "headers": {
      "content-type": "application/json",
      "cache-control": "no-cache"
    },
    "processData": false,
    "data": createCompany
  };

  // Set edit variables to current variables

  $scope.editcompany = function(){
    $(".edit-company-name").val($(".company-name").text());
    $(".edit-company-location").val($(".company-location").text());
    $(".edit-company-url").val($(".company-url").text());
    $(".edit-company-youtube").val($(".media-youtube").parent().attr("href"));
    $(".edit-company-twitter").val($(".media-twitter").parent().attr("href"));
    $(".edit-company-facebook").val($(".media-facebook").parent().attr("href"));
    $(".edit-company-instagram").val($(".media-instagram").parent().attr("href"));
    $(".edit-company-description").val($(".company-description").text());
  }

  // Set view variables to new edited variables.

  $scope.savecompany = function(){
    $.ajax(settings).done(function (data) {
    console.log(data);
    });//end ajax.

    $(".company-name").text($(".edit-company-name").val());
    $(".edit-company-name").val("");
    $(".company-location").text($(".edit-company-location").val());
    $(".edit-company-location").val("");
    $(".company-url").text($(".edit-company-url").val());
    $(".edit-company-url").val("");
    $(".media-youtube").parent().attr("href", $(".edit-company-youtube").val());
    $(".edit-company-youtube").val("");
    $(".media-twitter").parent().attr("href", $(".edit-company-twitter").val());
    $(".edit-company-twitter").val("");
    $(".media-facebook").parent().attr("href", $(".edit-company-facebook").val());
    $(".edit-company-facebook").val("");
    $(".media-instagram").parent().attr("href", $(".edit-company-instagram").val());
    $(".edit-company-instagram").val("");
    $(".company-description").text($(".edit-company-description").val());
    $(".edit-company-description").val("");
  }
});
