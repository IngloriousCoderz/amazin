import moment from 'moment'
import Papa from 'papaparse'
import jsonFile from 'jsonfile'

import * as fs from '@/service/filesystem'
import stores from './stores'
import markets from './markets'

export function onCached(store, type) {
  if (!stores[store].hasCatalogAndStock) {
    return
  }

  const fieldNames = stores[store].getFieldNames()

  jsonFile.readFile(
    `cache/${fs.getFilename(`${store}_${type}_stock`, 'json')}`,
    (err, stockObj) => {
      if (err) {
        throw new Error(err)
      }

      jsonFile.readFile(
        `cache/${fs.getFilename(`${store}_${type}_catalog`, 'json')}`,
        (err, catalogObj) => {
          if (err) {
            throw new Error(err)
          }

          const prices = catalogObj.data.reduce((prices, item) => {
            const price = item[fieldNames.price]
            if (price != null) {
              prices[item[fieldNames.barcode]] = price
            }
            return prices
          }, {})

          const stockItems = stockObj.data
            .filter(item => item[fieldNames.quantity] !== '0')
            .filter(item => prices[item[fieldNames.barcode]] != null)
            .map(item => {
              item[fieldNames.price] = prices[item[fieldNames.barcode]]
              return item
            })
          stockObj.data = stockItems

          fs.cache(stockObj, `${store}_${type}_stock`)
        }
      )
    }
  )
}

export function getCachedStocks(store, type) {
  return fs.getFiles('cache/', `${store}_${type}_stock`)
}

export function resetStock(store, type, filename) {
  jsonFile.readFile(`cache/${filename}`, (err, obj) => {
    if (err) {
      throw new Error(err)
    }

    const csv = Papa.unparse(_resetStock(stores[store], type, obj.data), {
      quotes: false,
      delimiter: '\t'
    })

    const filename = fs.getFilename(`azzeramento_${store}_${type}`, 'txt')
    fs.save(csv, filename)
  })
}

export function createStock(store, type, market) {
  const stock = getCachedStocks(store, type)[0]
  jsonFile.readFile(`cache/${stock}`, (err, obj) => {
    if (err) {
      throw new Error(err)
    }

    const csv = Papa.unparse(
      _createStock(stores[store], type, obj.data, market),
      {
        quotes: false,
        delimiter: '\t'
      }
    )

    const filename = fs.getFilename(
      `giacenze_${store}_${type}_${market}`,
      'txt'
    )
    fs.save(csv, filename)
  })
}

function cleanBarcode(barcode) {
  const matches = /\d+/.exec(barcode)
  if (matches == null || !matches.length) return null

  let [cleanBarcode] = matches
  for (let i = cleanBarcode.length; i < 13; i++) {
    cleanBarcode = '0' + cleanBarcode
  }

  return cleanBarcode
}

function isBlacklisted(store, fields) {
  return store.isBlacklisted(fields) || fields.barcode == null
}

function getQuantity(quantity, type) {
  if (quantity >= 1 && quantity < 5) quantity = 1
  else if (quantity >= 5 && quantity < 10) quantity = 2
  else if (quantity >= 10 && quantity < 25) quantity = 3
  else if (quantity >= 25) quantity = 5
  return quantity
}

function _createStock(store, type, data, market) {
  const header = [
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
  ]

  return data.reduce(
    (stock, item) => {
      const fields = store.getFields(item)
      const barcode = (fields.barcode = cleanBarcode(fields.barcode))

      if (isBlacklisted(store, fields)) return stock

      let quantity = fields.quantity
      if (isNaN(quantity) || quantity <= 0) return stock
      quantity = getQuantity(quantity, type)

      const productIdType = 4
      const minimumSellerAllowedPrice = ''
      const maximumSellerAllowedPrice = ''
      const itemCondition = 11
      const addDelete = 'a'
      const fulfillmentCenterId = ''

      const {
        itemNote,
        expeditedShipping,
        willShipInternationally,
        formatPrice
      } = markets[market]

      const sku =
        store.getSku(barcode, type) +
        moment()
          .format('MMM')
          .toUpperCase()

      let price = fields.price
      price = price.replace(',', '.')
      price = price.replace(/[^\d.]/g, '') * store.getMarkup(type)
      price = price.toFixed(2)
      price = formatPrice(price)

      const values = [
        sku,
        barcode,
        productIdType,
        price,
        minimumSellerAllowedPrice,
        maximumSellerAllowedPrice,
        itemCondition,
        quantity,
        addDelete,
        itemNote,
        expeditedShipping,
        willShipInternationally,
        fulfillmentCenterId
      ]

      return [...stock, values]
    },
    [header]
  )
}

function _resetStock(store, type, data) {
  const header = ['sku', 'quantity']

  return data.reduce(
    (stock, item) => {
      const fields = store.getFields(item)
      const barcode = (fields.barcode = cleanBarcode(fields.barcode))

      if (isBlacklisted(store, fields)) return stock

      const sku =
        store.getSku(barcode, type) +
        moment()
          .format('MMM')
          .toUpperCase()
      const quantity = 0

      const values = [sku, quantity]

      return [...stock, values]
    },
    [header]
  )
}
