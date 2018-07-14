import util from 'util'
import moment from 'moment'
import jsonFile from 'jsonfile'

import * as fs from '@/service/filesystem'

const readJson = util.promisify(jsonFile.readFile)

export async function createReceipts() {
  try {
    const obj = await readJson(`cache/${fs.getFilename('receipts', 'json')}`)
    return await _createReceipts(obj.data)
  } catch (err) {
    throw new Error(err)
  }
}

function _createReceipts(data) {
  return data.map(item => {
    const { number, type, date, price } = item
    return {
      number,
      type,
      date: moment(date).format('YYYY-MM-DD'),
      items: [
        {
          sku: '',
          quantity: 1,
          description: 'DVD',
          price
        }
      ]
    }
  })
}
