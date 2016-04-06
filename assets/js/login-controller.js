
TheSceneryapp.controller('login-cont', function($scope, $http){
  console.log("WAAAGH");
  $scope.message2="bestmattever";
  $scope.userinfo;
  $scope.gUserInfo;
  var thing;

  localStorage.setItem('user', "{}");

  $('.login-btn').on('click', function () {
    $('#log-in-modal').addClass('showing');
  });

  $('.sign-up-btn').on('click', function () {
    $('#sign-up-modal').addClass('showing');
  });

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


    //========this is for calling the function. =========
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

     var performance = {
 "performance": {
   "owner_id": "1",
   "company_id": "1",
   "name": "Macbeth",
   "description": "Everyone dies",
   "trailer_link": "www.youtube.com",
   "ticket_link": "www.eventbrite.com"
 },
 "user_info": {
   "login_token": '\"response.user_info.login_token\"'
 }

}


     var settings = {
      "async": true,
      "crossDomain": true,
      "url": "http://infinite-reef-76606.herokuapp.com/performances/create",
      "method": "POST",
      "headers": {
        "content-type": "application/json",
        "cache-control": "no-cache"
       //  "postman-token": "c0af38ff-9fa4-3d8e-2eac-56f40df3d861"
      },
      "processData": false,
      "data": performance
      //"data": "{\n \"user_info\": {\n \"email\": \"test@test.com\",\n  \"password\": \"monkey\"\n    }\n}"
      //"{\n \"user_info\": {\n \"login_token\": \""+ response.user_info.login_token +", \"description\": \"Theyre from mars. and the collect garbage.\", \"name\": \"garbagemen from mars\"}\n}"
       };

     $.ajax(settings).done(function (data) {
       console.log(data);



    });//end ajax.


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
 }//end myfunction


// console.log("we're into things");
// console.log("not thing again");
// console.log($scope.gUserInfo.user_info.display_name);
// console.log("thing again");
// console.log(thing);

    // $http.post("http://infinite-reef-76606.herokuapp.com/login", user_info).then(function successCallback(response){
    //   console.log(response);
    // }, function errorCallback(response){
    //   console.log(response);
    // });


  }//end authenticate

  $scope.createUser = function(){
    var email = $('#sign-user-email').val();
    var password = $('#sign-user-password').val();
    var password2 = $("#confirm-user-password").val();
    var displayname = $('#user-display-name').val();
    var professional = $('input:radio:checked[name=blue]').val();
    if(professional)
    {
      professional = true;
    }
    else
    {
      professional = false;
    }

    if(password === password2)//if the password fields match...
    {
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
       //console.log(response);
      });

      $('.no-log-header').addClass('hidden');
      $('.logged-header').addClass('showing');
      $('#log-in-modal, #sign-up-modal').removeClass('showing');

    }
    else//if they dont
    {
      alert("yo, your passwords dont match. they need to match. you drunk bruh?");
    }


  }//end createauthenticate


});//end login controller
