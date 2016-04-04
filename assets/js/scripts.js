$(function () {
  'use strict';

  $('.login-btn').on('click', function () {
    $('#log-in-modal').addClass('showing');
  });

  $('.sign-up-btn').on('click', function () {
    $('#sign-up-modal').addClass('showing');
  });

  $('.modal-login-btn, .modal-sign-up-btn, .modal-facebook-btn').on('click', function () {
    $('.no-log-header').addClass('hidden');
    $('.logged-header').addClass('showing');
    $('#log-in-modal, #sign-up-modal').removeClass('showing');
  });

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
