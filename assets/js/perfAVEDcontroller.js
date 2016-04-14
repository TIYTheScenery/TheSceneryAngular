

TheSceneryapp.controller('perfAVEDcont', function($scope, $http, ourData, $window){
  // console.log("this works!");
  $scope.message = "you are now working with angular";
  var perfcompid = JSON.parse(localStorage.getItem('companyid'));

  //use these for defaulting to view when you get on this page.
  // $scope.tAdd=true;
  // $scope.tEdit=true;
  // $scope.tView=false;

  //these poll ourdata for what the view should be on this page: view, edit, or add.
  $scope.tAdd=ourData.borrowData("tAdd");
  $scope.tEdit=ourData.borrowData("tEdit");
  $scope.tView=ourData.borrowData("tView");

  $scope.currentUser = JSON.parse(localStorage.getItem('user'));
  console.log("id from local storage:");
  console.log(JSON.parse(localStorage.getItem('perfID')));

  //gets the performance ID from localstorage
  var thisPerformanceID = JSON.parse(localStorage.getItem('perfID'));

  //var thisPerformanceID = ourData.borrowData("searchResults").id;//gets the performance id from the data service

  $scope.performanceTimes;
  $scope.thisPerformance;

//this api call gets all the information for the performance indicated by ThisPerformanceID and puts it into ThisPerformance.
  $http.get('https://api.the-scenery.com/performances/'+thisPerformanceID).then(function(data){
    ourData.shareData("viewingPerf", data.data.performance);//this sends the results of the get to the ourdata service
    console.log("current performance:");
    console.log(ourData.borrowData("viewingPerf"));//the results in the data service...

    console.log(person.user_info.id);
    console.log(data.data.performance.owner_id);

    if (person.user_info.id != data.data.performance.owner_id){
      console.log("happening");
      $("#performance-edit-btn").addClass("hidden");
      $("#performance-delete-btn").addClass("hidden");
    }

    $scope.thisPerformance = ourData.borrowData("viewingPerf");//pulling results from data service to scope variable...

    //sets the default for the genre dropdown menu when editing
    var lastinarray = $scope.thisPerformance.genre_id.length-1;
    var defaultGenre = $scope.thisPerformance.genre_id[lastinarray].genre_id;
    // lastinarray = lastinarray.genre_id;
    // console.log("defaultGenre:")
    // console.log(defaultGenre);
    $(".edit-AVED-genre-edit option[value='"+defaultGenre+"']").attr("selected", true);

    //sets the default for the creator dropdown menu when editing
    var creator = $scope.thisPerformance.owner_id;
    $(".hero-img-creator-dropdown-edit option").last().attr("selected", true);

  },function(){console.log("performance get failed...");
});//end http call.

  $('#showtime-date').pickadate();
  $('#showtime-time').pickatime();

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
      return false;//same deal here.
      $scope.$apply();
    }
  }//end islogged

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

var person = JSON.parse(localStorage.getItem('user'));
//localStorage.setItem("user", JSON.stringify(person));

console.log("This is the current user");
console.log(person);


