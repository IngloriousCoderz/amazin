const BARCODE_BLACKLIST = [
  '8718526041064',
  '8718526040357',
  '8718526040364',
  '8718526040272',
  '8718526041040',
  '8718526040289',
  '8718526040357'
]

const TITLE_BLACKLIST = [
  'ASSORTIMENTO',
  'ASSORTITI',
  'VARI',
  'ASSORTITO',
  'ASS.'
]

export default {
  hasCatalogAndStock: false,

  getMarkup(type) {
    return 1.25
  },

  isBlacklisted(fields) {
    const barcode = fields.barcode
    const title = fields.title
    if (barcode == null) return true
    return (
      BARCODE_BLACKLIST.find(stopword =>
        barcode.toLowerCase().includes(stopword.toLowerCase())
      ) ||
      TITLE_BLACKLIST.find(stopword =>
        title.toLowerCase().includes(stopword.toLowerCase())
      )
    )
  },

  getFieldNames() {
    return {
      barcode: 'Cod. barre',
      quantity: 'Q.ta in stock',
      price: 'Pvc',
      title: 'Titolo'
    }
  },

  getFields(item) {
    const fieldNames = this.getFieldNames()
    return {
      barcode: item[fieldNames.barcode],
      quantity: item[fieldNames.quantity],
      price: item[fieldNames.price],
      title: item[fieldNames.title]
    }
  },

  getSku(barcode, type) {
    return barcode + '_TERMINAL' + (type === 'dvd' ? '_DVD' : '')
  }
}
