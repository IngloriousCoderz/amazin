<template>
<div>
  <md-card>
    <md-card-header>
      <div class="md-title">Fatture</div>
    </md-card-header>

    <md-divider />

    <md-card-content>
      <div ref="invoices" class="md-layout">
        <div v-for="invoice in invoices" :key="invoice.number" class="md-layout-item invoice">
          <md-button class="md-icon-button md-dense remove-button" @click="onRemoveInvoice(invoice)"><md-icon>highlight_off</md-icon></md-button>
          <invoice :invoice="invoice" />
        </div>
      </div>
    </md-card-content>
  </md-card>

  <md-button class="md-fab md-fab-bottom-right md-primary" @click="onPrintPdf"><md-icon>picture_as_pdf</md-icon></md-button>
  <md-button class="md-fab md-fab-bottom-right md-plain" @click="onAddInvoice"><md-icon>add</md-icon></md-button>

  <md-dialog :md-active.sync="showDialog" @keyup.enter="onConfirm">
    <md-dialog-title>Nuova fattura</md-dialog-title>

    <md-divider />

    <md-dialog-content>
      <md-field>
        <label>Numero</label>
        <md-input type="number" v-model="invoice.number" />
      </md-field>

      <md-field>
        <label>Tipo</label>
        <md-select v-model="invoice.type">
          <md-option value="usato">Usato</md-option>
          <md-option value="nuovo">Nuovo</md-option>
        </md-select>
      </md-field>

      <md-datepicker v-model="invoice.date" lang="it" format="DD/MM/YYYY">
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

import Invoice from './invoice'

export default {
  name: 'Invoices',

  components: { Invoice },

  data() {
    return {
      showDialog: false,
      invoice: {
        number: 1,
        type: 'usato',
        date: new Date(),
        items: []
      },

      invoices: [
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
    onRemoveInvoice(invoice) {
      const index = this.invoices.findIndex(({number}) => number === invoice.number)
      this.invoices.splice(index, 1)
    },

    onAddInvoice() {
      this.showDialog = true
    },

    onPrintPdf() {
      html2pdf(this.$refs.invoices, {
        margin: 2,
        filename: 'fatture.pdf',
        html2canvas: { dpi: 192 },
        jsPDF: { orientation: 'landscape' }
      })
    },

    onCancel() {
      this.showDialog = false
    },

    onConfirm() {
      this.invoices.push(Object.assign({}, this.invoice, {date: moment(this.invoice.date).format('YYYY-MM-DD')}))
      this.invoice = Object.assign({}, this.invoice, {
        number: parseInt(this.invoice.number) + 1,
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
.invoice {
  max-width: 26em;
  position: relative;
  margin-top: 0.6em;
}
.invoice .remove-button {
  position: absolute;
  right: 0;
  display: none;
}
.invoice:hover .remove-button {
  display: initial;
}
.md-fab:nth-of-type(1) {
  margin-right: 5em !important;
}
</style>
