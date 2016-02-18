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

  read: function(file, onRead) {
    var self = this;
    if (file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      var reader = new FileReader();
      reader.onload = function(e) {
        var data = e.target.result;
        var workbook = XLSX.read(data, {
          type: 'binary'
        });
        self.read(XLSX.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[0]]), onRead);
      }
      reader.readAsBinaryString(file);
      return;
    }

    this.parse(file, onRead);
  },

  parse: function(file, onComplete) {
    Papa.parse(file, {
      header: true,
      dynamicTyping: false,
      skipEmptyLines: true,
      encoding: 'iso-8859-1',

      complete: onComplete,

      error: function(error, file, inputElem, reason) {
        console.log(error, file, inputElem, reason);
      }
    });
  },

  cache: function(results, name, onCached) {
    jsonFile.writeFile('cache/' + this.getFileName(name, 'json'), results, function(err) {
      if (err) {
        console.log(err);
      } else if (onCached !== undefined) {
        onCached();
      }
    });
  },

  save: function(file, name) {
    filesaver.saveAs(new Blob([string2byteArray(file)], {
      type: "application/octet-stream"
    }), name);
  }
};
