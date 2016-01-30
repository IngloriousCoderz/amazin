require('metro/build/css/metro.min.css!');
require('metro/build/css/metro-icons.min.css!');

var $ = require('jquery');
var metro = require('metro/build/js/metro.min.js');
var files = require('./files');
var orders = require('./orders');
var stock = require('./stock');

function showSupplierContent(supplier) {
  $('#stock .supplier').hide();
  $('#stock .supplier#' + supplier).show();
}

$(function() {
  $('#orders').on('change', 'input#file-orders', function(event) {
    var file = event.target.files[0];
    var name = 'ordini';
    files.readAndCache(file, name);
  });

  $('#orders').on('click', 'button#elenco-vendite', function(event) {
    event.preventDefault();
    orders.createSalesList();
  });

  $('#orders').on('click', 'button#conferma-spedizioni', function(event) {
    event.preventDefault();
    orders.createShippingConfirmation();
  });

  $('#stock').on('change', 'select#supplier', function(event) {
    showSupplierContent(event.target.value);
  });

  $('#stock').on('change', 'input#file-stock', function(event) {
    var file = event.target.files[0];
    var supplier = $('#stock select#supplier').val();
    var type = $('#stock select#type').val();
    files.readAndCache(file, supplier + '_' + type);
  });

  $('#stock').on('click', '#new-stock button', function(event) {
    event.preventDefault();
    var supplier = $('#stock select#supplier').val();
    var type = $('#stock select#type').val();
    var market = event.target.id;
    stock.createStock(supplier, type, market);
  });

  showSupplierContent($('#stock select#supplier').val());
});
