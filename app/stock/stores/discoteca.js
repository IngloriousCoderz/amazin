var jsonFile = require('jsonfile')

var filesystem = require('../../filesystem')

var BARCODE_BLACKLIST = [
  // 'rental',
  // 'EX RENTAL'
]

module.exports = {
  markup: 2.15,

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
      barcode: item['ean'],
      quantity: item['disponibilita'],
      price: item['prezzo']
    }
  },

  getSku: function(barcode, type) {
    return barcode + '_DISCOTECA'//_' + (type === 'dvd' ? 'DVD' : 'CD')
  },

  getQuantity: function(quantity, type) {
    return quantity
  },

  onCached: function(type) {
    jsonFile.readFile('cache/' + filesystem.getFileName('discoteca_' + type, 'json'), function(err, stockObj) {
      jsonFile.readFile('cache/' + filesystem.getFileName('discoteca_catalog', 'json'), function(err, catalogObj) {
        var prices = {}
        catalogObj.data.map(function(catalogResult) {
          var price = catalogResult.prezzo
          if (price !== undefined) {
            prices[catalogResult.ean] = price
          }
        })

        for (var i = stockObj.data.length - 1 i >= 0 i--) {
          var stockResult = stockObj.data[i]

          if (stockResult.disponibilita === '0') {
            stockObj.data.splice(i, 1)
            continue
          }

          var price = prices[stockResult.ean]
          if (price === undefined) {
            stockObj.data.splice(i, 1)
            continue
          }

          stockResult.prezzo = price
        }

        filesystem.cache(stockObj, 'discoteca_' + type)
      })
    })
  }
}
