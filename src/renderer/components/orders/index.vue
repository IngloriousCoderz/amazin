<template>
<md-card>
  <md-card-header>
    <div class="md-title">Ordini</div>
  </md-card-header>

  <md-divider />

  <md-card-content>
    <md-field>
      <md-file placeholder="Carica un CSV" @change="fileChanged($event)" />
    </md-field>
    <md-button class="md-raised" :disabled="missingOrders" @click="salesListClicked">Elenco vendite</md-button>
    <md-button class="md-raised" :disabled="missingOrders" @click="shippingConfirmationClicked">Conferma spedizioni</md-button>
  </md-card-content>
</md-card>
</template>

<script>
import * as fs from '@/service/filesystem'
import * as orders from './orders'

export default {
  name: 'Orders',

  data() {
    return {
      missingOrders: true
    }
  },

  methods: {
    fileChanged(event) {
      const [file] = event.target.files
      fs.read(file)
        .then(results => fs.cache(results, 'orders'))
        .then(() => (this.missingOrders = false))
    },

    salesListClicked() {
      orders.createSalesList()
    },

    shippingConfirmationClicked() {
      orders.createShippingConfirmation()
    }
  }
}
</script>
