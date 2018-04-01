<template>
  <div id="invoice">
    <table>
      <colgroup>
        <col style="width:25%" />
        <col style="width:30%" />
        <col style="width:20%" />
        <col style="width:25%" />
      </colgroup>
      <tr>
        <td colspan="4" class="text-center strong title">LA BOUTIQUE di Tenenti Bianca</td>
      </tr>
      <tr>
        <td colspan="4" class="text-center">Viale Buridani 34, 10078 Venaria Reale (TO)</td>
      </tr>
      <tr>
        <td colspan="4" class="text-center">C.F. TNNBNC62B46L219P P.IVA 11116990018</td>
      </tr>
      <tr>
        <td class="strong">Ricevuta n.</td>
        <td>
          <input type="number" v-model="invoice.number" />
        </td>
        <td/>
        <td>
          <select v-model="invoice.type" class="strong shouted">
            <option value="usato">Usato</option>
            <option value="nuovo">Nuovo</option>
          </select>
        </td>
      </tr>
      <tr>
        <td>Data</td>
        <td colspan="3">
          {{formattedDate}}
          <!-- <input type="date" v-model="invoice.date" /> -->
        </td>
      </tr>
    </table>

    <table class="bordered">
      <tr>
        <th>Cod.</th>
        <th>Q.tà</th>
        <th>Descrizione</th>
        <th>Prezzo</th>
        <th>Importo</th>
      </tr>

      <item v-for="(item, index) in invoice.items" :key="index" :item="item" />

      <tr>
        <td rowspan="2" colspan="4" class="strong">ES. IVA ART. 36 D.L. 41/95 - REGIME DEL  MARGINE BENI USATI</td>
        <td/>
      </tr>
      <tr>
        <td/>
      </tr>
      <tr>
        <td colspan="3"></td>
        <td>Totale €</td>
        <td class="text-right">{{total}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import moment from 'moment'

import Item from './item'

export default {
  props: ['invoice'],

  components: { Item },

  mounted() {
    this.invoice.items = [
      ...this.invoice.items,
      ...Array.from(
        {length: 4 - this.invoice.items.length},
        () => ({})
      )
    ]
  },

  computed: {
    formattedDate() {
      return moment(this.invoice.date).format('DD/MM/YYYY')
    },

    total() {
      return this.invoice.items.reduce((sum, item) => (sum += this.amount(item)), 0).toFixed(2)
    }
  },

  methods: {
    formatPrice(price) {
      return String(price.toFixed(2)).replace('.', ',')
    },

    amount({quantity, price}) {
      return quantity != null && price != null ? quantity * price : 0
    }
  }
}
</script>

<style scoped>
#invoice {
  width: 24em;
  line-height: 1em;
  margin: 0 auto;
}
#invoice > table:nth-of-type(1) {
  table-layout: fixed;
}
</style>
