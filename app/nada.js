var Papa = require('papaparse');
var jsonFile = require('jsonfile');
var filesaver = require('filesaver.js');
var files = require('./files');

var BARCODE_BLACKLIST = [
  'EX RENTAL'
];
var MARKUP = 2;

module.exports = {
  createInventory: function(data, type) {
    var inventory = [
      'sku',
      'product-id',
      'product-id-type',
      'price',
      'minimum-seller-allowed-price',
      'maximum-seller-allowed-price',
      'item-condition',
      'quantity',
      'add-delete',
      'item-note',
      'expedited-shipping',
      'will-ship-internationally',
      'fulfillment-center-id'
    ];

    data.forEach(function(item, index) {
      var barcode = data['barcode'];
      var quantity = data['q.tà disp.'];
      var price = data[' prezzo '];

      var blacklisted = false;
      BARCODE_BLACKLIST.forEach(function(stopword, index) {
        if (barcode.indexOf(stopword) >= 0) {
          blacklisted = true;
          return;
        }
      });
      if (blacklisted) return;

      barcode = barcode.split(' ')[0];
      barcode = barcode.replace(/[^\d]/g, '');

      if (quantity <= 0) return;
      if (quantity >= 1 && quantity <= 5) quantity = 1;
      else if (quantity >= 6 && quantity <= 10) quantity = 2;
      else if (quantity >= 11 && quantity <= 20) quantity = 3;
      else if (quantity > 20) quantity = 5;

      price = parseInt(price.replace(/[^\d]g/, '')) * MARKUP;

      inventory.push([
        barcode + '_NADA' + (type === 'dvd' ? 'OK' : ''),
        barcode,
        4,
        price,
        '',
        '',
        11,
        quantity,
        'a',
        'Nuovo, originale e sigillato',
        23,
        26,
        ''
      ]);
    });

    return inventory;
  }
};
