var XLSX = require('xlsx');
var Papa = require('papaparse');
var jsonFile = require('jsonfile');
var filesaver = require('filesaver.js');
var files = require('./files');
var nada = require('./nada');

var suppliers = {
  nada: nada
}

module.exports = {
  cacheFile: function(file, supplier, type) {
    var self = this;
    if (file.type === 'application/vnd.ms-excel') {
      var reader = new FileReader();
      reader.onload = function(e) {
        var data = e.target.result;
        var workbook = XLSX.read(data, {
          type: 'binary'
        });
        self.cacheFile(XLSX.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[0]]), supplier, type);
      }
      reader.readAsBinaryString(file);
      return;
    }

    Papa.parse(file, {
      header: true,
      dynamicTyping: false,
      skipEmptyLines: true,

      complete: function(results, file) {
        jsonFile.writeFile('cache/' + files.getFileName(supplier + '_' + type, 'json'), results, function(err) {
          if (err) {
            console.log(err);
          }
        });
      },

      error: function(error, file, inputElem, reason) {
        console.log(error, file, inputElem, reason);
      }
    });
  },

  createInventory: function(supplier, type) {
    jsonFile.readFile('cache/' + files.getFileName(supplier + '_' + type, 'json'), function(err, obj) {
      var csv = Papa.unparse(suppliers[supplier].createInventory(obj.data, type), {
        quotes: true,
        delimiter: ';' //'\t'
      });

      var filename = files.getFileName('inventario_' + supplier + '_' + type, 'txt');
      filesaver.saveAs(new Blob([files.string2byteArray(csv)], {
        type: "application/octet-stream"
      }), filename);

      return;
    });
  }
};
