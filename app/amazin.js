require('metro/build/css/metro.min.css!');
require('metro/build/css/metro-icons.min.css!');
require('metro/build/js/metro.min.js');

var riot = window.riot = require('riot');
require('./orders/orders-panel');
require('./stock/stock-panel');

riot.mount('*');
