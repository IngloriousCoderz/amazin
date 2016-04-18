var moment = require('moment')
var Papa = require('papaparse')
var jsonFile = require('jsonfile')

var filesystem = require('../filesystem')
var nada = require('./stores/nada')
var terminal = require('./stores/terminal')
var discoteca = require('./stores/discoteca')
var centrol = require('./stores/centrol')
var markets = require('./markets')

var stores = {
  nada: nada,
  terminal: terminal,
  discoteca: discoteca,
  centrol: centrol
}

function cleanBarcode(barcode) {
  var barcodes = /\d+/.exec(barcode)
  if (barcodes === null) return null

  barcode = barcodes[0]
  if (barcode === undefined) return null

  for (i = barcode.length; i < 13; i++) {
    barcode = '0' + barcode
  }

  return barcode
}

function isBlacklisted(store, fields) {
  return store.isBlacklisted(fields) || fields.barcode === null
}

function getQuantity(quantity, type) {
  if (quantity >= 1 && quantity < 5) quantity = 1
  else if (quantity >= 5 && quantity < 10) quantity = 2
  else if (quantity >= 10 && quantity < 25) quantity = 3
  else if (quantity >= 25) quantity = 5
  return quantity
}

function createStock(store, type, data, market) {
  var stock = []

  stock.push([
    'sku',
    'product-id',
    'product-id-type',
    'price',
    'minimum-seller-allowed-price',
    'maximum-seller-allowed-price',
    'item-condition',
    'quantity',
    'add-delete',
    'item-note',
    'expedited-shipping',
    'will-ship-internationally',
    'fulfillment-center-id'
  ])

  data.forEach(function(item, index) {
    var fields = store.getFields(item)
    var barcode = fields.barcode = cleanBarcode(fields.barcode)

    if (isBlacklisted(store, fields)) return

    var quantity = fields.quantity
    if (isNaN(quantity) || quantity <= 0) return
    quantity = getQuantity(quantity, type)

    var price = fields.price
    price = price.replace(',', '.')
    price = price.replace(/[^\d\.]/g, '') * store.getMarkup(type)
    price = price.toFixed(2)
    price = markets[market].formatPrice(price)

    var values = {
      sku: store.getSku(barcode, type) + moment().format('MMM').toUpperCase(),
      barcode: barcode,
      productIdType: 4,
      price: price,
      minimumSellerAllowedPrice: '',
      maximumSellerAllowedPrice: '',
      itemCondition: 11,
      quantity: quantity,
      addDelete: 'a',
      itemNote: markets[market].itemNote,
      expeditedShipping: markets[market].expeditedShipping,
      willShipInternationally: markets[market].willShipInternationally,
      fulfillmentCenterId: ''
    }

    stock.push([
      values.sku,
      values.barcode,
      values.productIdType,
      values.price,
      values.minimumSellerAllowedPrice,
      values.maximumSellerAllowedPrice,
      values.itemCondition,
      values.quantity,
      values.addDelete,
      values.itemNote,
      values.expeditedShipping,
      values.willShipInternationally,
      values.fulfillmentCenterId
    ])
  })

  return stock
}

function resetStock(store, type, data) {
  var stock = []

  stock.push([
    'sku',
    'quantity',
  ])

  data.forEach(function(item, index) {
    var fields = store.getFields(item)
    var barcode = fields.barcode = cleanBarcode(fields.barcode)

    if (isBlacklisted(store, fields)) return

    var values = {
      sku: store.getSku(barcode, type) + moment().format('MMM').toUpperCase(),
      quantity: 0
    }

    stock.push([
      values.sku,
      values.quantity
    ])
  })

  return stock
}

module.exports = {
  onCached: function(store, type) {
    stores[store].onCached(type)
  },

  getCachedStocks: function(store, type) {
    return filesystem.getFiles('cache/', store + '_' + type + '_stock')
  },

  resetStock: function(store, type, fileName) {
    jsonFile.readFile('cache/' + fileName, function(err, obj) {
      var csv = Papa.unparse(resetStock(stores[store], type, obj.data), {
        quotes: false,
        delimiter: '\t'
      })

      var fileName = filesystem.getFileName('azzeramento_' + store + '_' + type, 'txt')
      filesystem.save(csv, fileName)
    })
  },

  createStock: function(store, type, market) {
    jsonFile.readFile('cache/' + filesystem.getFileName(store + '_' + type + '_stock', 'json'), function(err, obj) {
      var csv = Papa.unparse(createStock(stores[store], type, obj.data, market), {
        quotes: false,
        delimiter: '\t'
      })

      var filename = filesystem.getFileName('giacenze_' + store + '_' + type + '_' + market, 'txt')
      filesystem.save(csv, filename)
    })
  }
}
