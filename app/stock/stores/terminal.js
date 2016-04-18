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
