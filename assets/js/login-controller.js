TheSceneryapp.controller('login-cont', function($scope, $http){
  console.log("WAAAGH");
  $scope.message2="bestmattever";

  $scope.authenticate = function(){
    var email = $('#user-email').val()
    var password = $('#user-password').val()

    var user_info =
    {
      "user_info": {
        "email": "test@test.com",
        "password": "monkey"
      }
    };


// var settings = {
//   "async": true,
//   "crossDomain": true,
//   "url": "http://infinite-reef-76606.herokuapp.com/login",
//   "method": "POST",
//   "headers": {
//     "content-type": "application/json",
//     "cache-control": "no-cache",
//     "postman-token": "0bfbcb87-614d-1514-a15d-c9c2e9c02801"
//   },
//   "processData": false,
//   "data": "{\n \"user_info\": {\n   \"email\": \"test@test.com\",\n   \"password\": \"monkey\"\n }\n}"
// }
//
// $.ajax(settings).done(function (response) {
//   console.log(response);
// });


    $http.post("http://infinite-reef-76606.herokuapp.com/login", user_info).then(function successCallback(response){
      console.log(response);
    }, function errorCallback(response){
      console.log(response);
    });
  }//end authenticate

});//end login controller
