import moment from 'moment'
import fs from 'fs'
import XLSX from 'xlsx'
import Papa from 'papaparse'
import jsonFile from 'jsonfile'
import FileSaver from 'file-saver'

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

export function read(file, onRead) {
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
      onRead(result)
    }
    reader.readAsBinaryString(file)
    return
  }

  parse(file, onRead)
}

export function parse(file, onComplete) {
  Papa.parse(file, {
    header: true,
    dynamicTyping: false,
    skipEmptyLines: true,
    encoding: 'iso-8859-1',
    complete: onComplete,
    error(error, file, inputElem, reason) {
      console.error(error, file, inputElem, reason)
      throw new Error(error)
    }
  })
}

export function cache(results, name, onCached) {
  jsonFile.writeFile(`cache/${getFilename(name, 'json')}`, results, err => {
    if (err) {
      throw new Error(err)
    }

    onCached && onCached()
  })
}

export function save(file, name) {
  FileSaver.saveAs(new Blob([file], { type: 'application/octet-stream' }), name)
}

function isExcel(file) {
  return Object.values(EXCEL_FILES).find(
    ({ type, extension }) => file.type === type && file.name.endsWith(extension)
  )
}
