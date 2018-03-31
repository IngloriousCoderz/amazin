import fs from 'fs'
import util from 'util'
import XLSX from 'xlsx'
import Papa from 'papaparse'
import jsonFile from 'jsonfile'
import FileSaver from 'file-saver'
import moment from 'moment'

const EXCEL_FILES = {
  XLSX: {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    extension: '.xlsx'
  },
  XLS: {
    type: 'application/vnd.ms-excel',
    extension: '.xls'
  }
}

const writeJson = util.promisify(jsonFile.writeFile)

export function getFilename(name, type) {
  return `${name}_${moment().format('YYYY-MM-DDTHH:mm')}.${type}`
}

export function getFiles(dir, prefix) {
  return fs
    .readdirSync(dir)
    .filter(fileName => fileName.startsWith(prefix))
    .sort()
    .reverse()
}

export function read(file) {
  return new Promise(resolve => {
    if (isExcel(file)) {
      const reader = new FileReader()
      reader.onload = e => {
        const data = e.target.result
        const { Sheets, SheetNames } = XLSX.read(data, { type: 'binary' })
        const csv = XLSX.utils.sheet_to_csv(Sheets[SheetNames[0]])
        const result = Papa.parse(csv, {
          header: true,
          dynamicTyping: false,
          skipEmptyLines: true
        })
        resolve(result)
      }
      reader.readAsBinaryString(file)
    } else {
      parse(file).then(resolve)
    }
  })
}

export function parse(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: false,
      skipEmptyLines: true,
      encoding: 'iso-8859-1',
      complete: resolve,
      error: reject
    })
  })
}

export function cache(results, name) {
  return writeJson(`cache/${getFilename(name, 'json')}`, results)
}

export function save(file, name) {
  FileSaver.saveAs(new Blob([file], { type: 'application/octet-stream' }), name)
}

function isExcel(file) {
  return Object.values(EXCEL_FILES).find(
    ({ type, extension }) => file.type === type && file.name.endsWith(extension)
  )
}
