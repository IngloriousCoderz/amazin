var Papa = require('../bower_components/papaparse/papaparse.min');
var $ = jQuery = require('../bower_components/jquery/dist/jquery.min');
var metro = require('../bower_components/metro/build/js/metro.min');
var jsonFile = require('jsonfile');
var moment = require('moment');

var cachePath = 'cache/';

$(function() {
  'use strict';

  $('#ordini').on('change', '#file-ordini', function(event) {
    Papa.parse(event.target.files[0], {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,

      before: function(file, inputElem) {
        console.log(file, inputElem);
      },

      complete: function(results, file) {
        jsonFile.writeFile(cachePath + 'ordini_' + moment().format('YYYY-MM-DD') + '.json', results, function(err) {
          console.log(err);
        });
      },

      error: function(error, file, inputElem, reason) {
        console.err(error, file, inputElem, reason);
      }
    });
  });

  $('#ordini').on('click', 'button', function(event) {
    event.preventDefault();
  });
});
