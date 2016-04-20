TheSceneryapp.controller('profileCont', function($scope, $http, $window, ourData){


  // console.log(localStorage.user);
  if (localStorage.user != undefined){
  $scope.currentuser = JSON.parse(localStorage.getItem('user'));
  $scope.currUserId = $scope.currentuser.user_info.id;
  console.log($scope.currentuser);
  }
  // console.log("Original User");
  // console.log($scope.currentuser.user_info);
  var searcheduserid = JSON.parse(localStorage.getItem('profID'));
  $scope.viewuser;
  // console.log("user ID:")
  // console.log($scope.currUserId);


$http.get('https://api.the-scenery.com/users/' + searcheduserid).then(function(data){
  // console.log($scope.thisCompany);
  // console.log(data);
  $scope.viewuser = data.data.user_info;

  ourData.shareData("associatedCompany", data.data.user_info.companies);

  if (localStorage.user != undefined){
    if($scope.currentuser.user_info.id != data.data.user_info.id){
      $("#editprofilebutton").css("display", "none");
      $("#createcompanybutton").css("display", "none");
    }
  }
  if (localStorage.user === undefined){
    $("#editprofilebutton").css("display", "none");
    $("#createcompanybutton").css("display", "none");
  }

  // Display user Display Name
  $(".user-header-displayname").text(data.data.user_info.display_name);
  $(".side-info-display-name").text(data.data.user_info.display_name);
  // If a user has a first and last name display them
  if (data.data.user_info.first_name != null && data.data.user_info.last_name != null){
    $(".display-user-name").text(data.data.user_info.first_name + " " + data.data.user_info.last_name)
  }
  // If a user has titles display them
  if (data.data.user_info.titles.length != 0){
      $(".display-user-titles").text(data.data.user_info.titles[data.data.user_info.titles.length - 1].title);
      $(".edit-display-user-titles-id").text(data.data.user_info.titles[data.data.user_info.titles.length - 1].id);
  }
  // If a user has a description display it
  if (data.data.user_info.description != null){
      $(".side-info-user-description").text(data.data.user_info.description);
  }
  // Display user creation date
  $(".display-user-creation-date").text("Member since: " + data.data.user_info.created_at);
  //Display user social links if they exist.
  var youtube_link = data.data.user_info.youtube_link
  if (youtube_link != null && youtube_link != ""){
    if (youtube_link.match(/\/\//)){
      $(".user-youtube-link").parent().attr("href", youtube_link);
    } else {
      $(".user-youtube-link").parent().attr("href", "//" + youtube_link);
    }
  }
  var twitter_link = data.data.user_info.twitter_link
  if (twitter_link != null && twitter_link != ""){
    if (twitter_link.match(/\/\//)){
      $(".user-twitter-link").parent().attr("href", twitter_link);
    } else {
      $(".user-twitter-link").parent().attr("href", "//" + twitter_link);
    }
  }
  var facebook_link = data.data.user_info.facebook_link
  if (facebook_link != null && facebook_link != ""){
    if (facebook_link.match(/\/\//)){
      $(".user-facebook-link").parent().attr("href", facebook_link);
    } else {
      $(".user-facebook-link").parent().attr("href", "//" + facebook_link);
    }
  }
  var instagram_link = data.data.user_info.instagram_link
  if (instagram_link != null && instagram_link != ""){
    if (instagram_link.match(/\/\//)){
      $(".user-instagram-link").parent().attr("href", instagram_link);
    } else {
      $(".user-instagram-link").parent().attr("href", "//" + instagram_link);
    }
  }

  if($(".user-youtube-link").parent().attr("href") === ""){
    $(".user-youtube-link").css("display", "none");
  }
  if($(".user-twitter-link").parent().attr("href") === ""){
    $(".user-twitter-link").css("display", "none");
  }
  if($(".user-facebook-link").parent().attr("href") === ""){
    $(".user-facebook-link").css("display", "none");
  }
  if($(".user-instagram-link").parent().attr("href") === ""){
    $(".user-instagram-link").css("display", "none");
  }

    // If a user is not a professional hide sections that are professional only

    if (data.data.user_info.is_professional === false){
      $(".user-header-professional").css("display", "none");
      $(".display-user-titles").css("display", "none");
      $(".edit-display-user-titles").css("display", "none");
      $(".user-social-links-wrapper").css("display", "none");
      $(".edit-social-link").css("display", "none");
      $(".user-company-wrapper").css("display", "none");
      //$("#createcompanybutton").css("display", "none");
    }

  // localStorage.setItem("companyid", JSON.stringify(data.data.company.id));
  // ourData.shareData("company", data.data.company);
});



$scope.usercompany = function(){
  var nomnom = ourData.borrowData("associatedCompany");
  console.log($(this)[0].company.id);
  localStorage.setItem("compID", JSON.stringify($(this)[0].company.id));
}

  // If there is no logged in user reroute to homepage

  if ($scope.currentuser === null){
    $window.location.href = '#/';
  }

  // $scope.isProfessional = function(){
  //   return $scope.currentuser.user_info.is_professional
  // }

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

  $scope.saveuser = function()
  {
    var names = $(".edit-display-user-name").val().split(" ");
    var firstname = names[0];
    var lastname = names[1];

    console.log("this is the user ID: "+$scope.currentuser.user_info.id);

    var updatedUserFD = new FormData();
    updatedUserFD.append('user_info[description]', $("#user-desc").val());
    if($scope.profileUpload != null){
      updatedUserFD.append('user_info[profile_image]', $scope.profileUpload);
    }
    updatedUserFD.append('user_info[first_name]', firstname);
    updatedUserFD.append('user_info[last_name]', lastname);
    updatedUserFD.append('user_info[facebook_link]', $("#edit-facebook").val());
    updatedUserFD.append('user_info[twitter_link]', $("#edit-twitter").val());
    updatedUserFD.append('user_info[instagram_link]', $("#edit-instagram").val());
    updatedUserFD.append('user_info[youtube_link]', $("#edit-youtube").val());
    updatedUserFD.append('user_info[login_token]', JSON.parse(localStorage.getItem('user')).user_info.login_token);
    updatedUserFD.append('user_info[email]', $scope.currentuser.user_info.email);
    updatedUserFD.append('user_info[id]', $scope.currentuser.user_info.id);
    updatedUserFD.append('user_info[display_name]', $scope.currentuser.user_info.display_name);
    updatedUserFD.append('user_info[is_professional]', $scope.currentuser.user_info.is_professional);
    updatedUserFD.append('user_info[titles_attributes][0][id]', $("#user-titles-id").text());
    updatedUserFD.append('user_info[titles_attributes][0][title]', $("#user-titles").val());

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
    var uploadUrl = "https://api.the-scenery.com/users"
    $http({
        method: "PATCH",
        url: uploadUrl,
        data: updatedUserFD,
        headers: {'Content-Type': undefined}
      }).then(function successCallback(response){
        if(response.data.success){
          console.log("Updated User");
          console.log(response);
          localStorage.setItem('user', JSON.stringify(response.data));
          location.reload();
        }else{
          console.log('user not updated', response);
          var errorText = "";
          for(var i = 0; i < response.data.errors.length; i++){
            errorText += response.data.errors[i] + "\n";
          }
          alert(errorText);
        }
      }, function errorCallback(response){
        console.log('user update call failed');
    });
  }

  $scope.tocompany = function(what){
    if(what==="CREATE")
    {
      ourData.shareData("companyCreate", true);
    }
    else if(what === "SHOW")
    {
      ourData.shareData("companyCreate", false);
    }

  }

  $scope.toreviewee = function(){
    console.log($(this)[0]);

    if ($(this)[0].review.reviewee_type === "Company"){
      // console.log($(this)[0].review.reviewee_type);
      localStorage.setItem("compID", JSON.stringify($(this)[0].review.reviewee_id));
      // $window.location.href = "#/company";
    }
    if ($(this)[0].review.reviewee_type === "Performance"){
      // console.log($(this)[0].review.reviewee_type);
      localStorage.setItem("perfID", JSON.stringify($(this)[0].review.reviewee_id));
      // $window.location.href = "#/performance";
    }
  }


})
.directive('profileImage', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.profileImage);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
});
