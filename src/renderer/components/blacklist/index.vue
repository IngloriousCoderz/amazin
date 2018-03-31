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
  name: 'Orders',

  data() {
    return {
      blacklistUpdated: false
    }
  },

  methods: {
    fileChanged(event) {
      const [file] = event.target.files
      fs.read(file)
        .then(results => fs.cache(results, 'blacklist'))
        .then(() => (this.blacklistUpdated = true))
    }
  }
}
</script>
