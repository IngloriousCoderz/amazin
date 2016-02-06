var Papa = require('papaparse');
var jsonFile = require('jsonfile');
var filesaver = require('filesaver.js');

var files = require('./files');
var nada = require('./nada');
var terminal = require('./terminal');

var suppliers = {
  nada: nada,
  terminal: terminal
};

module.exports = {
  createStock: function(supplier, type, market) {
    jsonFile.readFile('cache/' + files.getFileName(supplier + '_' + type, 'json'), function(err, obj) {
      var csv = Papa.unparse(suppliers[supplier].createStock(obj.data, type, market), {
        quotes: false,
        delimiter: '\t'
      });

      var filename = files.getFileName('inventario_' + supplier + '_' + type + '_' + market, 'txt');
      filesaver.saveAs(new Blob([files.string2byteArray(csv)], {
        type: "application/octet-stream"
      }), filename);
    });
  },

  resetPrevious: function(supplier, type) {
    jsonFile.readFile('cache/' + files.getPreviousFileName(supplier + '_' + type, 'json'), function(err, obj) {
      var csv = Papa.unparse(suppliers[supplier].resetStock(obj.data, type), {
        quotes: false,
        delimiter: '\t'
      });

      var filename = files.getFileName('azzeramento_' + supplier + '_' + type, 'txt');
      filesaver.saveAs(new Blob([files.string2byteArray(csv)], {
        type: "application/octet-stream"
      }), filename);
    });
  }
};
