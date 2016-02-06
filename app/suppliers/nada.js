var BARCODE_BLACKLIST = [
  'rental',
  'EX RENTAL'
];
var MARKUP = 2;

module.exports = {
  markup: 2,

  isBlacklisted: function(item) {
    var barcode = item['barcode'];
    BARCODE_BLACKLIST.forEach(function(stopword, index) {
      if (barcode.toLowerCase().indexOf(stopword.toLowerCase()) >= 0) {
        return true;
      }
    });
    return false;
  },

  getFields: function(item) {
    return {
      barcode: item['barcode'],
      quantity: item['q.tà disp.'] || item['q,tà disp.'],
      price: item[' prezzo ']
    };
  },

  getSku: function(barcode, type) {
    return barcode + '_NADA' + (type === 'dvd' ? 'OK' : '');
  }
};
