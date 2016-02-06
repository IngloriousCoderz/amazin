var Papa = require('papaparse');
var jsonFile = require('jsonfile');
var filesaver = require('filesaver.js');
var files = require('./files');

var TITLE_BLACKLIST = [
  'ASSORTIMENTO',
  'ASSORTITI',
  'VARI',
  'ASSORTITO',
  'ASS.'
];

module.exports = {
  markup: 1.25,

  isBlacklisted: function(item) {
    var title = item['Titolo'];
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
    return barcode + '_TERMINAL' + (type === 'dvd' ? '_DVD' : '') + 'OK';
  }
};