$scope.updatePerformance = function(){

  var token = person.user_info.login_token;
  var ownerID = person.user_info.id;

  var allEditedShowsJSON=[];

  //the next 6 lines gets all the known show ids for this performance and puts them in an array for use later.
  var allShowIDs=[];
  for(var k=0;k<$scope.thisPerformance.show_times.length;k++)
  {
    console.log("show in this performance:");
    console.log($scope.thisPerformance.show_times[k]);
    allShowIDs.push($scope.thisPerformance.show_times[k].id);//this grabs the indivigual showtime ids and puts them into an array.
  }

  console.log("number of shows previously in this performance:")
  console.log(allShowIDs.length);

  var allEditedShows = $(".EDIT-showtime-wrapper").children(".EDIT-showtime-info-wrapper");

  console.log("the number of all edited shows:")
  console.log(allEditedShows.length);

  for(var i=0; i<allEditedShows.length;i++)
  {
    var showTemplate = {"id": '', "begin_time": 0, "address": 0, "city": 0, "state": 0, "zip_code": 0, "show_date":0, "_destroy": false};

    //the next 9 lines check to see if there is a show id for the show we're currently building JSON for. if not (ie: the user added a show), then it just makes the show ID an empty string.
    var thisShowID;
    if(allShowIDs[i]=== undefined)
    {
       thisShowID = '';
    }
    else
    {
      thisShowID= allShowIDs[i];
    }

    if($(allEditedShows[i]).find(".deleteCheck").is(':checked') === true)
    {
      console.log(allEditedShows[i]);
      //console.log(".re-addshowtime not found in allShows[i]");
      showTemplate._destroy = true;
    }
    else
    {
      console.log("alleditedshows["+i+"]");
      //do nothing because the default is false.
    }

    showTemplate.begin_time = $(allEditedShows[i]).find("#showtime-time").val();
    showTemplate.address = $(allEditedShows[i]).find("#showtime-address").val();
    // console.log(allEditedShows[i]);
    var temp = $(allEditedShows[i]).find('#showtime-city-state').val().split(', ');
    showTemplate.city = temp[0];
    showTemplate.state = temp[1];
    showTemplate.zip_code = $(allEditedShows[i]).find('#showtime-zip').val();
    showTemplate.show_date = $(allEditedShows[i]).find('#showtime-date').val();
    showTemplate.id = thisShowID;

    //console.log(showTemplate);
    allEditedShowsJSON.push(showTemplate);
  }//end the build shows for

  console.log("all shows JSON");
  console.log(allEditedShows.length);
  console.log(allEditedShowsJSON);

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
       "genre_id": $(".edit-AVED-genre-edit").val()
     }
   ],
    "show_times_attributes": allEditedShowsJSON
  },
  "user_info": {
    "login_token": token  //"butts"      //response.user_info.login_token
    }
  });

  console.log(performance);

//MODIFIED ANGULAR CALL
// $http({ method: 'PUT', url: 'https://api.the-scenery.com/performances/'+thisPerformanceID, data: performance});

//AJAX CALL
  // var settings = {
  //   "async": true,
  //   "crossDomain": true,
  //   "url": "https://api.the-scenery.com/performances",
  //   "method": "PATCH",
  //   "headers": {
  //     "content-type": "application/json",
  //     "cache-control": "no-cache"
  //   },
  //   "processData": false,
  //   "data": performance
  //    };
  //
  //   $.ajax(settings).done(function (data) {
  //   console.log(data);
  //   });//end ajax.


//THIS IS THE ANGULAR CALL
  $http.put('https://api.the-scenery.com/performances/'+thisPerformanceID, performance).then(function(data){
    console.log("performance updated!");
    console.log(data);
  },function(){console.log("performance update failed...");
});//end http call.

  $scope.thisPerformance = performance;

}//end updatePerformance

  $scope.addperformance = function(){
    // console.log($('.hero-img-creator-dropdown option:selected').text());
    // console.log($('#showtime-city-state').val())

    var token = person.user_info.login_token;
    var ownerID = person.user_info.id;

    var allShowsJSON=[];

    var allShows = $(".new-showtime-wrapper").children(".new-showtime-info-wrapper");

    for(var i=0; i<allShows.length;i++)
    {
      var showTemplate = {"begin_time": 0, "address": 0, "city": 0, "state": 0, "zip_code": 0, "show_date":0, "_destroy": false};

      if($(allShows[i]).find(".deleteCheck").is(':checked') === true)
      {
        console.log(".re-addshowtime not found in allShows[i]");
        showTemplate._destroy= true;
      }
      else
      {
        //do nothing because the default is false.
      }

      showTemplate.begin_time = $(allShows[i]).find("#showtime-time").val();
      showTemplate.address = $(allShows[i]).find("#showtime-address").val();

      console.log("we get this far");
      console.log(allShows[i]);

      var temp = $(allShows[i]).find('#showtime-city-state').val().split(', ');
      showTemplate.city = temp[0];
      showTemplate.state = temp[1];

      showTemplate.zip_code = $(allShows[i]).find('#showtime-zip').val();
      showTemplate.show_date = $(allShows[i]).find('#showtime-date').val();

      console.log(showTemplate);
      allShowsJSON.push(showTemplate);
    }

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
        $scope.thisPerformance = data
        localStorage.setItem('perfID', data.performance.id)
      });//end ajax.
      $scope.toggle();
  }//End addperformance

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
      });//end ajax.

  }


  // });//end jquery function

});
