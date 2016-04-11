TheSceneryapp.controller('companyCont', function($scope, $http, ourData){

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
