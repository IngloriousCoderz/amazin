var BARCODE_BLACKLIST = [
  'rental',
  'EX RENTAL'
]

module.exports = {
  markup: 2,

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
      barcode: item['barcode'],
      quantity: item['q.tà disp.'] || item['q,tà disp.'],
      price: item[' prezzo ']
    }
  },

  getSku: function(barcode, type) {
    // return barcode + '_NADA' + (type === 'dvd' ? 'OK' : '')
    return barcode + '_NADA' + type.toUpperCase()
  },

  getQuantity: function(quantity, type) {
    if (quantity >= 1 && quantity <= 5) quantity = 1
    else if (quantity >= 6 && quantity <= 10) quantity = 2
    else if (quantity >= 11 && quantity <= 20) quantity = 3
    else if (quantity > 20) quantity = 5
    return quantity
  },

  onCached: function(type) {}
}
