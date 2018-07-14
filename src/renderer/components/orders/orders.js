import util from 'util'
import moment from 'moment'
import Papa from 'papaparse'
import jsonFile from 'jsonfile'

import * as fs from '@/service/filesystem'

const readJson = util.promisify(jsonFile.readFile)

export async function createSalesList() {
  try {
    const obj = await readJson(`cache/${fs.getFilename('orders', 'json')}`)
    const results = await _createSalesList(obj.data)
    const csv = Papa.unparse(results, { quotes: true, delimiter: '' })
    fs.save(csv, fs.getFilename('elenco-vendite', 'csv'))
  } catch (err) {
    throw new Error(err)
  }
}

export async function createShippingConfirmation() {
  try {
    const obj = await readJson(`cache/${fs.getFilename('orders', 'json')}`)
    const results = await _createShippingConfirmation(obj.data)
    const csv = Papa.unparse(results, { quotes: false, delimiter: '\t' })
    fs.save(csv, fs.getFilename('conferma-spedizioni', 'txt'))
  } catch (err) {
    throw new Error(err)
  }
}

function _createSalesList(data) {
  return data.map(item => {
    const name = item['recipient-name']
    const addr1 = item['ship-address-1']
    const addr2 = item['ship-address-2']
    const addr3 = item['ship-address-3']
    const city = item['ship-city']
    const zip = item['ship-postal-code']
    const state = item['ship-state']
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
