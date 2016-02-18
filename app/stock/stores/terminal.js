var TITLE_BLACKLIST = [
  'ASSORTIMENTO',
  'ASSORTITI',
  'VARI',
  'ASSORTITO',
  'ASS.'
];

module.exports = {
  markup: 1.25,

  isBlacklisted: function(fields) {
    var title = fields.title;
    TITLE_BLACKLIST.forEach(function(stopword, index) {
      if (title.toLowerCase().indexOf(stopword.toLowerCase()) >= 0) {
        return true;
      }
    });
    return false;
  },

  getFields: function(item) {
    return {
      barcode: item['Cod. barre'],
      quantity: item['Q.ta in stock'],
      price: item['Pvc'],
      title: item['Titolo']
    };
  },

  getSku: function(barcode, type) {
    return barcode + '_TERMINAL' + (type === 'dvd' ? '_DVD' : '');// + 'OK';
  },

  getQuantity: function(quantity, type) {
    if (quantity >= 1 && quantity <= 5) quantity = 1;
    else if (quantity >= 6 && quantity <= 10) quantity = 2;
    else if (quantity >= 11 && quantity <= 20) quantity = 3;
    else if (quantity > 20) quantity = 5;

    if (type === 'merchandising') {
      if (quantity < 3) return;
      else quantity = 1;
    }
    return quantity;
  },

  onCached: function(type) {}
};
