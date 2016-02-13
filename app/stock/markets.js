module.exports = {
  it: {
    formatPrice: function(price) {
      return price.replace('.', ',');
    },
    itemNote: 'Nuovo, originale e sigillato',
    expeditedShipping: 23,
    willShipInternationally: 26
  },
  uk: {
    formatPrice: function(price) {
      return price;
    },
    itemNote: '',
    expeditedShipping: 'N',
    willShipInternationally: 6
  },
  fr: {
    formatPrice: function(price) {
      return price.replace('.', ',');
    },
    itemNote: 'Neuf',
    expeditedShipping: 'N',
    willShipInternationally: 19
  },
  de: {
    formatPrice: function(price) {
      return price.replace('.', ',');
    },
    itemNote: '',
    expeditedShipping: 'N',
    willShipInternationally: 10
  },
  es: {
    formatPrice: function(price) {
      return price.replace('.', ',');
    },
    itemNote: '',
    expeditedShipping: 'N',
    willShipInternationally: 30
  }
};
