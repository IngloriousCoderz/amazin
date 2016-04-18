require('metro/css/metro.css!')
require('metro/css/metro-icons.css!')
window.jQuery = require('jquery')
require('metro/js/metro')

var riot = window.riot = require('riot')
require('./orders/orders-panel')
require('./stock/stock-panel')

riot.mount('*')
