<template>
<tr>
  <td><input type="text" v-model="item.sku" /></td>
  <td class="text-right"><input type="number" v-model="item.quantity" /></td>
  <td><input type="text" v-model="item.description" /></td>
  <td class="text-right"><input type="number" step="0.01" v-model="item.price" /></td>
  <td class="text-right">{{amount}}</td>
</tr>
</template>

<script>
import { formatNumber } from '@/service/i18n'

export default {
  props: ['item'],

  computed: {
    amount() {
      const { quantity, price } = this.item
      return quantity != null && price != null
        ? formatNumber(quantity * price)
        : ''
    }
  },

  watch: {}
}
</script>
