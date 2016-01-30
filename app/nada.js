var Papa = require('papaparse');
var jsonFile = require('jsonfile');
var filesaver = require('filesaver.js');
var files = require('./files');

var BARCODE_BLACKLIST = [
  'rental',
  'EX RENTAL'
];
var MARKUP = 2;

module.exports = {
  createStock: function(data, type) {
    var stock = [];
    stock.push([
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
    ]);

    data.forEach(function(item, index) {
      var barcode = item['barcode'];
      var quantity = item['q.tà disp.'] || item['q,tà disp.'];
      var price = item[' prezzo '];

      var blacklisted = false;
      BARCODE_BLACKLIST.forEach(function(stopword, index) {
        if (barcode.toLowerCase().indexOf(stopword.toLowerCase()) >= 0) {
          blacklisted = true;
          return;
        }
      });
      if (blacklisted) return;

      var barcodes = /\d+/.exec(barcode);
      if (barcodes === null) return;
      barcode = barcodes[0];
      if (barcode === undefined) return;
      for (i = barcode.length; i < 13; i++) {
        barcode = '0' + barcode;
      }

      if (isNaN(quantity) || quantity <= 0) return;
      if (quantity >= 1 && quantity <= 5) quantity = 1;
      else if (quantity >= 6 && quantity <= 10) quantity = 2;
      else if (quantity >= 11 && quantity <= 20) quantity = 3;
      else if (quantity > 20) quantity = 5;

      price = price.replace(/[^\d\.]/g, '') * MARKUP;

      stock.push([
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

    return stock;
  }
};
