TheSceneryapp.controller('companyCont', function($scope, $http, ourData){

  var person = JSON.parse(localStorage.getItem('user'));
  if (localStorage.user != undefined){
    var token = person.user_info.login_token;
    var ownerID = person.user_info.id;
  }
  if (localStorage.user === undefined){
    $(".action-buttons").css("display", "none");
  }
  var compID = JSON.parse(localStorage.getItem('compID'));
  // var companyid = JSON.parse(localStorage.getItem('companyid'));
  // Populate the page with the first company in the database

  //these variables are used in the html with ng-show to determine which version of the page is shown to the user
  //show is for viewing a company
  //edit is for editing one
  //and create is for creating one.
  $scope.show;
  $scope.create;
  $scope.edit;

  $scope.companyCr = ourData.borrowData("companyCreate");
  if ($scope.companyCr === undefined)
  {
    $scope.companyCr = false;
  }
  console.log($scope.companyCr);

  $scope.toggle = function(turnOn)
  {
    if(turnOn === "CREATE")
    {
      $scope.show = false;
      $scope.edit = false;
      $scope.create = true;
    }
    else if(turnOn === "EDIT")
    {
      $scope.show = false;
      $scope.edit = true;
      $scope.create = false;
    }
    else
    {
      $scope.show = true;
      $scope.edit = false;
      $scope.create = false;
    }
  }//end toggle

  if($scope.companyCr)
  {
    $scope.toggle("CREATE");
  } else {
    $scope.toggle("SHOW");
  }
  //show technically dosent do anything, but the else in toggle makes it show.


  $scope.thisCompany;
  // This makes clicking a performance navigate to the right page
  $("body").on("click", ".company-performance", function(){
    console.log($(this)[0].id);
    localStorage.setItem("perfID", JSON.stringify($(this)[0].id));
  });

  $http.get('https://api.the-scenery.com/companies/' + compID).then(function(data){
    if(data.data.company.user_id != ownerID){
      $(".action-buttons").css("display", "none");
    }
    $scope.thisCompany = ourData.shareData("company", data.data.company);
    $scope.thisCompany = ourData.borrowData("company");
    // console.log($scope.thisCompany);
    // console.log(data);
    console.log(data.data.company);
    $scope.fillCompany(data)

    if($(".media-youtube").parent().attr("href") === "//"){
      $(".media-youtube").css("display", "none");
    }
    if($(".media-facebook").parent().attr("href") === "//"){
      $(".media-facebook").css("display", "none");
    }
    if($(".media-instagram").parent().attr("href") === "//"){
      $(".media-instagram").css("display", "none");
    }
    if($(".media-twitter").parent().attr("href") === "//"){
      $(".media-twitter").css("display", "none");
    }
    // $scope.fillCompany($scope.thisCompany)
  });


  $("#filebtn1").on("click", function(){
    console.log("i clicked file button 1");
  });


  $scope.goMakeAPerformance = function(){
    //this sets the view going into the perfAVED page.
    ourData.shareData("tAdd", false);
    ourData.shareData("tView", true);
    ourData.shareData("tEdit", true);
  }


  // Set edit variables to current variables

  $scope.editcompany = function(){
    $(".edit-company-name").val($(".company-name").text());
    $(".edit-company-location").val($(".company-location").text());
    $(".edit-company-url").val($(".company-url").parent().attr("href"));
    $(".edit-company-youtube").val($(".media-youtube").parent().attr("href"));
    $(".edit-company-twitter").val($(".media-twitter").parent().attr("href"));
    $(".edit-company-facebook").val($(".media-facebook").parent().attr("href"));
    $(".edit-company-instagram").val($(".media-instagram").parent().attr("href"));
    $(".edit-company-description").val($(".company-description").text());
  }

  // Set view variables to new edited variables.

  $scope.createcompany = function(){

    //THIS CODE MAKES THE IMAGE UPLOAD FOR TWO FILES WORK...KINDA.
    var thing = jQuery.Event( "submit" );
    if($("#fileBtn2Add").val() === "")//if there isnt a value in the file upload for the splash image
    {
      console.log("no company splash added, dont send to amazon...");
      //then check to see if there is a file to upload for the profile image
      if($("#fileBtn1Add").val() === "")//if there isnt a value in the profile upload button1
      {console.log("no company profile added, dont send to amazon...");}
      else//there IS a file that the user wants to upload... so click our hidden submit button.
      {
        console.log("we have a profile img! Upload beggining!");
        $("#imgSubmitBtn1Add").trigger("click");//send profile image to AWS
      }
    }
    else//there IS a splash image that the user wants to upload...
    {
      //first we check to upload a possible profile image
      if($("#fileBtn1Add").val() === "")//if there isnt a value in the profile upload button1
      {console.log("no company profile added, dont send to amazon...");}
      else//there IS a file that the user wants to upload... so click our hidden submit button.
      {
        console.log("we have a profile img! Upload beggining!");
        $("#imgSubmitBtn1Add").trigger("click");
      }
      setTimeout(function(){
        //then we finally upload the splash, and get redirected back to the company page.
        console.log("we have a splash img! Upload beggining!");
        $("#imgSubmitBtn2").trigger("click");
      }, 50);

    }

    var createCompany = JSON.stringify({
    "company": {
      "id": "",
      "user_id": ownerID,
      "name": $(".create-company-name").val(),
      "description": $(".create-company-description").val(),
      "website_link": $(".create-company-url").val(),
      "facebook_link": $(".create-company-facebook").val(),
      "twitter_link": $(".create-company-twitter").val(),
      "instagram_link": $(".create-company-instagram").val(),
      "youtube_link": $(".create-company-youtube").val(),
      "address": $(".create-company-location-address").val(),
      "city": $(".create-company-location-city").val(),
      "state": $(".create-company-location-state option:selected").text(),
      "zip_code": $(".create-company-location-zip").val()
    },
    "user_info": {
      "login_token": token
    }
    });
    console.log(createCompany);

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://api.the-scenery.com/companies",
      "method": "POST",
      "headers": {
        "content-type": "application/json",
        "cache-control": "no-cache"
      },
      "processData": false,
      "data": createCompany
    };

    $.ajax(settings).done(function (data) {
      console.log(data);
      console.log("setting new compID");
      console.log(JSON.stringify(data.company.id));
      localStorage.setItem('compID', JSON.stringify(data.company.id));
      $scope.thisCompany = data.company;
      $scope.fillCompany($scope.thisCompany);
      $scope.toggle("SHOW");
    });//end ajax.
  }//End Create Company


  $scope.savecompany = function(){

  //THIS CODE MAKES THE IMAGE UPLOAD FOR TWO FILES WORK...KINDA.
  var thing = jQuery.Event( "submit" );
  if($("#fileBtn2").val() === "")//if there isnt a value in the file upload for the splash image
  {
    console.log("no company splash added, dont send to amazon...");
    //then check to see if there is a file to upload for the profile image
    if($("#fileBtn1").val() === "")//if there isnt a value in the profile upload button1
    {console.log("no company profile added, dont send to amazon...");}
    else//there IS a file that the user wants to upload... so click our hidden submit button.
    {
      console.log("we have a profile img! Upload beggining!");
      $("#imgSubmitBtn1").trigger("click");//send profile image to AWS
    }
  }
  else//there IS a splash image that the user wants to upload...
  {
    //first we check to upload a possible profile image
    if($("#fileBtn1").val() === "")//if there isnt a value in the profile upload button1
    {console.log("no company profile added, dont send to amazon...");}
    else//there IS a file that the user wants to upload... so click our hidden submit button.
    {
      console.log("we have a profile img! Upload beggining!");
      $("#imgSubmitBtn1").trigger("click");
    }
    setTimeout(function(){
      //then we finally upload the splash, and get redirected back to the company page.
      console.log("we have a splash img! Upload beggining!");
      $("#imgSubmitBtn2").trigger("click");
    }, 50);

  }

    var companyid = JSON.parse(localStorage.getItem('companyid'));

    var editcompany = JSON.stringify({
      "company": {
        "id": companyid,
        "user_id": ownerID,
        "profile_img_url": "https://s3.amazonaws.com/thescenery/uploads/Company"+$scope.thisCompany.id,
        "hero_img_url": "https://s3.amazonaws.com/thescenery/uploads/CompanyHero"+$scope.thisCompany.id,
        "name": $(".edit-company-name").val(),
        "description": $(".edit-company-description").val(),
        "website_link": $(".edit-company-url").val(),
        "facebook_link": $(".edit-company-facebook").val(),
        "twitter_link": $(".edit-company-twitter").val(),
        "instagram_link": $(".edit-company-instagram").val(),
        "youtube_link": $(".edit-company-youtube").val(),
        "address": $(".edit-company-location-address").val(),
        "city": $(".edit-company-location-city").val(),
        "state": $(".edit-company-location-state option:selected").text(),
        "zip_code": $(".edit-company-location-zip").val()
      },
      "user_info": {
        "login_token": token
      }
    });

    // AJAX CALL
      var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://api.the-scenery.com/companies/" + companyid,
        "method": "PATCH",
        "headers": {
          "content-type": "application/json",
          "cache-control": "no-cache"
        },
        "processData": false,
        "data": editcompany
         };

        $.ajax(settings).done(function (data) {
          console.log("Updated Company");
          console.log(data);
        });//end ajax.

        $(".company-name").text($(".edit-company-name").val());
        $(".edit-company-name").val("");
        $(".company-location").text($(".edit-company-location").val());
        $(".edit-company-location").val("");
        $(".company-url").parent().attr("href", ($(".edit-company-url").val()));
        $(".edit-company-url").val("");
        $(".media-youtube").parent().attr("href", $(".edit-company-youtube").val());
        $(".edit-company-youtube").val("");
        $(".media-twitter").parent().attr("href", $(".edit-company-twitter").val());
        $(".edit-company-twitter").val("");
        $(".media-facebook").parent().attr("href", $(".edit-company-facebook").val());
        $(".edit-company-facebook").val("");
        $(".media-instagram").parent().attr("href", $(".edit-company-instagram").val());
        $(".edit-company-instagram").val("");
        $(".company-description").text($(".edit-company-description").val());
        $(".edit-company-description").val("");

  }//End Save Company

  $scope.saveopportunity = function(){

    var companyid = JSON.parse(localStorage.getItem('companyid'));

    var opportunity = JSON.stringify({
      "opportunity": {
        "name": $(".opportunity-title-input").val(),
        "description": $(".opportunity-description-input").val(),
        "contact_info": $(".opportunity-contact-info-input").val(),
        "company_id": companyid,
        "venue_id": ""
      },
      "user_info": {
        "login_token": token
      }
    });

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://api.the-scenery.com/opportunities",
      "method": "POST",
      "headers": {
        "content-type": "application/json",
        "cache-control": "no-cache"
      },
      "processData": false,
      "data": opportunity
    };
    // AJAX CALL
    $.ajax(settings).done(function (data) {
      console.log("Opportunity");
      console.log(data);
      $(".company-create-opportunity-modal-wrapper").addClass("hidden");
    });
  }

  $(".create-opportunity-btn").on("click", function(){
    $(".company-create-opportunity-modal-wrapper").removeClass("hidden");
  })

  // Close opportunity modal if the wrapper is clicked.

  $(".opportunity-cancel-btn").on("click", function(){
      $(".company-create-opportunity-modal-wrapper").addClass("hidden");
  })

  $scope.deleteComp = function(){
    if(confirm("Are you sure you want to delete this company?"))
    {
      console.log("this company's ID")
      console.log($scope.thisCompany.id);

      var settings = {
       "async": true,
       "crossDomain": true,
       "url": "http://infinite-reef-76606.herokuapp.com/companies/"+$scope.thisCompany.id,
       "method": "DELETE",
       "headers": {
         "content-type": "application/json",
         "cache-control": "no-cache",
         "postman-token": "d563f488-7d24-e0be-a811-1b2222d956b5"
       },
       "processData": false,
       "data": JSON.stringify({"user_info": {"login_token": token} })
      }

      $.ajax(settings).done(function (response) {
       console.log(response);
      });


      //ANGULAR! CALL
      // var authStuff = JSON.stringify({"user_info": {
      //     "login_token": token
      //           }
      //         });
      //
      //    $http.delete('http://api.the-scenery.com/companies/' + compID, authStuff).then(function(data){
      //     console.log("delete Data");
      //     console.log(data);
      //    });

    }//end confirm.

  }


  //Submit reviews for a company

  $scope.submitreview = function(){

    if (localStorage.user === undefined){
      alert("Please log in if you wish to submit a review");
      $(".company-new-review").val("");
    }

    var reviewtext = $(".company-new-review").val();
    var user = JSON.parse(localStorage.getItem('user'));
    var currentcomp = ourData.borrowData("company");
    // console.log(user.user_info);
    // console.log(currentcomp);

    var review = JSON.stringify({
        "id": "",
        "opinion": reviewtext,
        "rating": null,
        "user_id": user.user_info.id,
        "reviewee_id": currentcomp.id,
        "reviewee_type": "Company",
        "display_name": user.user_info.display_name,
        "user_info": {
          "login_token": user.user_info.login_token
        }
    });  //End Review
    // console.log(review);

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
      $(".company-new-review").val("");
      location.reload();
      });//end ajax.

  }

  $scope.fillCompany = function(company){
    $(".company-name").text(company.name);
    $(".company-location").text(company.address + " " + company.city + ", " + company.state + " " + company.zip_code);
    if (company.youtube_link.match(/\/\//)) {
      $(".media-youtube").parent().attr("href", company.youtube_link);
    }else{
      $(".media-youtube").parent().attr("href", "//" + company.youtube_link);
    }
    if (company.twitter_link.match(/\/\//)) {
      $(".media-twitter").parent().attr("href", company.twitter_link);
    }else{
      $(".media-twitter").parent().attr("href", "//" + company.twitter_link);
    }
    if (company.facebook_link.match(/\/\//)) {
      $(".media-facebook").parent().attr("href", company.facebook_link);
    }else{
      $(".media-facebook").parent().attr("href", "//" + company.facebook_link);
    }
    if (company.instagram_link.match(/\/\//)) {
      $(".media-instagram").parent().attr("href", company.instagram_link);
    }else{
      $(".media-instagram").parent().attr("href", "//" + company.instagram_link);
    }
    $(".company-description").text(company.description);

    // console.log(company.opportunities);

    for (var i=0; i<company.upcoming_performances.length; i++){
      $(".insert-upcoming-performance").append("<a href='#/performance'><div class='company-performance' id='" + company.upcoming_performances[i].id + "''><div class='company-performance-box'><div class='company-box-performance-name'>" + company.upcoming_performances[i].name + "</div><div class='company-box-company-name'>" + company.name + "</div></div></div></a>");
    }

    for (var i=0; i<company.past_performances.length; i++){
      $(".insert-past-performance").append("<a href='#/performance'><div class='company-performance' id='" + company.past_performances.id + "''><div class='company-performance-box'><div class='company-box-performance-name'>" + company.past_performances[i].name + "</div><div class='company-box-company-name'>" + company.name + "</div></div></div>");
    }

    for (var i=0; i<company.opportunities.length; i++){
      $(".insert-company-opportunity").append("<div class='company-opportunity'><div class='company-opportunity-poster-image-wrapper'><img src=''></div><div class='company-ndt-wrapper'><div class='company-opportunity-poster-name'>" + company.opportunities[i].contact_info + "</div><div class='company-opportunity-date-posted'>" + company.opportunities[i].created_at + "</div><div class='company-opportunity-title'>" + company.opportunities[i].name + "</div></div><div class='company-opportunity-description'>" + company.opportunities[i].description + "</div></div>")
    }

    localStorage.setItem("companyid", JSON.stringify(company.id));
    ourData.shareData("company", company);
  }
  console.log("$scope.show");
  console.log($scope.show);

  console.log("scope.create");
  console.log($scope.create);

});
