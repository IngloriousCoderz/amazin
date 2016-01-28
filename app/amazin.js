require('metro/build/css/metro.min.css!');
require('metro/build/css/metro-icons.min.css!');

var $ = require('jquery');
var metro = require('metro/build/js/metro.min.js');
var Papa = require('papaparse');
var moment = require('moment');
var jsonFile = require('jsonfile');
var XLSX = require('xlsx');
var filesaver = require('filesaver.js');

function getFileName(name, type) {
  return name + '_' + moment().format('YYYY-MM-DD') + '.' + type;
};

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

function orders2WorkItems(data) {
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

function orders2shippingConfirm(data) {
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

function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i < s.length; i++) {
    view[i] = s.charCodeAt(i) & 0xFF;
  }
  return buf;
}

$(function() {
  'use strict';

  $('#ordini').on('change', '#file-ordini', function(event) {
    Papa.parse(event.target.files[0], {
      header: true,
      dynamicTyping: false,
      skipEmptyLines: true,

      complete: function(results, file) {
        jsonFile.writeFile('cache/' + getFileName('ordini', 'json'), results, function(err) {
          if (err) {
            console.log(err);
          }
        });
      },

      error: function(error, file, inputElem, reason) {
        console.log(error, file, inputElem, reason);
      }
    });
  });

  $('#ordini').on('click', 'button#elenco-vendite', function(event) {
    event.preventDefault();

    // var workbook = XLSX.readFile('test/samples/file lavoro.xls');
    // console.log('original workbook', workbook);
    // return;

    jsonFile.readFile('cache/' + getFileName('ordini', 'json'), function(err, obj) {
      var csv = Papa.unparse(orders2WorkItems(obj.data), {
        quotes: true,
        delimiter: ';'//'\t'
      });

      var filename = getFileName('elenco-vendite', 'csv');
      filesaver.saveAs(new Blob([s2ab(csv)], {
        type: "application/octet-stream"
      }), filename);
      return;

      // workbook.SheetNames = ['Vendite'];
      // workbook.Sheets['Vendite'] = convertOrders(obj.data);

      var workbook = {
        Directory: ['Vendite'],
        SheetNames: ['Vendite'],
        Sheets: {
          Vendite: orders2Sheet(obj.data)
        }
      }

      console.log('output workbook', workbook);

      var filename = getFileName('elenco-vendite', 'xlsx');
      XLSX.writeFile(workbook, filename);

      // var output = XLSX.write(workbook, {
      //   bookType: 'xlsb',
      //   bookSST: true,
      //   type: 'binary'
      // });
      // filesaver.saveAs(new Blob([s2ab(output)], {
      //   type: "application/octet-stream"
      // }), filename);
    });
  });

  $('#ordini').on('click', 'button#conferma-spedizioni', function(event) {
    event.preventDefault();

    jsonFile.readFile('cache/' + getFileName('ordini', 'json'), function(err, obj) {
      var csv = Papa.unparse(orders2shippingConfirm(obj.data), {
        quotes: true,
        delimiter: '\t'
      });

      var filename = getFileName('conferma-spedizioni', 'csv');
      filesaver.saveAs(new Blob([s2ab(csv)], {
        type: "application/octet-stream"
      }), filename);
      return;
    });
  });
});
