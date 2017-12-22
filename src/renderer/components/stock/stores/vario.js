const BARCODE_BLACKLIST = []

export default {
  hasCatalogAndStock: false,

  getMarkup(type) {
    return 1
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
      quantity: 'quantity',
      price: 'price'
    }
  },

  getFields(item) {
    const fieldNames = this.getFieldNames()
    return {
      barcode: item[fieldNames.barcode],
      quantity: item[fieldNames.quantity],
      price: item[fieldNames.price]
    }
  },

  getSku(barcode, type) {
    return barcode + '_VARIO'
  }
}
