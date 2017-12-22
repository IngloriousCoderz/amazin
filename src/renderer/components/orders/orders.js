import moment from 'moment'
import Papa from 'papaparse'
import jsonFile from 'jsonfile'

import * as fs from '@/service/filesystem'

export function createSalesList() {
  jsonFile.readFile('cache/' + fs.getFilename('orders', 'json'), (err, obj) => {
    if (err) {
      throw new Error(err)
    }

    const csv = Papa.unparse(_createSalesList(obj.data), {
      quotes: true,
      delimiter: ''
    })

    const filename = fs.getFilename('elenco-vendite', 'csv')
    fs.save(csv, filename)
  })
}

export function createShippingConfirmation() {
  jsonFile.readFile('cache/' + fs.getFilename('orders', 'json'), (err, obj) => {
    if (err) {
      throw new Error(err)
    }

    const csv = Papa.unparse(_createShippingConfirmation(obj.data), {
      quotes: false,
      delimiter: '\t'
    })

    const filename = fs.getFilename('conferma-spedizioni', 'txt')
    fs.save(csv, filename)
  })
}

function _createSalesList(data) {
  return data.map(item => {
    const name = item['recipient-name']
    const addr1 = item['ship-address-1']
    const addr2 = item['ship-address-2']
    const addr3 = item['ship-address-3']
    const city = item['ship-city']
    const state = item['ship-state']
    const zip = item['ship-postal-code']
    const country = item['ship-country']
    const phone = item['ship-phone-number']

    let locality = city
    if (zip.length) {
      locality = zip + ' ' + locality
    }
    if (state.length) {
      locality += ' (' + state + ')'
    }

    return [
      moment().format('YYYY-MM-DD'),
      item['product-name'],
      item['sku'],
      item['item-price'],
      (name.length ? `${name}\n` : '') +
        (addr1.length ? `${addr1}\n` : '') +
        (addr2.length ? `${addr2}\n` : '') +
        (addr3.length ? `${addr3}\n` : '') +
        locality +
        '\n' +
        (country.length ? `${country}\n` : '') +
        (phone.length ? `${phone}\n` : ''),
      item['shipping-price'],
      item['order-id']
    ]
  })
}

function _createShippingConfirmation(data) {
  const header = [
    'order-id',
    'order-item-id',
    'quantity',
    'ship-date',
    'carrier-code',
    'carrier-name',
    'tracking-number',
    'ship-method'
  ]

  return [
    header,
    ...data.map(item => [
      item['order-id'],
      '',
      '',
      moment().format('YYYY-MM-DD'),
      'Poste Italiane',
      '',
      'Priority',
      ''
    ])
  ]
}
