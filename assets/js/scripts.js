$(function () {
  'use strict';

  // $('.login-btn').on('click', function () {
  //   $('#log-in-modal').addClass('showing');
  // });
  //
  // $('.sign-up-btn').on('click', function () {
  //   $('#sign-up-modal').addClass('showing');
  // });

  // $('.modal-login-btn, .modal-sign-up-btn, .modal-facebook-btn').on('click', function () {
  //   $('.no-log-header').addClass('hidden');
  //   $('.logged-header').addClass('showing');
  //   $('#log-in-modal, #sign-up-modal').removeClass('showing');
  // });

  $('.logout-btn').on('click', function () {
    $('.no-log-header').removeClass('hidden');
    $('.logged-header').removeClass('showing');
  });



  $('.modal-wrapper').on('click', function () {
    $('#log-in-modal, #sign-up-modal').removeClass('showing');
  });

  $('.modal-box').click(function (e) {
    e.stopPropagation();
  });

});

var genrePull = function(name, container){
  var settings = {
   "async": true,
   "crossDomain": true,
   "url": "http://infinite-reef-76606.herokuapp.com/genres",
   "method": "GET",
   "headers": {
     "content-type": "application/json",
     "cache-control": "no-cache"
   },
   "processData": false,
    };

  var select = "";
  $.ajax(settings).done(function (response) {
    select = $('<select class="'+ name + '" id="' + name + '"></select>');
    $.each(response["genres"], function(){
      var option = $('<option></option>');
      option.attr('value', this["id"]);
      option.text(this["category"]);
      select.append(option);

    });
    container.append(select)
  });//end ajax call

}
