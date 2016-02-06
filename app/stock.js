var Papa = require('papaparse');
var jsonFile = require('jsonfile');

var filesystem = require('./filesystem');
var nada = require('./suppliers/nada');
var terminal = require('./suppliers/terminal');

var suppliers = {
  nada: nada,
  terminal: terminal
};

function createStock(supplier, type, data, market) {
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
    if (supplier.isBlacklisted(item)) return;

    var fields = supplier.getFields(item);
    var barcode = fields.barcode;
    var quantity = fields.quantity;
    var price = fields.price;

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

    var sku = supplier.getSku(barcode, type);
    var productIdType = 4;

    price = price.replace(',', '.');
    price = price.replace(/[^\d\.]/g, '') * supplier.markup;
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
}

function resetStock(supplier, type, data) {
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
    if (supplier.isBlacklisted(item)) return;

    var fields = supplier.getFields(item);
    var barcode = fields.barcode;

    var barcodes = /\d+/.exec(barcode);
    if (barcodes === null) return;
    barcode = barcodes[0];
    if (barcode === undefined) return;
    for (i = barcode.length; i < 13; i++) {
      barcode = '0' + barcode;
    }

    var sku = supplier.getSku(barcode, type);

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
};

module.exports = {
  createStock: function(supplier, type, market) {
    jsonFile.readFile('cache/' + filesystem.getFileName(supplier + '_' + type, 'json'), function(err, obj) {
      var csv = Papa.unparse(createStock(suppliers[supplier], type, obj.data, market), {
        quotes: false,
        delimiter: '\t'
      });

      var filename = filesystem.getFileName('inventario_' + supplier + '_' + type + '_' + market, 'txt');
      filesystem.save(csv, filename);
    });
  },

  resetPrevious: function(supplier, type) {
    jsonFile.readFile('cache/' + filesystem.getPreviousFileName(supplier + '_' + type, 'json'), function(err, obj) {
      var csv = Papa.unparse(resetStock(suppliers[supplier], type, obj.data), {
        quotes: false,
        delimiter: '\t'
      });

      var filename = filesystem.getFileName('azzeramento_' + supplier + '_' + type, 'txt');
      filesystem.save(csv, filename);
    });
  }
};
