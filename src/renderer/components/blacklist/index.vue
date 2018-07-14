<template>
<md-card>
  <md-card-header>
    <div class="md-title">Blacklist</div>
  </md-card-header>

  <md-divider />

  <md-card-content>
    <md-field>
      <md-file placeholder="Carica un CSV" @change="fileChanged($event)" />
    </md-field>

    <div>
      <strong>Esempio:</strong>

      <div class="overflow">
        <table class="bordered">
          <tr>
            <th>sku</th>
          </tr>
          <tr>
            <td>28948042333</td>
          </tr>
          <tr>
            <td>50087334680</td>
          </tr>
        </table>
      </div>

      <small>NB: L'ordine dei campi è irrilevante, il nome sull'header invece deve essere indicato in modo preciso. Campi extra verranno ignorati.</small>
    </div>

    <md-snackbar :md-active.sync="blacklistUpdated">
      <span>Blacklist aggiornata.</span>
    </md-snackbar>
  </md-card-content>
</md-card>
</template>

<script>
import * as fs from '@/service/filesystem'

export default {
  name: 'Blacklist',

  data() {
    return {
      blacklistUpdated: false
    }
  },

  methods: {
    async fileChanged(event) {
      const [file] = event.target.files
      const results = await fs.read(file)
      await fs.cache(results, 'blacklist')
      this.blacklistUpdated = true
    }
  }
}
</script>
