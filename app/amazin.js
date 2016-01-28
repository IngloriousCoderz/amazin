require('metro/build/css/metro.min.css!');
require('metro/build/css/metro-icons.min.css!');

var $ = require('jquery');
var metro = require('metro/build/js/metro.min.js');
var orders = require('./orders');

$(function() {
  $('#ordini').on('change', '#file-ordini', function(event) {
    orders.cacheOrdersFile(event.target.files[0]);
  });

  $('#ordini').on('click', 'button#elenco-vendite', function(event) {
    event.preventDefault();
    orders.createSalesList();
  });

  $('#ordini').on('click', 'button#conferma-spedizioni', function(event) {
    event.preventDefault();
    orders.createShippingConfirmation();
  });
});
