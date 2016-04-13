var $ = require('jquery')

var market = {
  formatPrice: function(price) {
    return price.replace('.', ',')
  },
  itemNote: '',
  expeditedShipping: 'N',
  willShipInternationally: null
}

module.exports = {
  it: $.extend({}, market, {
    itemNote: 'Nuovo, originale e sigillato',
    expeditedShipping: 23,
    willShipInternationally: 26
  }),
  uk: $.extend({}, market, {
    formatPrice: function(price) {
      return price
    },
    willShipInternationally: 6
  }),
  fr: $.extend({}, market, {
    itemNote: 'Neuf',
    willShipInternationally: 19
  }),
  de: $.extend({}, market, {
    willShipInternationally: 10
  }),
  es: $.extend({}, market, {
    willShipInternationally: 30
  })
}
