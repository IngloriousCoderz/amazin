const BARCODE_BLACKLIST = []

export default {
  hasCatalogAndStock: true,

  getMarkup(type) {
    switch (type) {
      case 'scolastica':
        return 1.75
      case 'varia':
        return 2
    }
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
      barcode: 'ean13',
      quantity: 'qta',
      price: 'prezzo'
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
    return barcode + '_CENTROL_'
  }
}
