$(function() {
  'use strict';

  $('#ordini').on('change', '#file-ordini', function(event) {
    event.preventDefault();
    console.log(event);
  });

  $('#ordini').on('click', 'button', function(event) {
    event.preventDefault();
  });
});
