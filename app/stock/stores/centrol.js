var jsonFile = require('jsonfile')

var filesystem = require('../../filesystem')

var BARCODE_BLACKLIST = []

module.exports = {
  getMarkup: function(type) {
    switch (type) {
      case 'scolastica':
        return 1.75
      case 'varia':
        return 2
    }
  },

  isBlacklisted: function(fields) {
    var barcode = fields.barcode
    if (barcode === null) return true
    BARCODE_BLACKLIST.forEach(function(stopword, index) {
      if (barcode.toLowerCase().indexOf(stopword.toLowerCase()) >= 0) {
        return true
      }
    })
    return false
  },

  getFields: function(item) {
    return {
      barcode: item['ean13'],
      quantity: item['qta'],
      price: item['prezzo']
    }
  },

  getSku: function(barcode, type) {
    return barcode + '_CENTROL_' //_' + (type === 'dvd' ? 'DVD' : 'CD')
  },

  onCached: function(type) {
    jsonFile.readFile('cache/' + filesystem.getFileName('centrol_' + type + '_stock', 'json'), function(err, stockObj) {
      jsonFile.readFile('cache/' + filesystem.getFileName('centrol_' + type + '_catalog', 'json'), function(err, catalogObj) {
        var prices = {}
        catalogObj.data.map(function(catalogResult) {
          var price = catalogResult.prezzo
          if (price !== undefined) {
            prices[catalogResult.ean13] = price
          }
        })

        for (var i = stockObj.data.length - 1; i >= 0; i--) {
          var stockResult = stockObj.data[i]

          if (stockResult.qta === '0') {
            stockObj.data.splice(i, 1)
            continue
          }

          var price = prices[stockResult.ean13]
          if (price === undefined) {
            stockObj.data.splice(i, 1)
            continue
          }

          stockResult.prezzo = price
        }

        filesystem.cache(stockObj, 'centrol_' + type)
      })
    })
  }
}
