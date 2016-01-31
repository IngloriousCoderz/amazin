var moment = require('moment');
var Papa = require('papaparse');
var jsonFile = require('jsonfile');
var filesaver = require('filesaver.js');
var files = require('./files');

function orders2SalesList(data) {
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

function orders2shippingConfirmation(data) {
  var shipping = [];
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

function orders2Sheet(data, opts) {
  var ws = {};

  data.forEach(function(item, index) {
    var cell = {
      c: 0,
      r: index,
      v: parseInt(moment().format('X')),
      t: 'n',
      // z: XLSX.SSF._table[14],
      w: moment().format('YYYY-MM-DD')
    };
    ws[XLSX.utils.encode_cell({
      c: cell.c,
      r: cell.r
    })] = cell;

    cell = {
      c: 1,
      r: index,
      v: item['product-name'],
      t: 's'
    };
    ws[XLSX.utils.encode_cell({
      c: cell.c,
      r: cell.r
    })] = cell;
  });

  var range = {
    s: {
      c: 2 - 1,
      r: data.length - 1
    },
    e: {
      c: 0,
      r: 0
    }
  }
  ws['!range'] = range;
  ws['!ref'] = XLSX.utils.encode_range(range);

  return ws;
}

module.exports = {
  createSalesList: function() {
    jsonFile.readFile('cache/' + files.getFileName('orders', 'json'), function(err, obj) {
      var csv = Papa.unparse(orders2SalesList(obj.data), {
        quotes: true,
        delimiter: ';' //'\t'
      });

      var filename = files.getFileName('elenco-vendite', 'csv');
      filesaver.saveAs(new Blob([files.string2byteArray(csv)], {
        type: "application/octet-stream"
      }), filename);
    });
  },

  createShippingConfirmation: function() {
    jsonFile.readFile('cache/' + files.getFileName('orders', 'json'), function(err, obj) {
      var csv = Papa.unparse(orders2shippingConfirmation(obj.data), {
        quotes: false,
        delimiter: '\t'
      });

      var filename = files.getFileName('conferma-spedizioni', 'txt');
      filesaver.saveAs(new Blob([files.string2byteArray(csv)], {
        type: "application/octet-stream"
      }), filename);
    });
  }
};
