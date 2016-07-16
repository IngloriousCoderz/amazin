<stock-panel>
  <div class="panel">
    <div class="heading">
      <span class="title">Inventario</span>
    </div>

    <div class="content">
      <form class="padding10">
        <div class="grid no-margin">
          <div class="row cells3">
            <label class="cell padding10">Fornitore</label>
            <div class="input-control select cell colspan2">
              <select onchange={ storeChanged }>
                <option value="">Scegli un fornitore...</option>
                <option value="nada">Nadalin</option>
                <option value="terminal">Terminal</option>
                <option value="discoteca">Discoteca Laziale</option>
                <option value="centrol">Centro Libri</option>
                <option value="vario">Vario</option>
              </select>
            </div>
          </div>

          <div class="row cells3" if={ isCurrentStore('nada') }>
            <label class="cell padding10">Tipo</label>
            <div class="input-control select cell colspan2">
              <select onchange={ typeChanged }>
                <option value="" selected={ isCurrentType('') }>Scegli un tipo...</option>
                <option value="dvd" selected={ isCurrentType('dvd') }>DVD</option>
                <option value="br" selected={ isCurrentType('br') }>Blu-ray</option>
                <option value="a&amp;r" selected={ isCurrentType('a&amp;r') }>A&amp;R</option>
              </select>
            </div>
          </div>

          <div class="row cells3" if={ isCurrentStore('terminal') }>
            <label class="cell padding10">Tipo</label>
            <div class="input-control select cell colspan2">
              <select onchange={ typeChanged }>
                <option value="" selected={ isCurrentType('') }>Scegli un tipo...</option>
                <option value="all" selected={ isCurrentType('all') }>Tutto</option>
                <option value="dvd" selected={ isCurrentType('dvd') }>Home Video</option>
                <option value="books" selected={ isCurrentType('books') }>Libri</option>
                <option value="merchandising" selected={ isCurrentType('merchandising') }>Merchandising</option>
                <option value="music" selected={ isCurrentType('music') }>Musica</option>
              </select>
            </div>
          </div>

          <div class="row cells3" if={ isCurrentStore('centrol') }>
            <label class="cell padding10">Tipo</label>
            <div class="input-control select cell colspan2">
              <select onchange={ typeChanged }>
                <option value="" selected={ isCurrentType('') }>Scegli un tipo...</option>
                <option value="scolastica" selected={ isCurrentType('scolastica') }>Scolastica</option>
                <option value="varia" selected={ isCurrentType('varia') }>Varia</option>
              </select>
            </div>
          </div>

          <fieldset class="row cells3" disabled={ missingStore() || missingType() }>
            <legend>Azzera precedente</legend>
            <div class="input-control select cell colspan2 no-margin-left">
              <select onchange={ previousStockSelected }>
                <option value="" selected={ isPreviousStock('') }>Scegli una data...</option>
                <option each={ stock in getCachedStocks() } value={ stock.fileName } selected={ isPreviousStock(stock.fileName) }>{ stock.date }</option>
              </select>
            </div>
            <button class="button cell" disabled={ missingPreviousStock() } onclick={ resetStockClicked }>Azzera</button>
          </fieldset>

          <fieldset>
            <legend>Nuovo inventario</legend>

            <div class="row cells3" if={ isCurrentStore('discoteca') }>
              <label class="cell padding10">Catalogo</label>
              <div class="input-control file cell colspan2" data-role="input">
                <input type="file" onchange={ catalogFileChanged }>
                <button class="button">
                  <span class="mif-folder"></span>
                </button>
              </div>
            </div>

            <div class="row cells3" if={ isCurrentStore('centrol') }>
              <label class="cell padding10">Catalogo</label>
              <div class="input-control file cell colspan2" data-role="input">
                <input type="file" onchange={ catalogFileChanged }>
                <button class="button">
                  <span class="mif-folder"></span>
                </button>
              </div>
            </div>

            <div class="row cells3">
              <label class="cell padding10">Giacenze</label>
              <div class="input-control file cell colspan2" data-role="input">
                <input type="file" disabled={ missingStore() || missingCatalogFile() } onchange={ stockFileChanged }>
                <button class="button">
                  <span class="mif-folder"></span>
                </button>
              </div>
            </div>

            <button id="it" class="button" disabled={ missingInput() } onclick={ newStockClicked }>IT</button>
            <button id="uk" class="button" disabled={ missingInput() } onclick={ newStockClicked }>UK</button>
            <button id="fr" class="button" disabled={ missingInput() } onclick={ newStockClicked }>FR</button>
            <button id="de" class="button" disabled={ missingInput() } onclick={ newStockClicked }>DE</button>
            <button id="es" class="button" disabled={ missingInput() } onclick={ newStockClicked }>ES</button>
          </fieldset>
        </div>
      </form>
    </div>
  </div>

  <script>
  var filesystem = require('../filesystem')
  var stock = require('./stock')

  this.store = ''
  this.type = ''
  this.previousStock = ''

  isCurrentStore(store) {
    return this.store === store
  }

  isCurrentType(type) {
    return this.type === type
  }

  isPreviousStock(stock) {
    return this.previousStock === stock
  }

  missingStore() {
    return this.isCurrentStore('')
  }

  missingType() {
    return this.isCurrentType('')
  }

  missingPreviousStock() {
    return this.previousStock === ''
  }

  missingCatalogFile() {
    return (this.isCurrentStore('discoteca')|| this.isCurrentStore('centrol')) && this.catalogFile === undefined
  }

  missingStockFile() {
    return typeof this.stockFile === 'undefined'
  }

  missingInput() {
    return this.missingStore() || this.missingStockFile() || this.missingCatalogFile()
  }

  storeChanged(event) {
    this.store = event.target.value
    this.type = this.isCurrentStore('discoteca') ? 'stock' : ''
    this.previousStock = ''
    this.stockFile = undefined
  }

  typeChanged(event) {
    this.type = event.target.value
  }

  catalogFileChanged(event) {
    this.catalogFile = event.target.files[0]
    this.type = this.getTypeFromFile(this.catalogFile)

    var name = this.store  + '_' + this.type + '_catalog'
    filesystem.read(this.catalogFile, function(results) {
      filesystem.cache(results, name)
    })
  }

  stockFileChanged(event) {
    this.stockFile = event.target.files[0]
    this.type = this.getTypeFromFile(this.stockFile)

    var name = this.store + '_' + this.type + '_stock'

    var self = this
    filesystem.read(this.stockFile, function(results) {
      filesystem.cache(results, name, function() {
        stock.onCached(self.store, self.type)
      })
    })
  }

  newStockClicked(event) {
    var market = event.target.id
    stock.createStock(this.store, this.type, market)
  }

  getCachedStocks() {
    return stock.getCachedStocks(this.store, this.type).map(function(stock) {
      return {
        date: stock.slice(-15, -5),
        fileName: stock
      }
    })
  }

  previousStockSelected(event) {
    this.previousStock = event.target.value
  }

  resetStockClicked(event) {
    stock.resetStock(this.store, this.type, this.previousStock)
  }

  getTypeFromFile(file)  {
    var fileName = file.name.toLowerCase()
    var type = this.type
    if (type !== '') {
      return type
    }

    if (fileName.indexOf('completo') >= 0) {
      type = 'stock'
    } else if (fileName.indexOf('tutto') >= 0) {
      type = 'all'
    } else if (fileName.indexOf('dvd') >= 0 || fileName.indexOf('home_video') >= 0) {
      type = 'dvd'
    } else if (fileName.indexOf('libri') >= 0) {
      type = 'books'
    } else if (fileName.indexOf('merchandising') >= 0) {
      type = 'merchandising'
    } else if (fileName.indexOf('musica') >= 0) {
      type = 'music'
    } else if (fileName.indexOf('br') >= 0) {
      type = 'br'
    } else if (fileName.indexOf('a&r') >= 0) {
      type = 'a&r'
    } else if (fileName.indexOf('scolastica') >= 0) {
      type = 'scolastica'
    } else if (fileName.indexOf('varia') >= 0) {
      type = 'varia'
    }

    return type
  }

  </script>
</stock-panel>
