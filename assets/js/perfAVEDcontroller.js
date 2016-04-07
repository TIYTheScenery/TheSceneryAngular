

TheSceneryapp.controller('perfAVEDcont', function($scope){

  console.log("this works!");
  $scope.message = "you are now working with angular";
  $scope.tAdd=true;
  $scope.tEdit=true;
  $scope.tView=false;


  $('#showtime-date').pickadate();
  $('#showtime-time').pickatime();


  $scope.toggle = function(turnOn){
    console.log('were in the toggle function');
    if(turnOn === 'ADD')
    {
      $scope.tAdd = false; //its false because we're using ngHide in the html.
      $scope.tEdit = true;
      $scope.tView = true;
    }
    else if(turnOn === 'EDIT')
    {
      $scope.tEdit = false;
      $scope.tView = true;
      $scope.tAdd = true;
    }
    else//if we're not editing, and we're not adding, we must be viewing...
    {
      $scope.tEdit = true;
      $scope.tView = false;
      $scope.tAdd = true;
    }
  }//end scope.toggle

var person = JSON.parse(localStorage.getItem('user'));
//localStorage.setItem("user", JSON.stringify(person));

console.log(person);

  $scope.addperformance = function(){
    // console.log($('.hero-img-creator-dropdown option:selected').text());
    // console.log($('#showtime-city-state').val())


    var token = person.user_info.login_token;
    var ownerID = person.user_info.id;

    var allShowsJSON=[];


    var allShows = $(".new-showtime-wrapper").children(".new-showtime-info-wrapper");

    for(var i=0; i<allShows.length;i++)
    {
      var showTemplate = {"begin_time": 0, "address": 0, "city": 0, "state": 0, "zip_code": 0, "date":0};

      showTemplate.begin_time = $(allShows[i]).find("#showtime-time").val();
      showTemplate.address = $(allShows[i]).find("#showtime-address").val();

      var temp = $(allShows[i]).find('#showtime-city-state').val().split(', ');
      showTemplate.city = temp[0];
      showTemplate.state = temp[1];

      showTemplate.zip_code = $(allShows[i]).find('#showtime-zip').val();
      showTemplate.date = $(allShows[i]).find('#showtime-date').val();

      console.log(showTemplate);
      allShowsJSON.push(showTemplate);
    }

    console.log("all shows JSON");
    console.log(allShowsJSON);

    // var performance = JSON.stringify({
    // "performance": {
    //   "owner_id": ownerID,
    //   "company_id": "1",
    //   "name": $('#performance-name').val(),
    //   "description": $('#perf-desc').val(),
    //   "trailer_link": $('#trailer-link').val(),
    //   "ticket_link": $('#ticket-link').val(),
    //   "show_times_attributes": [
    //  {
    //    "begin_time": $('#showtime-time').val(),
    //    "address": $('#showtime-address').val(),
    //    "city": city,
    //    "state": state,
    //    "zip_code": $('#showtime-zip').val(),
    //    "date": $('#showtime-date').val()
    //  }]
    // },
    // "user_info": {
    //   "login_token": token  //"butts"      //response.user_info.login_token
    // }
    //
    // });

    var performance = JSON.stringify({
    "performance": {
      "owner_id": ownerID,
      "company_id": "1",
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
      "login_token": token  //"butts"      //response.user_info.login_token
    }

    });


    console.log(performance);

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "http://infinite-reef-76606.herokuapp.com/performances",
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
      });//end ajax.

  }//End addperformance

  $scope.addNewShow = function(){
    console.log("we're in add showtimes");
    var theParent = $(".new-showtime-wrapper");
    var section = $(".Invisible-Showtime-wrapper").find(".new-showtime-info-wrapper").last();
    //var theClone = section.clone(true);
    // $(".invisible-showtime-wrapper .new-showtime-info-wrapper").last();

    theParent.append(section.wrap('<p/>').parent().html());
    section.unwrap();
  //  $(".new-showtime-wrapper").append("<br>THIS IS A NEW SHOW<br>");
  }//end addnewshow


  //ng-click="addCastMember($event)"
  // $scope.addCastMember = function($event){
  //
  //   $(function){
  //
  //   console.log("we're in the newcast");
  //   console.log($event.currentTarget);
  //
  //   // var parent = $($event.currentTarget).parent().parent().siblings(".all-cast-members");
  //   var parent = $($event.currentTarget).closest(".new-showtime-info-wrapper").find(".all-cast-members");
  //
  //   var section = $(".Invisible-Showtime-wrapper").find(".new-cast-member-wrapper").last();
  //   //var clone = section.clone(true);
  //
  //   console.log("parent:");
  //   console.log(parent);
  //   console.log("section:");
  //   console.log(section);
  //   // console.log("clone:");
  //   // console.log(clone);
  //
  //   parent.append(section.wrap('<p/>').parent().html());
  //   section.unwrap();
  //
  // }//end jquery function

    // $(function(){
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
    // console.log("clone:");
    // console.log(clone);

    parent.append(section.wrap('<p/>').parent().html());
    section.unwrap();

    });


  // });//end jquery function

});
