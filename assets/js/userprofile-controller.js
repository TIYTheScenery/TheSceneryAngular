TheSceneryapp.controller('profileCont', function($scope, $http){
  $scope.currentuser = JSON.parse(localStorage.getItem('user'));
  console.log("current user");
  console.log($scope.currentuser);

  // Place users display name into the page

  $(".user-header-displayname").text($scope.currentuser.user_info.display_name);
  $(".side-info-display-name").text($scope.currentuser.user_info.display_name);

  // If there is no logged in user reroute to homepage

  if ($scope.currentuser === null){
    document.location.href = '#/';
  }

  // If a user is not a professional hide sections that are professional only

  if ($scope.currentuser.user_info.is_professional == false){
    $(".user-header-professional").css("display", "none");
    $(".display-user-titles").css("display", "none");
    $(".edit-display-user-titles").css("display", "none");
    $(".user-social-links-wrapper").css("display", "none");
  }

  // If the user currently has a first and last name display them.

  if ($scope.currentuser.user_info.first_name != null && $scope.currentuser.user_info.last_name != null){
    $(".display-user-name").text($scope.currentuser.user_info.first_name + " " + $scope.currentuser.user_info.last_name)
  }

  // If a user has titles display them.

  // if ($scope.currentuser.user_info.titles != null){
  // $(".display-user-titles").text()
  // }

  // If a user has a description display it.

  if ($scope.currentuser.user_info.description != null){
    $(".side-info-user-description").text($scope.currentuser.user_info.description);
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
  }


});
