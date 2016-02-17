var Papa = require('papaparse');
var jsonFile = require('jsonfile');

var filesystem = require('../filesystem');
var nada = require('./stores/nada');
var terminal = require('./stores/terminal');
var discoteca = require('./stores/discoteca');
var markets = require('./markets');

var stores = {
  nada: nada,
  terminal: terminal,
  discoteca: discoteca
};

function addHeader(stock) {
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
}

function cleanBarcode(barcode) {
  var barcodes = /\d+/.exec(barcode);
  if (barcodes === null) return null;

  barcode = barcodes[0];
  if (barcode === undefined) return null;

  for (i = barcode.length; i < 13; i++) {
    barcode = '0' + barcode;
  }

  return barcode;
}

function isBlacklisted(store, fields) {
  return store.isBlacklisted(fields) || fields.barcode === null;
}

function addItem(stock, fields, values, store, type) {
  var barcode = fields.barcode;
  var sku = store.getSku(barcode, type);

  barcode = values.barcode !== '' ? values.barcode : barcode;

  stock.push([
    sku,
    barcode,
    values.productIdType,
    values.price,
    values.minimumSellerAllowedPrice,
    values.maximumSellerAllowedPrice,
    values.itemCondition,
    values.quantity,
    values.addDelete,
    values.itemNote,
    values.expeditedShipping,
    values.willShipInternationally,
    values.fulfillmentCenterId
  ]);
}

function createStock(store, type, data, market) {
  var stock = [];
  addHeader(stock);

  data.forEach(function(item, index) {
    var fields = store.getFields(item);
    fields.barcode = cleanBarcode(fields.barcode);

    if (isBlacklisted(store, fields)) return;

    var values = {
      barcode: fields.barcode,
      productIdType: 4,
      price: fields.price,
      minimumSellerAllowedPrice: '',
      maximumSellerAllowedPrice: '',
      itemCondition: 11,
      quantity: fields.quantity,
      addDelete: 'a',
      itemNote: markets[market].itemNote,
      expeditedShipping: markets[market].expeditedShipping,
      willShipInternationally: markets[market].willShipInternationally,
      fulfillmentCenterId: ''
    };

    var quantity = values.quantity;
    if (isNaN(quantity) || quantity <= 0) return;
    values.quantity = store.getQuantity(quantity);

    var price = values.price;
    price = price.replace(',', '.');
    price = price.replace(/[^\d\.]/g, '') * store.markup;
    price = price.toFixed(2);
    price = markets[market].formatPrice(price);
    values.price = price;

    addItem(stock, fields, values, store, type);
  });

  return stock;
}

function resetStock(store, type, data) {
  var stock = [];
  addHeader(stock);

  data.forEach(function(item, index) {
    var fields = store.getFields(item);
    fields.barcode = cleanBarcode(fields.barcode);

    if (isBlacklisted(store, fields)) return;

    var values = {
      barcode: '',
      productIdType: '',
      price: '',
      minimumSellerAllowedPrice: '',
      maximumSellerAllowedPrice: '',
      itemCondition: '',
      quantity: 0,
      addDelete: '',
      itemNote: '',
      expeditedShipping: '',
      willShipInternationally: '',
      fulfillmentCenterId: ''
    };

    addItem(stock, fields, values, store, type);
  });

  return stock;
};

module.exports = {
  onCached: function(store, type) {
    stores[store].onCached(type);
  },

  createStock: function(store, type, market) {
    jsonFile.readFile('cache/' + filesystem.getFileName(store + '_' + type, 'json'), function(err, obj) {
      var csv = Papa.unparse(createStock(stores[store], type, obj.data, market), {
        quotes: false,
        delimiter: '\t'
      });

      var filename = filesystem.getFileName('inventario_' + store + '_' + type + '_' + market, 'txt');
      filesystem.save(csv, filename);
    });
  },

  resetPrevious: function(store, type) {
    jsonFile.readFile('cache/' + filesystem.getPreviousFileName(store + '_' + type, 'json'), function(err, obj) {
      var csv = Papa.unparse(resetStock(stores[store], type, obj.data), {
        quotes: false,
        delimiter: '\t'
      });

      var filename = filesystem.getFileName('azzeramento_' + store + '_' + type, 'txt');
      filesystem.save(csv, filename);
    });
  }
};
