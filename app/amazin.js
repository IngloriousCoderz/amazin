require('metro/build/css/metro.min.css!');
require('metro/build/css/metro-icons.min.css!');

var $ = require('jquery');
var metro = require('metro/build/js/metro.min.js');
var filesystem = require('./filesystem');
var orders = require('./orders');
var stock = require('./stock');

function showSupplierContent(supplier) {
  $('#stock .supplier').hide();
  $('#stock .supplier#' + supplier).show();
}

$(function() {
  $('#orders').on('change', 'input#file-orders', function(event) {
    var file = event.target.files[0];
    var name = 'orders';
    filesystem.cache(file, name);
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

    var $type = $('#stock .supplier#' + supplier + ' select#type');

    if (file.name.toLowerCase().indexOf('tutto') >= 0) {
      $type.val('all');
    } else if (file.name.toLowerCase().indexOf('dvd') >= 0 || file.name.toLowerCase().indexOf('home_video') >= 0) {
      $type.val('dvd');
    } else if (file.name.toLowerCase().indexOf('libri') >= 0) {
      $type.val('books');
    } else if (file.name.toLowerCase().indexOf('merchandising') >= 0) {
      $type.val('merchandising');
    } else if (file.name.toLowerCase().indexOf('musica') >= 0) {
      $type.val('music');
    } else if (file.name.toLowerCase().indexOf('br') >= 0) {
      $type.val('br');
    } else if (file.name.toLowerCase().indexOf('a&r') >= 0) {
      $type.val('ar');
    }
    var type = $type.val();

    filesystem.cache(file, supplier + '_' + type);
  });

  $('#stock').on('click', 'button#reset-previous', function(event) {
    event.preventDefault();
    var supplier = $('#stock select#supplier').val();
    var type = $('#stock .supplier#' + supplier + ' select#type').val();
    stock.resetPrevious(supplier, type);
  });

  $('#stock').on('click', '#new-stock button', function(event) {
    event.preventDefault();
    var supplier = $('#stock select#supplier').val();
    var type = $('#stock .supplier#' + supplier + ' select#type').val();
    var market = event.target.id;
    stock.createStock(supplier, type, market);
  });

  showSupplierContent($('#stock select#supplier').val());
});
