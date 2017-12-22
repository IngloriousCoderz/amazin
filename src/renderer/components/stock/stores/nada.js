const BARCODE_BLACKLIST = ['rental', 'EX RENTAL']

export default {
  hasCatalogAndStock: false,

  getMarkup(type) {
    return 2
  },

  isBlacklisted(fields) {
    const barcode = fields.barcode
    if (barcode == null) return true
    return BARCODE_BLACKLIST.find(stopword =>
      barcode.toLowerCase().includes(stopword.toLowerCase())
    )
  },

  getFieldNames() {
    return {
      barcode: 'barcode',
      quantity: ['q.tà disp.', 'q,tà disp.'],
      price: ' prezzo '
    }
  },

  getFields(item) {
    return {
      barcode: item['barcode'],
      quantity: item['q.tà disp.'] || item['q,tà disp.'],
      price: item[' prezzo ']
    }
  },

  getSku(barcode, type) {
    return barcode + '_NADA' + type.toUpperCase()
  }
}
