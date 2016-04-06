

TheSceneryapp.controller('perfAVEDcont', function($scope){
  console.log("this works!");
  $scope.message = "you are now working with angular";
  $scope.tAdd;
  $scope.tEdit;
  $scope.tView;

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

  $scope.addperformance = function(){
    // console.log($('.hero-img-creator-dropdown option:selected').text());
    // console.log($('#showtime-city-state').val())
    var temp = $('#showtime-city-state').val().split(', ');
    var city = temp[0];
    var state = temp[1];

    var performance = JSON.stringify({
    "performance": {
      "owner_id": $('.hero-img-creator-dropdown option:selected').text(),
      "company_id": "1",
      "name": $('#performance-name').val(),
      "description": $('#perf-desc').val(),
      "trailer_link": $('#trailer-link').val(),
      "ticket_link": $('#ticket-link').val(),
      "show_times_attributes": [
     {
       "begin_time": $('#showtime-time').val(),
       "address": $('#showtime-address').val(),
       "city": city,
       "state": state,
       "zip_code": $('#showtime-zip').val(),
       "date": $('#showtime-date').val()
     }]
    },
    "user_info": {
      "login_token":  "butts"//response.user_info.login_token
    }

    });
    console.log(performance);


  }//End addperformance


});
