var BARCODE_BLACKLIST = [
  '8718526041064',
  '8718526040357',
  '8718526040364',
  '8718526040272',
  '8718526041040',
  '8718526040289',
  '8718526040357'
]

var TITLE_BLACKLIST = [
  'ASSORTIMENTO',
  'ASSORTITI',
  'VARI',
  'ASSORTITO',
  'ASS.'
]

module.exports = {
  getMarkup: function(type) {
    return 1.25
  },

  isBlacklisted: function(fields) {
    var barcode = fields.barcode
    if (barcode === null) return true
    BARCODE_BLACKLIST.forEach(function(stopword, index) {
      if (barcode.toLowerCase().indexOf(stopword.toLowerCase()) >= 0) {
        return true
      }
    })
    var title = fields.title
    TITLE_BLACKLIST.forEach(function(stopword, index) {
      if (title.toLowerCase().indexOf(stopword.toLowerCase()) >= 0) {
        return true
      }
    })
    return false
  },

  getFieldNames: function() {
    return {
      barcode: 'Cod. barre',
      quantity: 'Q.ta in stock',
      price: 'Pvc',
      title: 'Titolo'
    }
  },

  getFields: function(item) {
    var fieldNames = this.getFieldNames()
    return {
      barcode: item[fieldNames.barcode],
      quantity: item[fieldNames.quantity],
      price: item[fieldNames.price],
      title: item[fieldNames.title]
    }
  },

  getSku: function(barcode, type) {
    return barcode + '_TERMINAL' + (type === 'dvd' ? '_DVD' : '')
  },

  hasCatalogAndStock: false
}
