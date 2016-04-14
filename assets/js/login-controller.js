
var dynamicJSON = function(params) {
  jsonString = '"' + params[0] + '":{';
  if(params[1] == "login_token"){
    jsonString += '"' + params[1] + '": "' + JSON.parse(localStorage.getItem('user')).user_info.login_token + '"}';
    return jsonString;
  }
  $("div[name=" + params[1] + "] :input").each( function(){
    if(this.name != '' && this.value != ''){
      if(this.type == "radio"){
        if(this.checked){
          jsonString += '"' + this.name + '": "' + this.value + '",';
        }
      } else {
        jsonString += '"' + this.name + '": "' + this.value + '",';
      }
    }
  });
  return jsonString.slice(0, -1) + '}';
}

TheSceneryapp.config(function($authProvider) {
  $authProvider.httpInterceptor = function() { return true; },
  $authProvider.withCredentials = true;
  $authProvider.tokenRoot = null;
  $authProvider.baseUrl = '/';
  $authProvider.loginUrl = '/auth/login';
  $authProvider.signupUrl = '/auth/signup';
  $authProvider.unlinkUrl = '/auth/unlink/';
  $authProvider.tokenName = 'token';
  $authProvider.tokenPrefix = 'satellizer';
  $authProvider.authHeader = 'Authorization';
  $authProvider.authToken = 'Bearer';
  $authProvider.storageType = 'localStorage';

  // Facebook
  $authProvider.facebook({
    clientId: '1100219983355110',
    name: 'facebook',
    url: 'https://api.the-scenery.com/auth/facebook',
    authorizationEndpoint: 'https://www.facebook.com/v2.5/dialog/oauth',
    redirectUri: window.location.origin + '/',
    requiredUrlParams: ['display', 'scope'],
    scope: ['email'],
    scopeDelimiter: ',',
    display: 'popup',
    type: '2.0',
    popupOptions: { width: 580, height: 400 }
  });
});

TheSceneryapp.controller('LoginCtrl', function($scope, $auth) {

  $scope.authenticate = function(provider) {
    $auth.authenticate(provider);
  };

});

TheSceneryapp.controller('login-cont', function($scope, $http, ourData){

  // console.log("WAAAGH");
  $scope.message2="bestmattever";
  $scope.userinfo;
  $scope.gUserInfo = JSON.parse(localStorage.getItem('user')); //if there is already a user in the localstorage, this will grab it.
  var thing;

  //localStorage.setItem('user', "{}");

  $('.login-btn').on('click', function () {
    $('#log-in-modal').addClass('showing');
  });

  $('.sign-up-btn').on('click', function () {
    $('#sign-up-modal').addClass('showing');
  });

  $(".modal-close-btn").on('click', function () {
    $('#sign-up-modal').removeClass('showing');
    $('#log-in-modal').removeClass('showing');
  });

// //THIS CODE DETECTS IF A USER HAS A PROFILE IMAGE, OR NOT.
//   $scope.whichProfilePic = function()
//   {
//     if($scope.gUserInfo.user_info.image_url === "")
//     {
//       return "assets/images/generic_user.jpg";
//     }
//     else
//     {
//       return "https://s3.amazonaws.com/thescenery/uploads/User"+gUserInfo.user_info.id;
//     }
//   }


  $scope.viewprofile = function(){
    // console.log(JSON.parse(localStorage.getItem('user')).user_info.id)
    localStorage.setItem("profID", JSON.parse(localStorage.getItem('user')).user_info.id);
    location.reload();
  }


  $scope.isLogged = function()
  {
    //var data = JSON.parse(localStorage.getItem('user'));
    //data.user_info.login_token
    var derp = null;
    if ($scope.gUserInfo === null)//if we DONT have a login token for this person, then return false.
    {
      return true;
      $scope.$apply();
    }
    else
    {
      return false;
      $scope.$apply();
    }
  }//end islogged


//this if statment keeps the user logged in regardless of refresh.
  if(!$scope.isLogged())
  {
    $('.no-log-header').addClass('hidden');
    $('.logged-header').addClass('showing');
  }

  $scope.logout = function(){
    $('.no-log-header').removeClass('hidden');
    $('.logged-header').removeClass('showing');

    var settings = {
     "async": true,
     "crossDomain": true,
     "url": "https://api.the-scenery.com/logout",
     "method": "POST",
     "headers": {
       "content-type": "application/json",
       "cache-control": "no-cache"
     },
     "processData": false,
     "data": "{" + dynamicJSON(["user_info", "login_token"]) + "}"
    };



    $.ajax(settings).done(function (response) {
     console.log(response);
    });

    $scope.gUserInfo = "";
    $scope.userinfo = "";
    localStorage.removeItem('user');
    localStorage.removeItem('profID');
  }//end logout

  $scope.authenticate = function(){

    //========this is for calling the function. =========
    var settings = {
     "async": true,
     "crossDomain": true,
     "url": "https://api.the-scenery.com/login",
     "method": "POST",
     "headers": {
       "content-type": "application/json",
       "cache-control": "no-cache"
     },
     "processData": false,
     "data": "{" + dynamicJSON(["user_info", "user-info-login"]) + "}"
    };

    $.ajax(settings).done(function (response) {
     //console.log(response);
     $scope.userinfo = response;
    //  console.log($scope.userinfo);

     localStorage.setItem("user", JSON.stringify($scope.userinfo));

     if($scope.userinfo.success === false)
     {
       alert("sorry, that email password combo wasnt right. try again?");
     }
     else
     {
       $(".modal-input").val("");
       setTimeout(myFunction, 5);
       setTimeout(location.reload(), 200);
     }//end else
    });//end ajax call


   function myFunction() {
     thing = JSON.parse(localStorage.getItem('user'));
     console.log("thing");
     console.log(thing);

     console.log("not thing");
     $scope.gUserInfo = JSON.parse(localStorage.getItem('user'));
     console.log($scope.gUserInfo);

     console.log("{\n \"user_info\": {\n \"login_token\": \""+ $scope.gUserInfo.user_info.login_token +"}\n}");

     $('.no-log-header').addClass('hidden');
     $('.logged-header').addClass('showing');
     $('#log-in-modal, #sign-up-modal').removeClass('showing');
     $scope.$apply();
    }//end myfunction


  }//end authenticate

  $scope.createUser = function(){
    // var email = $('#sign-user-email').val();
    var password = $('#sign-user-password').val();
    var password2 = $("#confirm-user-password").val();
    // var displayname = $('#user-display-name').val();
    // var professional = $('input:radio:checked[name=is_professional]').val();
    // if(professional)
    // {
    //   professional = true;
    // }
    // else
    // {
    //   professional = false;
    // }
    // console.log(dynamicJSON(["user_info", "user-info-create"]))

    if(password === password2)//if the password fields match...
    {

      var createdUser = "{" + dynamicJSON(["user_info", "user-info-create"]) + "}";

      var settings = {
       "async": true,
       "crossDomain": true,
       "url": "https://api.the-scenery.com/users",
       "method": "POST",
       "headers": {
         "content-type": "application/json",
         "cache-control": "no-cache"
       },
       "processData": false,
      "data": createdUser
        };

        console.log(createdUser);

      $.ajax(settings).done(function (response) {
        localStorage.setItem("user", JSON.stringify(response));
        console.log(response);
        location.reload();
      });

      $('.no-log-header').addClass('hidden');
      $('.logged-header').addClass('showing');
      $('#log-in-modal, #sign-up-modal').removeClass('showing');

    }
    else//if they dont
    {
      alert("Your passwords do not match, please try again.");
    }


  }//end createauthenticate


});//end login controller
