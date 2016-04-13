TheSceneryapp.controller('companyCont', function($scope, $http, ourData){

  var person = JSON.parse(localStorage.getItem('user'));
  var token = person.user_info.login_token;
  var ownerID = person.user_info.id;
  var compID = JSON.parse(localStorage.getItem('perfID'));
  // var companyid = JSON.parse(localStorage.getItem('companyid'));
  // Populate the page with the first company in the database

  $scope.thisCompany;


  $http.get('http://infinite-reef-76606.herokuapp.com/companies/' + compID).then(function(data){
    $scope.thisCompany = ourData.shareData("company", data.data.company);
    $scope.thisCompany = ourData.borrowData("company");
    // console.log($scope.thisCompany);
    // console.log(data);
    console.log(data.data.company);
    $(".company-name").text(data.data.company.name);
    $(".company-location").text(data.data.company.address + " " + data.data.company.city + ", " + data.data.company.state + " " + data.data.company.zip_code);
    $(".media-youtube").parent().attr("href", data.data.company.youtube_link);
    $(".media-twitter").parent().attr("href", data.data.company.twitter_link);
    $(".media-facebook").parent().attr("href", data.data.company.facebook_link);
    $(".media-instagram").parent().attr("href", data.data.company.instagram_link);
    $(".company-description").text(data.data.company.description);

    // console.log(data.data.company.opportunities);

    for (var i=0; i<data.data.company.upcoming_performances.length; i++){
      $(".insert-upcoming-performance").append("<a href='#/performance'><div class='company-performance'><div class='company-performance-box'><div class='company-box-performance-name'>" + data.data.company.upcoming_performances[i].name + "</div><div class='company-box-company-name'>" + data.data.company.name + "</div></div></div></a>");
    }

    for (var i=0; i<data.data.company.past_performances.length; i++){
      $(".insert-past-performance").append("<a href='#/performance'><div class='company-performance'><div class='company-performance-box'><div class='company-box-performance-name'>" + data.data.company.past_performances[i].name + "</div><div class='company-box-company-name'>" + data.data.company.name + "</div></div></div></a>");
    }

    for (var i=0; i<data.data.company.opportunities.length; i++){
      $(".insert-company-opportunity").append("<div class='company-opportunity'><div class='company-opportunity-poster-image-wrapper'><img src=''></div><div class='company-ndt-wrapper'><div class='company-opportunity-poster-name'>" + data.data.company.opportunities[i].contact_info + "</div><div class='company-opportunity-date-posted'>" + data.data.company.opportunities[i].created_at + "</div><div class='company-opportunity-title'>" + data.data.company.opportunities[i].name + "</div></div><div class='company-opportunity-description'>" + data.data.company.opportunities[i].description + "</div></div>")
    }

    localStorage.setItem("companyid", JSON.stringify(data.data.company.id));
    ourData.shareData("company", data.data.company);
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
      "url": "http://infinite-reef-76606.herokuapp.com/companies",
      "method": "POST",
      "headers": {
        "content-type": "application/json",
        "cache-control": "no-cache"
      },
      "processData": false,
      "data": createCompany
    };

    $.ajax(settings).done(function (data) {
      console.log("Company Created");
      console.log(data);
    });//end ajax.
  }//End Create Company

  $scope.savecompany = function(){

    var companyid = JSON.parse(localStorage.getItem('companyid'));

    var editcompany = JSON.stringify({
      "company": {
        "id": companyid,
        "user_id": ownerID,
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
        "url": "http://infinite-reef-76606.herokuapp.com/companies/" + companyid,
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
      "url": "http://infinite-reef-76606.herokuapp.com/opportunities",
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

  //Submit reviews for a company

  $scope.submitreview = function(){

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
      "url": "http://infinite-reef-76606.herokuapp.com/reviews",
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
      });//end ajax.

  }

});
