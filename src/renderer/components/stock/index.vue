<template>
<md-card>
  <md-card-header>
    <div class="md-title">Inventario</div>
  </md-card-header>

  <md-divider />

  <md-card-content>
    <md-field>
      <label>Fornitore</label>
      <md-select v-model="store">
        <md-option value="nada">Nadalin</md-option>
        <md-option value="terminal">Terminal</md-option>
        <md-option value="discoteca">Discoteca Laziale</md-option>
        <md-option value="centrol">Centro Libri</md-option>
        <md-option value="vario">Vario</md-option>
      </md-select>
    </md-field>

    <md-field v-if="isCurrentStore('nada')">
      <label>Tipo</label>
      <md-select v-model="type">
        <md-option value="dvd">DVD</md-option>
        <md-option value="br">Blu-ray</md-option>
        <md-option value="a&amp;r">A&amp;R</md-option>
      </md-select>
    </md-field>

    <md-field v-if="isCurrentStore('terminal')">
      <label>Tipo</label>
      <md-select v-model="type">
        <md-option value="all">Tutto</md-option>
        <md-option value="dvd">DVD</md-option>
        <md-option value="books">Libri</md-option>
        <md-option value="merchandising">Merchandising</md-option>
        <md-option value="music">Musica</md-option>
      </md-select>
    </md-field>

    <md-field v-if="isCurrentStore('centrol')">
      <label>Tipo</label>
      <md-select v-model="type">
        <md-option value="scolastica">Scolastica</md-option>
        <md-option value="varia">Varia</md-option>
      </md-select>
    </md-field>
  </md-card-content>

  <md-divider />

  <md-card-content>
    <md-subheader>
      Azzera precedente
    </md-subheader>

    <md-field>
      <md-select v-model="previousStock" :disabled="missingStore || missingType">
        <md-option v-for="stock in cachedStocks" :key="stock.filename" :value="stock.filename">{{stock.date}}</md-option>
      </md-select>
    </md-field>
    <md-button class="md-raised" :disabled="missingPreviousStock" @click="resetStockClicked">Azzera</md-button>
  </md-card-content>

  <md-divider />

  <md-card-content>
    <md-subheader>
      Nuovo inventario
    </md-subheader>

    <md-field v-if="needsCatalogFile">
      <md-file placeholder="Catalogo" v-model="catalogFile" @change="catalogFileChanged($event)" />
    </md-field>

    <md-field>
      <md-file placeholder="Giacenze" v-model="stockFile" :disabled="missingStore || missingCatalogFile" @change="stockFileChanged($event)" />
    </md-field>

    <md-button class="md-raised" :disabled="missingInput" @click="newStockClicked('it')">IT</md-button>
    <md-button class="md-raised" :disabled="missingInput" @click="newStockClicked('uk')">UK</md-button>
    <md-button class="md-raised" :disabled="missingInput" @click="newStockClicked('fr')">FR</md-button>
    <md-button class="md-raised" :disabled="missingInput" @click="newStockClicked('de')">DE</md-button>
    <md-button class="md-raised" :disabled="missingInput" @click="newStockClicked('es')">ES</md-button>
    </fieldset>
  </md-card-content>
</md-card>
</template>

<script>
import * as fs from '@/service/filesystem'
import * as stock from './stock'

export default {
  name: 'Stock',

  data() {
    return {
      store: null,
      type: null,
      previousStock: null,
      catalogFile: null,
      stockFile: null
    }
  },

  computed: {
    missingStore() {
      return this.isCurrentStore(null)
    },

    missingType() {
      return !this.isCurrentStore('vario') && this.isCurrentType(null)
    },

    missingPreviousStock() {
      return this.previousStock == null
    },

    missingStockFile() {
      return this.stockFile == null
    },

    needsCatalogFile() {
      return this.isCurrentStore('discoteca') || this.isCurrentStore('centrol')
    },

    missingCatalogFile() {
      return this.needsCatalogFile && this.catalogFile == null
    },

    missingInput() {
      return (
        this.missingStore || this.missingCatalogFile || this.missingStockFile
      )
    },

    cachedStocks() {
      return stock.getCachedStocks(this.store, this.type).map(stock => {
        const leftIndex = stock.indexOf('T') > 0 ? -21 : -15
        return {
          date: stock.slice(leftIndex, -5).replace('T', ' '),
          filename: stock
        }
      })
    }
  },

  watch: {
    store() {
      this.type = this.isCurrentStore('discoteca') ? 'stock' : null
      this.previousStock = null
      this.stockFile = null
    }
  },

  methods: {
    isCurrentStore(store) {
      return store === this.store
    },

    isCurrentType(type) {
      return type === this.type
    },

    isPreviousStock(stock) {
      return stock === this.previousStock
    },

    catalogFileChanged(event) {
      const [file] = event.target.files
      this.type = this.getTypeFromFile(file)
      const name = `${this.store}_${this.type}_catalog`
      fs.read(file, results => fs.cache(results, name))
    },

    stockFileChanged(event) {
      const [file] = event.target.files
      this.type = this.getTypeFromFile(file)
      const name = `${this.store}_${this.type}_stock`
      fs.read(file, results =>
        fs.cache(results, name, () => stock.onCached(this.store, this.type))
      )
    },

    newStockClicked(market) {
      stock.createStock(this.store, this.type, market)
    },

    resetStockClicked() {
      stock.resetStock(this.store, this.type, this.previousStock)
    },

    getTypeFromFile(file) {
      const filename = file.name.toLowerCase()

      if (filename.includes('completo')) {
        return 'stock'
      }

      if (filename.includes('tutto')) {
        return 'all'
      }

      if (filename.includes('dvd') || filename.includes('home_video')) {
        return 'dvd'
      }

      if (filename.includes('libri')) {
        return 'books'
      }

      if (filename.includes('merchandising')) {
        return 'merchandising'
      }

      if (filename.includes('musica')) {
        return 'music'
      }

      if (filename.includes('br')) {
        return 'br'
      }

      if (filename.includes('a&r')) {
        return 'a&r'
      }

      if (filename.includes('scolastica')) {
        return 'scolastica'
      }

      if (filename.includes('varia')) {
        return 'varia'
      }

      return this.type
    }
  }
}
</script>
