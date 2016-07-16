var moment = require('moment')
var fs = require('fs')
window.JSZip = require('jszip')
var XLSX = require('xlsx')
var Papa = require('papaparse')
var jsonFile = require('jsonfile')
var filesaver = require('filesaver.js')

function isExcel(file) {
  return file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && file.name.indexOf('.xlsx') >= 0 || file.type === 'application/vnd.ms-excel' && file.name.indexOf('.xls') >= 0
}

module.exports = {
  getFileName: function(name, type) {
    return name + '_' + moment().format('YYYY-MM-DDTHH:mm') + '.' + type
  },

  getFiles: function(dir, prefix) {
    var files = fs.readdirSync(dir).filter(function(fileName) {
      return fileName.startsWith(prefix)
    })
    files.sort()
    files.reverse()
    return files
  },

  read: function(file, onRead) {
    var self = this
    if (isExcel(file)) {
      var reader = new FileReader()
      reader.onload = function(e) {
        var data = e.target.result
        var workbook = XLSX.read(data, {
          type: 'binary'
        })
        self.read(XLSX.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[0]]), onRead)
      }
      reader.readAsBinaryString(file)
      return
    }

    this.parse(file, onRead)
  },

  parse: function(file, onComplete) {
    Papa.parse(file, {
      header: true,
      dynamicTyping: false,
      skipEmptyLines: true,
      encoding: 'iso-8859-1',

      complete: onComplete,

      error: function(error, file, inputElem, reason) {
        console.log(error, file, inputElem, reason)
      }
    })
  },

  cache: function(results, name, onCached) {
    jsonFile.writeFile('cache/' + this.getFileName(name, 'json'), results, function(err) {
      if (err) {
        console.log(err)
      } else if (onCached !== undefined) {
        onCached()
      }
    })
  },

  save: function(file, name) {
    filesaver.saveAs(new Blob([file], {
      type: "application/octet-stream"
    }), name)
  }
}
