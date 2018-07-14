import moment from 'moment'
import numeral from 'numeral'
// import 'numeral/locales/it'

// NOTE: importing locale didn't work, I had to define one myself

numeral.register('locale', 'it', {
  delimiters: {
    thousands: '.',
    decimal: ','
  },
  abbreviations: {
    thousand: 'mila',
    million: 'mil',
    billion: 'b',
    trillion: 't'
  },
  ordinal(number) {
    return 'º'
  },
  currency: {
    symbol: '€'
  }
})

numeral.locale(window.navigator.language.split('-')[0])

export function formatDate(date) {
  return moment(date).format('DD/MM/YYYY')
}

export function formatNumber(num) {
  return numeral(num).format('0,0.00')
}
