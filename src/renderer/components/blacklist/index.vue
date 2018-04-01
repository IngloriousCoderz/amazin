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
