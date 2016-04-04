$(function () {
  'use strict';

  $('.login-btn').on('click', function () {
    $('#log-in-modal').addClass('showing');
  });

  $('.sign-up-btn').on('click', function () {
    $('#sign-up-modal').addClass('showing');
  });

  $('.modal-wrapper').on('click', function () {
    $('#log-in-modal, #sign-up-modal').removeClass('showing');
  });

  $('.modal-box').click(function (e) {
    e.stopPropagation();
  });

});
