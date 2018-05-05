<template>
<div>
  <md-card>
    <md-card-header>
      <div class="md-title">Ricevute</div>
    </md-card-header>

    <md-divider />

    <md-card-content>
      <div ref="receipts" class="md-layout">
        <div v-for="receipt in receipts" :key="receipt.number" class="md-layout-item receipt">
          <md-button class="md-icon-button md-dense remove-button" @click="onRemoveReceipt(receipt)"><md-icon>highlight_off</md-icon></md-button>
          <receipt :receipt="receipt" />
        </div>
      </div>
    </md-card-content>
  </md-card>

  <md-button class="md-fab md-fab-bottom-right md-primary" @click="onPrintPdf"><md-icon>picture_as_pdf</md-icon></md-button>
  <md-button class="md-fab md-fab-bottom-right md-plain" @click="onAddReceipt"><md-icon>add</md-icon></md-button>

  <md-dialog :md-active.sync="showDialog" @keyup.enter="onConfirm">
    <md-dialog-title>Nuova ricevuta</md-dialog-title>

    <md-divider />

    <md-dialog-content>
      <md-field>
        <label>Numero</label>
        <md-input type="number" v-model="receipt.number" />
      </md-field>

      <md-field>
        <label>Tipo</label>
        <md-select v-model="receipt.type">
          <md-option value="usato">Usato</md-option>
          <md-option value="nuovo">Nuovo</md-option>
        </md-select>
      </md-field>

      <md-datepicker v-model="receipt.date" lang="it" format="DD/MM/YYYY">
        <label>Data</label>
      </md-datepicker>
    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary" @click="onCancel">Annulla</md-button>
      <md-button class="md-primary md-raised" @click="onConfirm">Ok</md-button>
    </md-dialog-actions>
  </md-dialog>
</div>
</template>

<script>
import moment from 'moment'
import html2pdf from 'html2pdf.js'

import Receipt from './receipt'

export default {
  name: 'Receipts',

  components: { Receipt },

  data() {
    return {
      showDialog: false,
      receipt: {
        number: 1,
        type: 'usato',
        date: new Date(),
        items: []
      },

      receipts: [
        // {
        //   number: 306,
        //   type: 'usato',
        //   date: '2017-11-11',
        //   items: [{
        //     quantity: 1,
        //     description: 'DVD',
        //     price: 7.17
        //   }, {
        //     quantity: 2,
        //     description: 'Blue-Ray',
        //     price: 8
        //   }]
        // }, {
        //   number: 307,
        //   type: 'usato',
        //   date: '2017-11-11',
        //   items: [{
        //     quantity: 1,
        //     description: 'dvd',
        //     price: 9.62
        //   }]
        // }, {
        //   number: 308,
        //   type: 'usato',
        //   date: '2017-11-11',
        //   items: [{
        //     quantity: 1,
        //     description: 'DVD',
        //     price: 33.36
        //   }]
        // }
      ]
    }
  },

  methods: {
    onRemoveReceipt(receipt) {
      const index = this.receipts.findIndex(({number}) => number === receipt.number)
      this.receipts.splice(index, 1)
    },

    onAddReceipt() {
      this.showDialog = true
    },

    onPrintPdf() {
      html2pdf(this.$refs.receipts, {
        margin: 2,
        filename: 'ricevute.pdf',
        html2canvas: { dpi: 192 },
        jsPDF: { orientation: 'landscape' }
      })
    },

    onCancel() {
      this.showDialog = false
    },

    onConfirm() {
      this.receipts.push(Object.assign({}, this.receipt, {date: moment(this.receipt.date).format('YYYY-MM-DD')}))
      this.receipt = Object.assign({}, this.receipt, {
        number: parseInt(this.receipt.number) + 1,
        type: 'usato',
        items: []
      })
      this.showDialog = false
    }
  }
}
</script>

<style scoped>
.md-card {
  margin-bottom: 8em;
}
.receipt {
  max-width: 26em;
  position: relative;
  margin-top: 0.6em;
}
.receipt .remove-button {
  position: absolute;
  right: 0;
  display: none;
}
.receipt:hover .remove-button {
  display: initial;
}
.md-fab:nth-of-type(1) {
  margin-right: 5em !important;
}
</style>
