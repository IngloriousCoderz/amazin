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

  getFieldNames: function() {
    return {
      barcode: 'ean13',
      quantity: 'qta',
      price: 'prezzo'
    }
  },

  getFields: function(item) {
    var fieldNames = this.getFieldNames()
    return {
      barcode: item[fieldNames.barcode],
      quantity: item[fieldNames.quantity],
      price: item[fieldNames.price]
    }
  },

  getSku: function(barcode, type) {
    return barcode + '_CENTROL_'
  },

  hasCatalogAndStock: true
}
