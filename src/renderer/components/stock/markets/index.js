const DEFAULT_MARKET = {
  itemNote: '',
  expeditedShipping: 'N',
  willShipInternationally: null,
  formatPrice: price => price.replace('.', ',')
}

export default {
  it: Object.assign({}, DEFAULT_MARKET, {
    itemNote: 'Nuovo, originale e sigillato',
    expeditedShipping: 23,
    willShipInternationally: 26
  }),

  uk: Object.assign({}, DEFAULT_MARKET, {
    willShipInternationally: 6,
    formatPrice: price => price
  }),

  fr: Object.assign({}, DEFAULT_MARKET, {
    itemNote: 'Neuf',
    willShipInternationally: 19
  }),

  de: Object.assign({}, DEFAULT_MARKET, {
    willShipInternationally: 10
  }),

  es: Object.assign({}, DEFAULT_MARKET, {
    willShipInternationally: 30
  })
}
