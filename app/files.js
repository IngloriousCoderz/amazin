var moment = require('moment');

module.exports = {
  getFileName: function(name, type) {
    return name + '_' + moment().format('YYYY-MM-DD') + '.' + type;
  },

  string2byteArray: function(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
  }
};
