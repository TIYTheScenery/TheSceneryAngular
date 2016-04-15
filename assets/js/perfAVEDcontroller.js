TheSceneryapp.controller('perfAVEDcont', function($scope, $http, ourData, $window, $route){
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

  //these poll ourdata for what the view should be on this page: view, edit, or add.
  $scope.tAdd=ourData.borrowData("tAdd");
  $scope.tEdit=ourData.borrowData("tEdit");
  $scope.tView=ourData.borrowData("tView");


  if($scope.tAdd){
  var thisPerformanceID = JSON.parse(localStorage.getItem('perfID'));
  $scope.currentUser = JSON.parse(localStorage.getItem('user'));
  //these two calls will fill in the dropdowns for the user to select the company for the performance
  userCompanyCreate($scope.currentUser, $('.hero-img-create-dropdown-wrapper'), 'hero-img-creator-dropdown', 'performance-company-add');
  userCompanyCreate($scope.currentUser, $('.hero-img-edit-dropdown-wrapper'), 'hero-img-edit-dropdown', 'performance-company-edit');
  //set deauflt to match company_id in storge should be set on company controller
  $('.hero-img-creator-dropdown').val(parseInt(JSON.parse(localStorage.getItem('compID'))));
  //this api call gets all the information for the performance indicated by ThisPerformanceID and puts it into ThisPerformance.
  $http.get('https://api.the-scenery.com/performances/'+thisPerformanceID).then(function(data){
    ourData.shareData("viewingPerf", data.data.performance);//this sends the results of the get to the ourdata service

    //if logged in user doesn't match owner of performance then hide edit buttons
    if($scope.currentUser){
      if ($scope.currentUser.user_info.id != data.data.performance.owner_id){
        console.log("happening");
        $("#performance-edit-btn").addClass("hidden");
        $("#performance-delete-btn").addClass("hidden");
      }
    }

    $scope.thisPerformance = ourData.borrowData("viewingPerf");//pulling results from data service to scope variable...
    //set default value for the edit to the current company only works if there is a perofrmance id coming in
    if($scope.thisPerformance){
      $('.hero-img-edit-dropdown').val(parseInt($scope.thisPerformance.company_id));
    }
    //sets the default for the genre dropdown menu when editing
    var lastinarray = $scope.thisPerformance.genre_id.length-1;
    var defaultGenre = $scope.thisPerformance.genre_id[lastinarray].genre_id;

    // lastinarray = lastinarray.genre_id;
    // console.log("defaultGenre:")
    // console.log(defaultGenre);
    $(".edit-AVED-genre-edit option[value='"+defaultGenre+"']").attr("selected", true);
  },function(){console.log("performance get failed...");
});//end http call.
}//end the check to see if we're adding.


  //assign pickadate to the showtime fields
  $('#showtime-date').pickadate();
  $('#showtime-time').pickatime();

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
      $scope.tAdd=false;
      $scope.tEdit=false;
      $scope.tView=true;
      // $scope.$apply();
    }
  }//end scope.toggle


  console.log("This is the current user");
  console.log($scope.currentUser);

  $scope.addperformance = function(){
    var token = $scope.currentUser.user_info.login_token;
    var ownerID = $scope.currentUser.user_info.id;

    var allShowsJSON=[];
    var showTemplate = {"begin_time": 0, "address": 0, "city": 0, "state": 0, "zip_code": 0, "show_date":0, "_destroy": false};
    $(".new-showtime-wrapper").children(".new-showtime-info-wrapper").each(function(){
      if($(this).find(".deleteCheck").is(':checked') === true)
      {
        console.log(".re-addshowtime not found in allShows[i]");
        showTemplate._destroy= true;
      } else {
        showTemplate._destroy= false;
      }
      showTemplate.begin_time = $(this).find("#showtime-time").val();
      showTemplate.address = $(this).find("#showtime-address").val();
      showTemplate.city = $(this).find('#showtime-city').val();
      showTemplate.state = $(this).find('#showtime-state').val();
      showTemplate.zip_code = $(this).find('#showtime-zip').val();
      showTemplate.show_date = $(this).find('#showtime-date').val();
      allShowsJSON.push(showTemplate);
    });

    console.log("all shows JSON");
    console.log(allShowsJSON);

    var performance = JSON.stringify({
    "performance": {
      "owner_id": ownerID,
      "company_id": $('#performance-company-add').val(),
      "name": $('#performance-name').val(),
      "description": $('#perf-desc').val(),
      "trailer_link": $('#trailer-link').val(),
      "ticket_link": $('#ticket-link').val(),
      "genre_performances_attributes":[
       {
         "genre_id": $(".edit-AVED-genre").val()
       }
     ],
      "show_times_attributes": allShowsJSON
    },
    "user_info": {
      "login_token": token //response.user_info.login_token
    }

    });

    console.log("performance");
    console.log(performance);

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://api.the-scenery.com/performances",
      "method": "POST",
      "headers": {
        "content-type": "application/json",
        "cache-control": "no-cache"
      },
      "processData": false,
      "data": performance
       };

      $.ajax(settings).done(function (data) {
        console.log(data);
        $scope.thisPerformance = data.performance
        localStorage.setItem('perfID', data.performance.id)
        ourData.shareData("tAdd", false);
        ourData.shareData("tEdit", false);
        ourData.shareData("tView", true);
        if(data.success){
          $window.location.reload();
        }
      });//end ajax.
  }//End addperformance

  $scope.updatePerformance = function(){
    var token = $scope.currentUser.user_info.login_token;
    var ownerID = $scope.currentUser.user_info.id;

    var allEditedShowsJSON=[];

    var showTemplate = {"id": '', "begin_time": 0, "address": 0, "city": 0, "state": 0, "zip_code": 0, "show_date":0, "_destroy": false};
    $(".EDIT-showtime-wrapper").children(".EDIT-showtime-info-wrapper").each(function(){
      if($(this).find(".deleteCheck").is(':checked') === true)
      {
        showTemplate._destroy = true;
      } else {
        showTemplate._destroy = false;
      }
      showTemplate.id = $(this).find("#showtime-id").val();
      showTemplate.begin_time = $(this).find("#showtime-time").val();
      showTemplate.address = $(this).find("#showtime-address").val();
      showTemplate.city = $(this).find('#showtime-city').val()
      showTemplate.state = $(this).find('#showtime-state').val()
      showTemplate.zip_code = $(this).find('#showtime-zip').val();
      showDate = $(this).find('#showtime-date').val();
      showDate = showDate.substring(6,10) + "-" + showDate.substring(0,2) + "-" + showDate.substring(3,5);
      showTemplate.show_date = showDate;

      allEditedShowsJSON.push(showTemplate);
    });


    var performance = JSON.stringify({
    "performance": {
      "id": thisPerformanceID,
      "owner_id": ownerID,
      "company_id": $('#performance-company-edit').val(),
      "name": $('#performance-name-edit').val(),
      "description": $('#perf-desc-edit').val(),
      "trailer_link": $('#trailer-link-edit').val(),
      "ticket_link": $('#ticket-link-edit').val(),
      "genre_performances_attributes":[
       {
         "id": $scope.thisPerformance.genre_id[0].id,
         "genre_id": $(".edit-AVED-genre-edit").val()
       }
     ],
      "show_times_attributes": allEditedShowsJSON
    },
    "user_info": {
      "login_token": token
      }
  });

  console.log(performance);


    //THIS IS THE ANGULAR CALL
    $http.put('https://api.the-scenery.com/performances/'+thisPerformanceID, performance).then(function(data){
      console.log(data);
      $scope.thisPerformance = data.data.performance;
      localStorage.setItem('perfID', $scope.thisPerformance .id);
      ourData.shareData("tAdd", false);
      ourData.shareData("tEdit", false);
      ourData.shareData("tView", true);
      if(data.data.success){
        $window.location.reload();
      }
    },function(){console.log("performance update failed...");
  });//end http call.

  $scope.thisPerformance = performance;

}//end updatePerformance


  $scope.deletePerformance = function()
  {
    //prompt user for certianty.
    var doit = confirm("THE SHOW MUST GO ON! Proceeding will completely delete this Performance and all of its show times. Are you sure?");

    if(doit)
    {
      //confirm delete, delete performance, go back to landing page.
      alert("Performance deleted. The show will go on... just... at another time.")

      //THIS IS THE ANGULAR CALL
        $http.delete('https://api.the-scenery.com/performances/'+thisPerformanceID).then(function(data){
          console.log("performance DELETED!");
          console.log(data);
        },function(){console.log("performance delete failed...");
      });//end http call.

      $window.location.href = "/";
    }
    else
    {
      //do nothing. user decided not to delete.
    }
  }//end deletePerformance

  $scope.addNewShow = function(where){
    console.log("we're in add showtimes");
    if(where===1)
    {
      var theParent = $(".new-showtime-wrapper");
    }
    else if(where === 2)
    {
      var theParent = $(".EDIT-showtime-wrapper");
    }
    var section = $(".Invisible-Showtime-wrapper").find(".new-showtime-info-wrapper").last();

    if(where === 2)
    {// if this is an edit and not an add we change the class of the clone so that when we scrape the page during the edit update, we can find the right thing.
      console.log("changing classes...");
      section.removeClass("new-showtime-info-wrapper").addClass("EDIT-showtime-info-wrapper");
    }
    //var theClone = section.clone(true);
    // $(".invisible-showtime-wrapper .new-showtime-info-wrapper").last();

    if(where === 1)//1 is for adding a showtime while initilally creating.
    {
      theParent.append(section.wrap('<p/>').parent().html());
      section.unwrap();
    }
    else if(where === 2)//2 is for adding a showtime while editing..
    {
      theParent.append(section.attr("ng-hide", "tEdit").wrap('<p/>').parent().html());
      section.unwrap();
    }
    else{console.log("I dont understand where im supposed to put the new showtime...");}

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


  // });//end jquery function

});
