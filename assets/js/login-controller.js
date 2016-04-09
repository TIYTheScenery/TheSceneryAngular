
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
      authorizationEndpoint: 'https://www.facebook.com/v2.5/dialog/oauth',
      redirectUri: 'http://localhost:3000/auth/facebook',
      requiredUrlParams: ['display', 'scope'],
      scope: ['email'],
      scopeDelimiter: ',',
      display: 'popup',
      type: '2.0',
      popupOptions: { width: 580, height: 400 }
    });
});


TheSceneryapp.controller('login-cont', function($scope, $http, $location, $interval, $window, $modal, toastr){
  console.log("WAAAGH");
  $scope.message2="bestmattever";
  $scope.userinfo;
  $scope.gUserInfo;
  var thing;

  $scope.openWindow = function() {
    var modalInstance = $modal.open({
      templateUrl: 'some-dynamic.php',
      controller: ModalInstanceCtrl,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
    // var Popup = $window.open('https://www.facebook.com/v2.5/dialog/oauth?client_id=1100219983355110&redirect_uri=http://localhost:3000/auth/facebook', 'C-Sharpcorner', 'width=500,height=400');
    // console.log('Great Success');
    // $window.popup = Popup;
    // // Popup.pollPopup();
    // Popup.addEventListener('message', function(event) {
    //   // IMPORTANT: Check the origin of the data!
    //   if (~event.origin.indexOf('localhost:4000')) {
    //       // The data has been sent from your site
    //       // The data sent with postMessage is stored in event.data
    //       console.log(event.data);
    //   } else {
    //       // The data hasn't been sent from your site!
    //       // Be careful! Do not use it.
    //       console.log('bad things')
    //       return;
    //   }
    // });

    // var polling = $interval(function() {
    //   if (!Popup|| Popup.closed || Popup.closed === undefined) {
    //     //enter error for closed window
    //     $interval.cancel(polling);
    //   }
    //   console.log('Great Success3');
    //   if (Popup.document.location.search('blank') >= 0) {
    //
    //   }
    // });
    //     $interval.cancel(polling);
    //     Popup.close();
    //   }
    //
    // }, 200);
  };

  $scope.authenticate = function(provider) {
    $scope.openWindow();
  };

  $('.login-btn').on('click', function () {
    $('#log-in-modal').addClass('showing');
  });

  $('.sign-up-btn').on('click', function () {
    $('#sign-up-modal').addClass('showing');
  });

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

  $scope.local_login = function(){

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


// console.log("we're into things");
// console.log("not thing again");
// console.log($scope.gUserInfo.user_info.display_name);
// console.log("thing again");
// console.log(thing);

    // $http.post("https://infinite-reef-76606.herokuapp.com/login", user_info).then(function successCallback(response){
    //   console.log(response);
    // }, function errorCallback(response){
    //   console.log(response);
    // });


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
