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

    <p>
      <strong>Esempio:</strong>

      <div class="overflow">
        <table class="bordered">
          <tr>
            <th>product-name</th><th>sku</th><th>item-price</th><th>recipient-name</th><th>ship-address-1</th><th>ship-address-2</th><th>ship-address-3</th><th>ship-postal-code</th><th>ship-city</th><th>ship-state</th><th>ship-country</th><th>ship-phone-number</th><th>shipping-price</th><th>order-id</th>
          </tr>
          <tr>
            <td>Terrore E Terrore [DVD] [2010]</td><td>FRA_8017229467974_NX</td><td>5.85</td><td>Giancarlo Battaglia</td><td>piazzale Ostiense, 2</td><td></td><td></td><td>00154</td><td>Roma</td><td>RM</td><td>IT</td><td>3297062967</td><td>2.90</td><td>171-0235576-5898744</td>
          </tr>
          <tr>
            <td>Blow [DVD] [2006]</td><td>GY-7RPG-7CAJ</td><td>14.84</td><td>Stefano Torosani</td><td>Via molino vecchio 77</td><td></td><td></td><td>25010</td><td>Borgosatollo</td><td>Brescia</td><td>IT</td><td>3298966551</td><td>2.90</td><td>403-9281433-7740348</td>
          </tr>
        </table>
      </div>

      <small>NB: L'ordine dei campi è irrilevante, il nome sull'header invece deve essere indicato in modo preciso. Campi extra verranno ignorati.</small>
    </p>
    
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
    async fileChanged(event) {
      const [file] = event.target.files
      const results = await fs.read(file)
      await fs.cache(results, 'orders')
      this.missingOrders = false
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
