var Papa = require('papaparse');
var jsonFile = require('jsonfile');
var filesaver = require('filesaver.js');
var files = require('./files');

var TITLE_BLACKLIST = [
  'ASSORTIMENTO',
  'ASSORTITI',
  'VARI',
  'ASSORTITO',
  'ASS.'
];
var MARKUP = 1.25;

module.exports = {
  createStock: function(data, type, market) {
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
      var barcode = item['Cod. barre'];
      var quantity = item['Q.ta in stock'];
      var price = item['Pvc'];
      var title = item['Titolo'];

      var blacklisted = false;
      TITLE_BLACKLIST.forEach(function(stopword, index) {
        if (title.toLowerCase().indexOf(stopword.toLowerCase()) >= 0) {
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

      if (type === 'merchandising') {
        if (quantity < 3) return;
        else quantity = 1;
      }

      var sku = barcode + '_TERMINAL' + (type === 'dvd' ? '_DVD' : '') + 'OK';
      var productIdType = 4;

      price = price.replace(',', '.');
      price = price.replace(/[^\d\.]/g, '') * MARKUP;
      price = price.toFixed(2);
      if (market !== 'uk') {
        price = price.replace('.', ',');
      }

      var minimumSellerAllowedPrice = '';
      var maximumSellerAllowedPrice = '';
      var itemCondition = 11;
      var addDelete = 'a';
      var itemNote = 'Nuovo, originale e sigillato';
      if (market === 'fr') {
        itemNote = 'Neuf';
      } else if (market !== 'it') {
        itemNote = '';
      }

      var expeditedShipping = 'N';
      if (market === 'it') {
        expeditedShipping = 23;
      }

      var willShipInternationally = 26;
      if (market === 'uk') {
        willShipInternationally = 6;
      } else if (market === 'fr') {
        willShipInternationally = 19;
      } else if (market === 'de') {
        willShipInternationally = 10;
      } else if (market === 'es') {
        willShipInternationally = 30;
      }

      var fulfillmentCenterId = '';

      stock.push([
        sku,
        barcode,
        productIdType,
        price,
        minimumSellerAllowedPrice,
        maximumSellerAllowedPrice,
        itemCondition,
        quantity,
        addDelete,
        itemNote,
        expeditedShipping,
        willShipInternationally,
        fulfillmentCenterId
      ]);
    });

    return stock;
  },

  resetStock: function(data, type) {
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
      var barcode = item['Cod. barre'];
      var title = item['Titolo'];

      var blacklisted = false;
      TITLE_BLACKLIST.forEach(function(stopword, index) {
        if (title.toLowerCase().indexOf(stopword.toLowerCase()) >= 0) {
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

      var sku = barcode + '_TERMINAL' + (type === 'dvd' ? '_DVD' : '') + 'OK';

      stock.push([
        sku,
        '',
        '',
        '',
        '',
        '',
        '',
        0,
        '',
        '',
        '',
        '',
        ''
      ]);
    });

    return stock;
  }
};
