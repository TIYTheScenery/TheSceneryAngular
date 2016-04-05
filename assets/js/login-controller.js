TheSceneryapp.controller('login-cont', function($scope, $http){
  console.log("WAAAGH");
  $scope.message2="bestmattever";
  $scope.userinfo


  $scope.authenticate = function(){
    var email = $('#user-email').val()
    var password = $('#user-password').val()
    // console.log(email);
    // console.log(password);

    // var user_info ={
    //   "user_info": {
    //     "email": "test@test.com",
    //     "password": "monkey"
    //     }
    //   };


    var settings = {
     "async": true,
     "crossDomain": true,
     "url": "http://infinite-reef-76606.herokuapp.com/login",
     "method": "POST",
     "headers": {
       "content-type": "application/json",
       "cache-control": "no-cache"
      //  "postman-token": "c0af38ff-9fa4-3d8e-2eac-56f40df3d861"
     },
     "processData": false,
     "data": "{\n \"user_info\": {\n \"email\": \""+ email +"\",\n  \"password\": \""+ password +"\"\n    }\n}"
     //"data": "{\n \"user_info\": {\n \"email\": \"test@test.com\",\n  \"password\": \"monkey\"\n    }\n}"
      };

    $.ajax(settings).done(function (response) {
     console.log(response);
    });


    // $http.post("http://infinite-reef-76606.herokuapp.com/login", user_info).then(function successCallback(response){
    //   console.log(response);
    // }, function errorCallback(response){
    //   console.log(response);
    // });
  }//end authenticate

  $scope.createauthenticate = function(){
    var email = $('#sign-user-email').val()
    var password = $('#sign-user-password').val()
    var displayname = $('#user-display-name').val()
    var professional = $('input:radio:checked[name=blue]').val()
    if(professional)
    {
      professional = true;
    }
    else
    {
      professional = false;
    }

    var settings = {
     "async": true,
     "crossDomain": true,
     "url": "http://infinite-reef-76606.herokuapp.com/users",
     "method": "POST",
     "headers": {
       "content-type": "application/json",
       "cache-control": "no-cache"
     },
     "processData": false,
    "data": "{\n \"user_info\": {\n   \"email\": \""+email+"\",\n   \"password\": \""+password+"\",\n   \"is_professional\": "+professional+",\n   \"display_name\": \""+displayname+"\"\n }\n}"
      };

    $.ajax(settings).done(function (response) {
     console.log(response);
     $scope.userinfo=response;
     console.log($scope.userinfo);
    });
  }//end authenticate
  console.log($scope.userinfo);
});//end login controller
