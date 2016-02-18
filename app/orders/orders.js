var moment = require('moment');
var Papa = require('papaparse');
var jsonFile = require('jsonfile');

var filesystem = require('../filesystem');

function createSalesList(data) {
  var workItems = [];

  data.forEach(function(item, index) {
    var name = item['recipient-name'];
    var addr1 = item['ship-address-1'];
    var addr2 = item['ship-address-2'];
    var addr3 = item['ship-address-3'];
    var city = item['ship-city'];
    var state = item['ship-state'];
    var zip = item['ship-postal-code'];
    var country = item['ship-country'];
    var phone = item['ship-phone-number'];

    locality = city;
    if (zip.length > 0) {
      locality = zip + ' ' + locality;
    }
    if (state.length > 0) {
      locality += ' (' + state + ')';
    }

    workItems.push([
      moment().format('YYYY-MM-DD'),
      item['product-name'],
      item['sku'],
      item['item-price'], (name.length > 0 ? name + '\n' : '') +
      (addr1.length > 0 ? addr1 + '\n' : '') +
      (addr2.length > 0 ? addr2 + '\n' : '') +
      (addr3.length > 0 ? addr3 + '\n' : '') +
      locality + '\n' +
      (country.length > 0 ? country + '\n' : '') +
      (phone.length > 0 ? phone + '\n' : ''),
      item['shipping-price'],
      item['order-id']
    ]);
  });

  return workItems;
}

function createShippingConfirmation(data) {
  var shipping = [];

  shipping.push([
    'order-id',
    'order-item-id',
    'quantity',
    'ship-date',
    'carrier-code',
    'carrier-name',
    'tracking-number',
    'ship-method'
  ]);

  data.forEach(function(item, index) {
    shipping.push([
      item['order-id'],
      '',
      '',
      moment().format('YYYY-MM-DD'),
      'Poste Italiane',
      '',
      'Priority',
      ''
    ]);
  });
  return shipping;
}

module.exports = {
  createSalesList: function() {
    jsonFile.readFile('cache/' + filesystem.getFileName('orders', 'json'), function(err, obj) {
      var csv = Papa.unparse(createSalesList(obj.data), {
        quotes: true,
        delimiter: ';'
      });

      var filename = filesystem.getFileName('elenco-vendite', 'csv');
      filesystem.save(csv, filename);
    });
  },

  createShippingConfirmation: function() {
    jsonFile.readFile('cache/' + filesystem.getFileName('orders', 'json'), function(err, obj) {
      var csv = Papa.unparse(createShippingConfirmation(obj.data), {
        quotes: false,
        delimiter: '\t'
      });

      var filename = filesystem.getFileName('conferma-spedizioni', 'txt');
      filesystem.save(csv, filename);
    });
  }
};
