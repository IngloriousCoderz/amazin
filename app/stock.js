var Papa = require('papaparse');
var jsonFile = require('jsonfile');

var filesystem = require('./filesystem');
var nada = require('./stores/nada');
var terminal = require('./stores/terminal');
var markets = require('./markets');

var stores = {
  nada: nada,
  terminal: terminal
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

function addItem(stock, item, values, store) {
  if (store.isBlacklisted(item)) return;

  var fields = store.getFields(item);

  var barcode = fields.barcode;
  var barcodes = /\d+/.exec(barcode);
  if (barcodes === null) return;
  barcode = barcodes[0];
  if (barcode === undefined) return;
  for (i = barcode.length; i < 13; i++) {
    barcode = '0' + barcode;
  }

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
    var values = {};

    var quantity = values.quantity = fields.quantity;
    if (isNaN(quantity) || quantity <= 0) return;
    if (quantity >= 1 && quantity <= 5) quantity = 1;
    else if (quantity >= 6 && quantity <= 10) quantity = 2;
    else if (quantity >= 11 && quantity <= 20) quantity = 3;
    else if (quantity > 20) quantity = 5;

    if (type === 'merchandising') {
      if (quantity < 3) return;
      else quantity = 1;
    }

    values.productIdType = 4;

    var price = values.price = fields.price;
    price = price.replace(',', '.');
    price = price.replace(/[^\d\.]/g, '') * store.markup;
    price = price.toFixed(2);
    price = markets[market].formatPrice(price);

    values.minimumSellerAllowedPrice = '';
    values.maximumSellerAllowedPrice = '';
    values.itemCondition = 11;
    values.addDelete = 'a';
    values.itemNote = markets[market].itemNote;
    values.expeditedShipping = markets[market].expeditedShipping;
    values.willShipInternationally = markets[market].willShipInternationally;
    values.fulfillmentCenterId = '';

    addItem(stock, item, values, store);
  });

  return stock;
}

function resetStock(store, type, data) {
  var stock = [];
  addHeader(stock);

  data.forEach(function(item, index) {
    var values = {
      barcode: '',
      productType: '',
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

    addItem(stock, item, values, store);
  });

  return stock;
};

module.exports = {
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
