var moment = require('moment');
var XLSX = require('xlsx');
var Papa = require('papaparse');
var jsonFile = require('jsonfile');
var filesaver = require('filesaver.js');

function string2byteArray(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i < s.length; i++) {
    view[i] = s.charCodeAt(i) & 0xFF;
  }
  return buf;
}

module.exports = {
  getFileName: function(name, type) {
    return name + '_' + moment().format('YYYY-MM-DD') + '.' + type;
  },

  getPreviousFileName: function(name, type) {
    return name + '_' + moment().subtract(1, 'days').format('YYYY-MM-DD') + '.' + type;
  },

  cache: function(file, name) {
    var self = this;
    if (file.type === 'application/vnd.ms-excel') {
      var reader = new FileReader();
      reader.onload = function(e) {
        var data = e.target.result;
        var workbook = XLSX.read(data, {
          type: 'binary'
        });
        self.cache(XLSX.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[0]]), name);
      }
      reader.readAsBinaryString(file);
      return;
    }

    Papa.parse(file, {
      header: true,
      dynamicTyping: false,
      skipEmptyLines: true,

      complete: function(results, file) {
        jsonFile.writeFile('cache/' + self.getFileName(name, 'json'), results, function(err) {
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

  save: function(file, name) {
    filesaver.saveAs(new Blob([string2byteArray(file)], {
      type: "application/octet-stream"
    }), name);
  }
};
