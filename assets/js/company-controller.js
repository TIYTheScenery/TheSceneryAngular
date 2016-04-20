TheSceneryapp.controller('companyCont', function($scope, $http, ourData, $window){

  var person = JSON.parse(localStorage.getItem('user'));
  if (localStorage.user != undefined){
    var token = person.user_info.login_token;
    var ownerID = person.user_info.id;
    $scope.person = person;
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
  $scope.comapny_website_link;

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
    localStorage.setItem("perfID", $(this)[0].id);
    localStorage.setItem("compID", $scope.thisCompany.id);
    ourData.shareData("tAdd", true);
    ourData.shareData("tEdit", true);
    ourData.shareData("tView", false);
    location.href = "/#/performance";
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
    $scope.fillCompany(data.data.company)

    if($(".media-youtube").parent().attr("href") === ""){
      $(".media-youtube").css("display", "none");
    }
    if($(".media-facebook").parent().attr("href") === ""){
      $(".media-facebook").css("display", "none");
    }
    if($(".media-instagram").parent().attr("href") === ""){
      $(".media-instagram").css("display", "none");
    }
    if($(".media-twitter").parent().attr("href") === ""){
      $(".media-twitter").css("display", "none");
    }
  });

  $scope.goMakeAPerformance = function(){
    //this sets the view going into the perfAVED page.
    ourData.shareData("tAdd", false);
    ourData.shareData("tView", true);
    ourData.shareData("tEdit", true);
  }

  // Set edit variables to current variables
  $scope.editcompany = function(){
    $(".edit-company-name").val($scope.thisCompany.name);
    $(".edit-company-location-address").val($scope.thisCompany.address);
    $(".edit-company-location-city").val($scope.thisCompany.city);
    $(".edit-company-location-state").prop("selectedIndex", 1);
    $(".edit-company-location-zip").val($scope.thisCompany.zip_code);

    $(".edit-company-url").val($scope.thisCompany.website_link);
    $(".edit-company-youtube").val($scope.thisCompany.youtube_link);
    $(".edit-company-twitter").val($scope.thisCompany.twitter_link);
    $(".edit-company-facebook").val($scope.thisCompany.facebook_link);
    $(".edit-company-instagram").val($scope.thisCompany.instagram_link);
    $(".edit-company-description").val($scope.thisCompany.description);
  }

  $scope.createcompany = function(){
    var createCompanyFD = new FormData();
    createCompanyFD.append('company[user_id]', ownerID);
    createCompanyFD.append('company[name]', $(".create-company-name").val());
    createCompanyFD.append('company[profile_image]', $scope.profileImageUploadCreate);
    createCompanyFD.append('company[hero_image]', $scope.heroImageUploadCreate);
    createCompanyFD.append('company[description]', $(".create-company-description").val());
    createCompanyFD.append('company[website_link]', $(".create-company-url").val());
    createCompanyFD.append('company[facebook_link]', $(".create-company-facebook").val());
    createCompanyFD.append('company[twitter_link]', $(".create-company-twitter").val());
    createCompanyFD.append('company[instagram_link]', $(".create-company-instagram").val());
    createCompanyFD.append('company[youtube_link]', $(".create-company-youtube").val());
    createCompanyFD.append('company[address]', $(".create-company-location-address").val());
    createCompanyFD.append('company[city]', $(".create-company-location-city").val());
    createCompanyFD.append('company[state]', $(".create-company-location-state option:selected").text());
    createCompanyFD.append('company[zip_code]', $(".create-company-location-zip").val());
    createCompanyFD.append('user_info[login_token]', token);

    var uploadUrl = "https://api.the-scenery.com/companies"
    $http({
        method: "POST",
        url: uploadUrl,
        data: createCompanyFD,
        headers: {'Content-Type': undefined}
      }).then(function successCallback(response){
        console.log("Created Company");
        console.log(response);
        localStorage.setItem('compID', JSON.stringify(response.company.id));
        $scope.thisCompany = response.company;
        ourData.shareData("companyCreate", false);
        location.reload();
      }, function errorCallback(response){
        console.log('Company not created', response);
        var errorText = "";
        for(var i = 0; i < response.errors.length; i++){
          errorText += response.errors[i] + "\n";
        }
        alert(errorText);
    });
  }//End Create Company


  $scope.savecompany = function(){
    var createCompanyFD = new FormData();
    createCompanyFD.append('company[id]', $scope.thisCompany.id);
    createCompanyFD.append('company[user_id]', ownerID);
    createCompanyFD.append('company[name]', $(".edit-company-name").val());
    if($scope.profileImageUploadEdit != null){
      createCompanyFD.append('company[profile_image]', $scope.profileImageUploadEdit);
    }
    if($scope.heroImageUploadEdit != null){
      createCompanyFD.append('company[hero_image]', $scope.heroImageUploadEdit);
    }
    createCompanyFD.append('company[description]', $(".edit-company-description").val());
    createCompanyFD.append('company[website_link]', $(".edit-company-url").val());
    createCompanyFD.append('company[facebook_link]', $(".edit-company-facebook").val());
    createCompanyFD.append('company[twitter_link]', $(".edit-company-twitter").val());
    createCompanyFD.append('company[instagram_link]', $(".edit-company-instagram").val());
    createCompanyFD.append('company[youtube_link]', $(".edit-company-youtube").val());
    createCompanyFD.append('company[address]', $(".edit-company-location-address").val());
    createCompanyFD.append('company[city]', $(".edit-company-location-city").val());
    createCompanyFD.append('company[state]', $(".edit-company-location-state option:selected").text());
    createCompanyFD.append('company[zip_code]', $(".edit-company-location-zip").val());
    createCompanyFD.append('user_info[login_token]', token);

    var uploadUrl = "https://api.the-scenery.com/companies/"+$scope.thisCompany.id;
    $http({
      method: "PATCH",
      url: uploadUrl,
      data: createCompanyFD,
      headers: {'Content-Type': undefined}
    }).then(function successCallback(response){
      console.log("Updated company");
      console.log(response);
      localStorage.setItem('compID', JSON.stringify(response.data.company.id));
      $scope.thisCompany = response.data.company;
      ourData.shareData("companyCreate", false);
      location.reload();
    }, function errorCallback(response){
      console.log('company not updated', response);
      var errorText = "";
      for(var i = 0; i < response.errors.length; i++){
        errorText += response.errors[i] + "\n";
      }
      alert(errorText);
    })
    $scope.fillCompany($scope.thisCompany);
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
      if(data.success){
        $(".company-create-opportunity-modal-wrapper").addClass("hidden");
        $window.location.reload();
      }else{
        var errorText = "";
        for(var i = 0; i < data.errors.length; i++){
          errorText += data.errors[i] + "\n";
        }
        alert(errorText);
      }
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
      var compID = $scope.thisCompany.id
      var user_info = JSON.stringify({
        "user_info": {
          "login_token": token
        }
      });

      var settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://infinite-reef-76606.herokuapp.com/companies/"+compID,
        "method": "DELETE",
        "headers": {
          "content-type": "application/json",
          "cache-control": "no-cache",
          "postman-token": "d563f488-7d24-e0be-a811-1b2222d956b5"
        },
        "processData": false,
        "data": user_info
      }

      $.ajax(settings).done(function (response) {
        console.log(response);
        $window.location.href = "#/userprofile";
      });
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
    var youtube_link = company.youtube_link
    if (youtube_link != null && youtube_link != ""){
      if (youtube_link.match(/\/\//)){
        $(".media-youtube").parent().attr("href", company.youtube_link);
      } else {
        $(".media-youtube").parent().attr("href", "//" + company.youtube_link);
      }
    }
    var twitter_link = company.twitter_link
    if (twitter_link != null && twitter_link != ""){
      if (twitter_link.match(/\/\//)){
        $(".media-twitter").parent().attr("href", company.twitter_link);
      } else {
        $(".media-twitter").parent().attr("href", "//" + company.twitter_link);
      }
    }
    var facebook_link = company.facebook_link
    if (facebook_link != null && facebook_link != ""){
      if (facebook_link.match(/\/\//)){
        $(".media-facebook").parent().attr("href", company.facebook_link);
      } else {
        $(".media-facebook").parent().attr("href", "//" + company.facebook_link);
      }
    }
    var instagram_link = company.instagram_link
    if (instagram_link != null && instagram_link != ""){
      if (instagram_link.match(/\/\//)){
        $(".media-instagram").parent().attr("href", company.instagram_link);
      } else {
        $(".media-instagram").parent().attr("href", "//" + company.instagram_link);
      }
    }
    if (instagram_link != null && instagram_link != ""){
      if (instagram_link.match(/\/\//)){
        $(".media-instagram").parent().attr("href", company.instagram_link);
      } else {
        $(".media-instagram").parent().attr("href", "//" + company.instagram_link);
      }
    }
    $scope.comapny_website_link = company.website_link
    if ($scope.comapny_website_link != null && $scope.comapny_website_link != ""){
      if ($scope.comapny_website_link.match(/\/\//) === true){
        $scope.comapny_website_link = $scope.comapny_website_link
      } else {
        $scope.comapny_website_link = "//" + $scope.comapny_website_link
      }
    }
    $(".company-description").append(company.description);

    // console.log(company.opportunities);

    for (var i=0; i<company.upcoming_performances.length; i++){
      $(".insert-upcoming-performance").append("<div class='company-performance' id='" + company.upcoming_performances[i].id + "'><div class='company-performance-box'><img src='"+ company.upcoming_performances[i].hero_image_url+"' class='performance-image'><div class='company-box-performance-name'><h4>" + company.upcoming_performances[i].name + "</h4></div><div class='company-box-company-name'>" + company.name + "</div></div></div>");
    }

    for (var i=0; i<company.past_performances.length; i++){
      $(".insert-past-performance").append("<div class='company-performance' id='" + company.past_performances[i].id + "''><div class='company-performance-box'><img src='"+ company.past_performances[i].hero_image_url+"' class='performance-image'><div class='company-box-performance-name'><h4>" + company.past_performances[i].name + "</h4></div><div class='company-box-company-name'>" + company.name + "</div></div></div>");
    }

    for (var i=0; i<company.opportunities.length; i++){
      $(".insert-company-opportunity").append("<div class='company-opportunity'><div class='company-opportunity-poster-image-wrapper'><img src=''></div><div class='company-ndt-wrapper'><div class='company-opportunity-poster-name'>" + company.opportunities[i].contact_info + "</div><div class='company-opportunity-date-posted'>" + company.opportunities[i].created_at + "</div><div class='company-opportunity-title'>" + company.opportunities[i].name + "</div></div><div class='company-opportunity-description'>" + company.opportunities[i].description + "</div></div>")
    }

    localStorage.setItem("companyid", JSON.stringify(company.id));
    ourData.shareData("company", company);
  }

  $scope.setPerformance = function(performaceID){
    localStorage.setItem("perfID", performaceID);
  }

  $scope.tocompanyreviewer = function(){
    // console.log($(this)[0].review.user_id);
    localStorage.setItem("profID", $(this)[0].review.user_id);
  }

  $scope.revTab = false;
  $scope.perfTab = true;
  $scope.oppsTab = false;

  $scope.setTabs = function(whichTab){
    console.log("setting the tabs");
    if(whichTab === 'REV')
    {
      console.log("setting REV");
      $scope.revTab = true;
      $scope.perfTab = false;
      $scope.oppsTab = false;
      $(".R").addClass("TabSelected");
      $(".P").removeClass("TabSelected");
      $(".O").removeClass("TabSelected");
    }
    else if(whichTab === 'OPPS')
    {
      console.log("setting OPPS");
      $scope.revTab = false;
      $scope.perfTab = false;
      $scope.oppsTab = true;
      $(".R").removeClass("TabSelected");
      $(".P").removeClass("TabSelected");
      $(".O").addClass("TabSelected");
    }
    else if(whichTab === 'PERF')
    {
      console.log("setting PERF");
      $scope.revTab = false;
      $scope.perfTab = true;
      $scope.oppsTab = false;
      $(".R").removeClass("TabSelected");
      $(".P").addClass("TabSelected");
      $(".O").removeClass("TabSelected");
    }
  }//end setTabs
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
})
.directive('heroImageEdit', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.heroImageEdit);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
})
.directive('profileImageCreate', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.profileImageCreate);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
})
.directive('heroImageCreate', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.heroImageCreate);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
});;
