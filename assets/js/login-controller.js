
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

TheSceneryapp.controller('login-cont', function($scope, $http, ourData){

  console.log("WAAAGH");
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
     "url": "https://infinite-reef-76606.herokuapp.com/logout",
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
  }//end logout

  $scope.authenticate = function(){

    //========this is for calling the function. =========
    var settings = {
     "async": true,
     "crossDomain": true,
     "url": "https://infinite-reef-76606.herokuapp.com/login",
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
     //console.log($scope.userinfo);

     localStorage.setItem("user", JSON.stringify($scope.userinfo));

     if($scope.userinfo.success === false)
     {
       alert("sorry, that email password combo wasnt right. try again?");
     }
     else
     {
       $(".modal-input").val("");
       setTimeout(myFunction, 5);
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
      var settings = {
       "async": true,
       "crossDomain": true,
       "url": "https://infinite-reef-76606.herokuapp.com/users",
       "method": "POST",
       "headers": {
         "content-type": "application/json",
         "cache-control": "no-cache"
       },
       "processData": false,
      "data": "{" + dynamicJSON(["user_info", "user-info-create"]) + "}"
        };

      $.ajax(settings).done(function (response) {
       console.log(response);
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
