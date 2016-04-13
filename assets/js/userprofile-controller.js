TheSceneryapp.controller('profileCont', function($scope, $http, $window){


  $scope.currentuser = JSON.parse(localStorage.getItem('user'));
  $scope.currUserId = $scope.currentuser.user_info.id;
  console.log("Original User");
  console.log($scope.currentuser.user_info);
  console.log("user ID:")
  console.log($scope.currUserId);

  // If there is no logged in user reroute to homepage

  if ($scope.currentuser === null){
    $window.location.href = '#/';
  }

  // Place users display name into the page

  $(".user-header-displayname").text($scope.currentuser.user_info.display_name);
  $(".side-info-display-name").text($scope.currentuser.user_info.display_name);

  // If a user is not a professional hide sections that are professional only

  if ($scope.currentuser.user_info.is_professional == false){
    $(".user-header-professional").css("display", "none");
    $(".display-user-titles").css("display", "none");
    $(".edit-display-user-titles").css("display", "none");
    $(".user-social-links-wrapper").css("display", "none");
  }

  $scope.isProfessional = function(){
    return $scope.currentuser.user_info.is_professional
  }

  // If the user currently has a first and last name display them.

  if ($scope.currentuser.user_info.first_name != null && $scope.currentuser.user_info.last_name != null){
    $(".display-user-name").text($scope.currentuser.user_info.first_name + " " + $scope.currentuser.user_info.last_name)
  }

  // If a user has titles display them.

  // console.log($scope.currentuser.user_info.titles.length);

  if ($scope.currentuser.user_info.titles.length != 0){
      $(".display-user-titles").text($scope.currentuser.user_info.titles[$scope.currentuser.user_info.titles.length - 1].title);
  }

  // If a user has a description display it.

  if ($scope.currentuser.user_info.description != null){
    $(".side-info-user-description").text($scope.currentuser.user_info.description);
  }

  // Display user created at date

  $(".display-user-creation-date").text("Member since: " + $scope.currentuser.user_info.created_at);

  //Display user social links if they exist.

  if ($scope.currentuser.user_info.youtube_link != null){
    $(".user-youtube-link").parent().attr("href", $scope.currentuser.user_info.youtube_link);
  }

  if ($scope.currentuser.user_info.twitter_link != null){
    $(".user-twitter-link").parent().attr("href", $scope.currentuser.user_info.twitter_link);
  }

  if ($scope.currentuser.user_info.facebook_link != null){
    $(".user-facebook-link").parent().attr("href", $scope.currentuser.user_info.facebook_link);
  }

  if ($scope.currentuser.user_info.instagram_link != null){
    $(".user-instagram-link").parent().attr("href", $scope.currentuser.user_info.instagram_link);
  }

  // Port view variables into edit containers

  $scope.edituser = function(){
    $(".edit-display-user-name").val($(".display-user-name").text());
    $(".edit-display-user-titles").val($(".display-user-titles").text());
    $("#edit-youtube").val($(".user-youtube-link").parent().attr("href"));
    $("#edit-twitter").val($(".user-twitter-link").parent().attr("href"));
    $("#edit-facebook").val($(".user-facebook-link").parent().attr("href"));
    $("#edit-instagram").val($(".user-instagram-link").parent().attr("href"));
    $("#user-desc").val($(".side-info-user-description").text());
  }

  // Set view variables to new edited variables.

  $scope.saveuser = function(){

    var names = $(".edit-display-user-name").val().split(" ");
    var firstname = names[0];
    var lastname = names[1];

    var updatedUser = JSON.stringify({
      "user_info":{
      "description": $("#user-desc").val(),
      "first_name": firstname,
      "last_name": lastname,
      "facebook_link": $("#edit-facebook").val(),
      "twitter_link": $("#edit-twitter").val(),
      "instagram_link": $("#edit-instagram").val(),
      "youtube_link": $("#edit-youtube").val(),
      "login_token": JSON.parse(localStorage.getItem('user')).user_info.login_token,
      "email": $scope.currentuser.user_info.email,
      "id": $scope.currentuser.user_info.id,
      "display_name": $scope.currentuser.user_info.display_name,
      "is_professional": $scope.currentuser.user_info.is_professional,
      "titles_attributes": [
	       { "id": "",
           "title": $("#user-titles").val()}
       ]
      }
    });

    console.log("sending this user info");
    console.log(updatedUser);


    $(".display-user-name").text($(".edit-display-user-name").val());
    $(".edit-display-user-name").val("");
    $(".display-user-titles").text($(".edit-display-user-titles").val());
    $(".edit-display-user-titles").val("");
    $(".user-youtube-link").parent().attr("href", $("#edit-youtube").val());
    $("#edit-youtube").val("");
    $(".user-twitter-link").parent().attr("href", $("#edit-twitter").val());
    $("#edit-twitter").val("");
    $(".user-facebook-link").parent().attr("href", $("#edit-facebook").val());
    $("#edit-facebook").val("");
    $(".user-instagram-link").parent().attr("href", $("#edit-instagram").val());
    $("#edit-instagram").val("");
    $(".side-info-user-description").text($("#user-desc").val());
    $("#user-desc").val("");

    // console.log($scope.currentuser.user_info.id);

    //AJAX CALL
      var settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://infinite-reef-76606.herokuapp.com/users",
        "method": "PATCH",
        "headers": {
          "content-type": "application/json",
          "cache-control": "no-cache"
        },
        "processData": false,
        "data": updatedUser
         };

        $.ajax(settings).done(function (data) {
          console.log("Updated User");
          console.log(data);
          localStorage.setItem("user", JSON.stringify(data));

        });//end ajax.


  //   $http.put('http://infinite-reef-76606.herokuapp.com/users/'+$scope.currentuser.user_info.id, updatedUser).then(function(data){
  //     console.log("user updated!");
  //     console.log(data);
  //   },function(data){
  //     console.log("user update failed...");
  //     console.log(data);
  // });//end http call.

  }


});
