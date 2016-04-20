$.datetimepicker.setDateFormatter({
  parseDate: function (date, format) {
      var d = moment(date, format);
      return d.isValid() ? d.toDate() : false;
  },

  formatDate: function (date, format) {
      return moment(date).format(format);
  }
});

TheSceneryapp.controller('perfAVEDcont', function($scope, $http, ourData, $window, $route){
  window.onload = $('#showtime-date-time').datetimepicker({
    format:'YYYY-M-DD h:mm a',
    formatTime:'h:mm a',
    formatDate:'YYYY-M-DD',
    step: 15
  });
  $scope.isLogged = function()
  {
    var data = JSON.parse(localStorage.getItem('user'));
    //data.user_info.login_token
    var derp = null;
    if (data === null)//if we DONT have a login token for this person, then return false.
    {
      return true;//this returns true despite a user not being logged in because it is primarily used with ng-hide.
      $scope.$apply();
    }
    else
    {
      $scope.currentUser = JSON.parse(localStorage.getItem('user'));
      return false;//same deal here.
      $scope.$apply();
    }
  }//end islogged


  $(".edit-AVED-event-times-wrapper-edit").on("click", ".deleteCheck", function(){
    if($(this)[0].checked === true){
      // console.log(this);
      // console.log($(this));
      // console.log(this.closest(".EDIT-showtime-info-wrapper"));
      var deletebox = $(this).closest(".EDIT-showtime-info-wrapper").css("background", "#C43939");
    }
    else{
      $(this).closest(".EDIT-showtime-info-wrapper").css("background", "#efefef")
    }
  });
  // if ($("#delete-check").is(":checked")){
  //   console.log("food");
  // }

  //these poll ourdata for what the view should be on this page: view, edit, or add.
  $scope.tAdd=ourData.borrowData("tAdd");
  $scope.tEdit=ourData.borrowData("tEdit");
  $scope.tView=ourData.borrowData("tView");
  // $('.edit-AVED-tags-input').datepicker();

  //these need to happen whenever a user is not logged in
  if($scope.isLogged()){
    $scope.editPowers = false;
  }

  var thisPerformanceID = JSON.parse(localStorage.getItem('perfID'));
  // if we aren't creating a new performance and there is no performance_id then redirect back to home page
  if(thisPerformanceID === null && $scope.tAdd){
    $window.location = "/";
  }
  //we need to call this every time except for a create
  //tAdd is used on ng-hide and will only be false when creating
  if($scope.tAdd){
    //this api call gets all the information for the performance indicated by ThisPerformanceID and puts it into ThisPerformance.
    $http.get('https://api.the-scenery.com/performances/'+thisPerformanceID).then(function(data){
      console.log(data);
      ourData.shareData("viewingPerf", data.data.performance);//this sends the results of the get to the ourdata service
      $scope.thisPerformance = data.data.performance;
      $scope.buyTickets = data.data.performance.ticket_link;
      if (!$scope.buyTickets.match(/\/\//) && $scope.buyTickets != null && $scope.buyTickets != ""){
        $scope.buyTickets = "//" + $scope.buyTickets;
      }
      $scope.viewTrailer = data.data.performance.trailer_link;
      if (!$scope.viewTrailer.match(/\/\//) && $scope.viewTrailer != null && $scope.viewTrailer != ""){
        $scope.viewTrailer = "//" + $scope.viewTrailer;
      }
      // this need to happen whenever a user is logged in and not creating a performance
      if($scope.isLogged() === false){
        //if logged in user doesn't match owner of performance then hide edit buttons
        if($scope.currentUser){
          if ($scope.currentUser.user_info.id != data.data.performance.owner_id){
            $scope.editPowers = false;
          } else {  //otherwise fill in drop down for the edit
            //these two calls will fill in the dropdowns for the user to select the company for the performance
            userCompanyCreate($scope.currentUser, $('.hero-img-edit-dropdown-wrapper'), 'hero-img-edit-dropdown', 'performance-company-edit');
            //set default value for the edit to the current company only works if there is a perofrmance id coming in
            if($scope.thisPerformance){
              $('.hero-img-edit-dropdown').val(parseInt($scope.thisPerformance.company_id));
            }
            //sets the default for the genre dropdown menu when editing
            var lastinarray = $scope.thisPerformance.genre_id.length-1;
            var defaultGenre = $scope.thisPerformance.genre_id[lastinarray].genre_id;
            $(".edit-AVED-genre-edit option[value='"+defaultGenre+"']").attr("selected", true);
            $scope.editPowers = true;
          }
        }
      }//end the check to see if we're adding.
    });
  }

  // set up for create
  if($scope.tAdd === false && $scope.isLogged() === false){
    //create dropdown for performance creation and set default to company that user came from
    //if that company is in localStorage
    console.log($scope.currentUser);
    userCompanyCreate($scope.currentUser, $('.hero-img-create-dropdown-wrapper'), 'hero-img-creator-dropdown', 'performance-company-add');
    var company_id = JSON.parse(localStorage.getItem('compID'));
    if(company_id){
      $('.hero-img-creator-dropdown').val(company_id);
    }
    $scope.editPowers = false;
  }


// $(".Invisible-Showtime-wrapper").find('.EDIT-showtime-date-input').datepicker();
  //assign pickadate to the showtime fields
    // $('#showtime-date').pickadate();
    // $('#showtime-time').pickatime();

  $scope.toggle = function(turnOn){
    if(turnOn === 'ADD')
    {
      $scope.tAdd=false;
      $scope.tEdit=true;
      $scope.tView=true;
      // $scope.$apply();
    }
    else if(turnOn === 'EDIT')
    {
      $scope.tAdd=true;
      $scope.tEdit=false;
      $scope.tView=true;
      // $scope.$apply();
    }
    else//if we're not editing, and we're not adding, we must be viewing...
    {
      $scope.tAdd=true;
      $scope.tEdit=true;
      $scope.tView=false;
      // $scope.$apply();
    }
  }//end scope.toggle

  $scope.addperformance = function(){
    var token = $scope.currentUser.user_info.login_token;
    var ownerID = $scope.currentUser.user_info.id;

    var createPerformanceFD = new FormData();
    createPerformanceFD.append("performance[owner_id]", ownerID);
    if ($scope.profileUploadCreate != null){
      createPerformanceFD.append("performance[hero_image]", $scope.profileUploadCreate);
    }
    createPerformanceFD.append("performance[company_id]", $('#performance-company-add').val());
    createPerformanceFD.append("performance[name]", $('#performance-name').val());
    createPerformanceFD.append("performance[description]",$('#perf-desc').val());
    createPerformanceFD.append("performance[trailer_link]", $('#trailer-link').val());
    createPerformanceFD.append("performance[ticket_link]", $('#ticket-link').val());
    createPerformanceFD.append("performance[genre_performances_attributes][0][genre_id]", $(".edit-AVED-genre").val());
    createPerformanceFD.append('user_info[login_token]', token);

    $(".new-showtime-wrapper").children(".new-showtime-info-wrapper").each(function(index){
      if($(this).find("#delete-check").is(':checked'))
      {
        createPerformanceFD.append("performance[show_times_attributes][" + index + "][_destroy]", true);
      } else {
        createPerformanceFD.append("performance[show_times_attributes][" + index + "][_destroy]", false);
      }
      createPerformanceFD.append("performance[show_times_attributes][" + index + "][address]", $(this).find("#showtime-address").val());
      createPerformanceFD.append("performance[show_times_attributes][" + index + "][city]", $(this).find('#showtime-city').val());
      createPerformanceFD.append("performance[show_times_attributes][" + index + "][state]", $(this).find('#showtime-state').val());
      createPerformanceFD.append("performance[show_times_attributes][" + index + "][zip_code]", $(this).find('#showtime-zip').val());
      createPerformanceFD.append("performance[show_times_attributes][" + index + "][show_date]", $(this).find('.showtime-date-time').val());
    });

    var uploadUrl = 'https://api.the-scenery.com/performances'
    $http({
      method: "POST",
      url: uploadUrl,
      data: createPerformanceFD,
      headers: {'Content-Type': undefined}
    }).then(function successCallback(response){
      console.log("Created performance");
      console.log(response);
      $scope.thisPerformance = response.data.performance;
      localStorage.setItem('perfID', $scope.thisPerformance.id);
      ourData.shareData("tAdd", true);
      ourData.shareData("tEdit", true);
      ourData.shareData("tView", false);
      $window.location.reload();
    }, function errorCallback(response){
      console.log('performance not created', response);
      var errorText = "";
      for(var i = 0; i < response.data.errors.length; i++){
        errorText += response.data.errors[i] + "\n";
      }
      alert(errorText);
    });//end http call
  }//End addperformance

  $scope.updatePerformance = function(){
    var token = $scope.currentUser.user_info.login_token;
    var ownerID = $scope.currentUser.user_info.id;

    var updatedPerformanceFD = new FormData();
    updatedPerformanceFD.append("performance[id]", thisPerformanceID);
    updatedPerformanceFD.append("performance[owner_id]", ownerID);
    if($scope.profileUploadEdit != null){
      updatedPerformanceFD.append("performance[hero_image]", $scope.profileUploadEdit);
    }
    updatedPerformanceFD.append("performance[company_id]", $('#performance-company-edit').val());
    updatedPerformanceFD.append("performance[name]", $('#performance-name-edit').val());
    updatedPerformanceFD.append("performance[description]",$('#perf-desc-edit').val());
    updatedPerformanceFD.append("performance[trailer_link]", $('#trailer-link-edit').val());
    updatedPerformanceFD.append("performance[ticket_link]", $('#ticket-link-edit').val());
    updatedPerformanceFD.append("performance[genre_performances_attributes][0][id]", $scope.thisPerformance.genre_id[0].id);
    updatedPerformanceFD.append("performance[genre_performances_attributes][0][genre_id]", $(".edit-AVED-genre-edit").val());
    updatedPerformanceFD.append('user_info[login_token]', token);

    $(".EDIT-showtime-wrapper").children(".EDIT-showtime-info-wrapper").each(function(index){
      if($(this).find("#delete-check").is(':checked'))
      {
        updatedPerformanceFD.append("performance[show_times_attributes][" + index + "][_destroy]", true);
      } else {
        updatedPerformanceFD.append("performance[show_times_attributes][" + index + "][_destroy]", false);
      }
      updatedPerformanceFD.append("performance[show_times_attributes][" + index + "][id]", $(this).find("#showtime-id").val());
      updatedPerformanceFD.append("performance[show_times_attributes][" + index + "][address]", $(this).find("#showtime-address").val());
      updatedPerformanceFD.append("performance[show_times_attributes][" + index + "][city]", $(this).find('#showtime-city').val());
      updatedPerformanceFD.append("performance[show_times_attributes][" + index + "][state]", $(this).find('#showtime-state').val());
      updatedPerformanceFD.append("performance[show_times_attributes][" + index + "][zip_code]", $(this).find('#showtime-zip').val());
      updatedPerformanceFD.append("performance[show_times_attributes][" + index + "][show_date]", $(this).find('.showtime-date-time').val());
    });

    var uploadUrl = 'https://api.the-scenery.com/performances/' + thisPerformanceID
    $http({
      method: "PUT",
      url: uploadUrl,
      data: updatedPerformanceFD,
      headers: {'Content-Type': undefined}
    }).then(function successCallback(response){
      console.log("Updated performance");
      console.log(response);
      $scope.thisPerformance = response.data.performance;
      localStorage.setItem('perfID', $scope.thisPerformance .id);
      ourData.shareData("tAdd", true);
      ourData.shareData("tEdit", true);
      ourData.shareData("tView", false);
      $window.location.reload();
    }, function errorCallback(response){
      console.log('post not created', response);
      var errorText = "";
      for(var i = 0; i < response.data.errors.length; i++){
        errorText += response.data.errors[i] + "\n";
      }
      alert(errorText);
    });//end http call
  }//end updatePerformance


  $scope.deletePerformance = function()
  {
    //prompt user for certianty.
    var doit = confirm("THE SHOW MUST GO ON! Proceeding will completely delete this Performance and all of its show times. Are you sure?");

    if(doit)
    {
      var token = $scope.currentUser.user_info.login_token;
      //confirm delete, delete performance, go back to landing page.
      alert("Performance deleted. The show will go on... just... at another time.")

      var user_info = JSON.stringify({
        "user_info": {
          "login_token": token
        }
      });

      //THIS IS THE ANGULAR CALL
      $http.delete('https://api.the-scenery.com/performances/'+thisPerformanceID, user_info).then(function(data){
        console.log("performance DELETED!");
        console.log(data);
        $window.location.href = "/";
      },function(data){
        console.log("performance delete failed...");
        console.log(data);
      });//end http call.
    }
    else
    {
      //do nothing. user decided not to delete.
    }
  }//end deletePerformance

  $scope.addNewShow = function(where){
    console.log("we're in add showtimes");
    if(where == 1)
    {
      var theParent = $(".new-showtime-wrapper");
    }
    else if(where == 2)
    {
      var theParent = $(".EDIT-showtime-wrapper");
    }
    var section = $(".Invisible-Showtime-wrapper").find(".new-showtime-info-wrapper").last();

    var theClone = section.clone(true);
    if(where == 2)
    {// if this is an edit and not an add we change the class of the clone so that when we scrape the page during the edit update, we can find the right thing.
      console.log("changing classes...");
      theClone.removeClass("new-showtime-info-wrapper").addClass("EDIT-showtime-info-wrapper");
      // theClone.find('.new-showtime-date-input').datepicker();
    }
    newID = 'showtime-date-time' + Date.now();
    theClone.find('.showtime-date-time').attr("id", newID);


    if(where == 1)//1 is for adding a showtime while initilally creating.
    {
      theParent.append(theClone.wrap('<p/>').parent().html());
      theClone.unwrap();
    }
    else if(where == 2)//2 is for adding a showtime while editing..
    {
      theParent.append(theClone.attr("ng-hide", "tEdit").wrap('<p/>').parent().html());
      theClone.unwrap();
    }
    else{console.log("I dont understand where im supposed to put the new showtime...");}

    $('#' + newID).datetimepicker({
      format:'YYYY-M-DD h:mm a',
      formatTime:'h:mm a',
      formatDate:'YYYY-M-DD',
      step: 15
    });
  //  $(".new-showtime-wrapper").append("<br>THIS IS A NEW SHOW<br>");
  }//end addnewshow

//THE FOLLOWING CODE ADDS A NEW CAST MEMBER.
    $(".edit-AVED-event-times-wrapper").on("click", ".add-performer", function(){

    console.log("we're in the newcast");
    console.log(this);

    // var parent = $($event.currentTarget).parent().parent().siblings(".all-cast-members");
    var parent = $(this).closest(".new-showtime-info-wrapper").find(".all-cast-members");

    var section = $(".Invisible-Showtime-wrapper").find(".new-cast-member-wrapper").last();
    //var clone = section.clone(true);

    console.log("parent:");
    console.log(parent);
    console.log("section:");
    console.log(section);

    parent.append(section.wrap('<p/>').parent().html());
    section.unwrap();

  });//end adding new cast member

  $scope.submitreview = function(){

    if (localStorage.user === undefined){
      alert("Please log in if you wish to submit a review");
      $(".new-review").val("");
    }

    var reviewtext = $(".new-review").val();
    var user = JSON.parse(localStorage.getItem('user'));
    var currentperf = ourData.borrowData("viewingPerf");
    // console.log(user.user_info);

    var review = JSON.stringify({
        "id": "",
        "opinion": reviewtext,
        "rating": null,
        "user_id": user.user_info.id,
        "reviewee_id": currentperf.id,
        "reviewee_type": "Performance",
        "display_name": user.user_info.display_name,
        "user_info": {
          "login_token": user.user_info.login_token
        }
    });  //End Review
    console.log(review);

    // currentperf.reviews.push(review);
    // currentperf.user_info = {"login_token": user.user_info.login_token};
    // console.log(currentperf);

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://api.the-scenery.com/reviews",
      "method": "POST",
      "headers": {
        "content-type": "application/json",
        "cache-control": "no-cache"
      },
      "processData": false,
      "data": review
       };

      $.ajax(settings).done(function (data) {
      console.log(data);
      $(".new-review").val("");
      location.reload();
      });//end ajax.

  }

  $scope.toperformancereviewer = function(){
    // console.log($(this)[0])
    localStorage.setItem("profID", JSON.stringify($(this)[0].review.user_id));
  }

  console.log("tView");
  console.log(ourData.borrowData("tView"));

  // });//end jquery function

})
.directive('initEdit', function(){
  return {
    restrict: "A",
    scope: {
      initEdit: '='
    },
    link: function(scope, element, attrs) {
      element[0].id = 'showtime-date-time' + Date.now();
      $('#' + element[0].id).datetimepicker({
        format:'YYYY-M-DD h:mm a',
        formatTime:'h:mm a',
        formatDate:'YYYY-M-DD',
        step: 15
      });
    }
  };
})
.directive('profileImageCreate', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.profileImageCrete);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
})
.directive('profileImageEdit', function ($parse) {
  return {
      restrict: 'A',
      link: function(scope, element, attrs) {
          var model = $parse(attrs.profileImageEdit);
          var modelSetter = model.assign;

          element.bind('change', function(){
              scope.$apply(function(){
                  modelSetter(scope, element[0].files[0]);
              });
          });
      }
  };
});
