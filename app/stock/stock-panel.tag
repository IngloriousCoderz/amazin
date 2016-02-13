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
                <option>Scegli un fornitore...</option>
                <option value="nada">Nadalin</option>
                <option value="terminal">Terminal</option>
              </select>
            </div>
          </div>

          <div class="store" show={ store === 'nada' }>
            <div class="row cells3">
              <label class="cell padding10">Tipo</label>
              <div class="input-control select cell colspan2">
                <select onchange={ typeChanged }>
                  <option value="dvd" selected={ type === 'dvd' }>DVD</option>
                  <option value="br" selected={ type === 'br' }>Blu-ray</option>
                  <option value="ar" selected={ type === 'ar' }>A&amp;R</option>
                </select>
              </div>
            </div>
          </div>

          <div class="store" show={ store === 'terminal' }>
            <div class="row cells3">
              <label class="cell padding10">Tipo</label>
              <div class="input-control select cell colspan2">
                <select onchange={ typeChanged }>
                  <option value="all" selected={ type === 'all' }>Tutto</option>
                  <option value="dvd" selected={ type === 'dvd' }>Home Video</option>
                  <option value="books" selected={ type === 'books' }>Libri</option>
                  <option value="merchandising" selected={ type === 'merchandising' }>Merchandising</option>
                  <option value="music" selected={ type === 'music' }>Musica</option>
                </select>
              </div>
            </div>
          </div>

          <div class="input-control file full-size" data-role="input">
            <input type="file" onchange={ fileChanged }>
            <button class="button">
              <span class="mif-folder"></span>
            </button>
          </div>

          <button class="button" onclick={ resetPreviousClicked }>Azzera precedente</button>
          <fieldset>
            <legend>Nuovo inventario</legend>
            <button id="it" class="button" onclick={ newStockClicked }>IT</button>
            <button id="uk" class="button" onclick={ newStockClicked }>UK</button>
            <button id="fr" class="button" onclick={ newStockClicked }>FR</button>
            <button id="de" class="button" onclick={ newStockClicked }>DE</button>
            <button id="es" class="button" onclick={ newStockClicked }>ES</button>
          </fieldset>
        </div>
      </form>
    </div>
  </div>

  <script>
  var filesystem = require('../filesystem')
  var stock = require('./stock')

  storeChanged(event) {
    this.store = event.target.value
  }

  typeChanged(event) {
    this.type = event.target.value
  }

  fileChanged(event) {
    var file = event.target.files[0]
    var fileName = file.name.toLowerCase()

    if (fileName.indexOf('tutto') >= 0) {
      this.type = 'all'
    } else if (fileName.indexOf('dvd') >= 0 || fileName.indexOf('home_video') >= 0) {
      this.type = 'dvd'
    } else if (fileName.indexOf('libri') >= 0) {
      this.type = 'books'
    } else if (fileName.indexOf('merchandising') >= 0) {
      this.type = 'merchandising'
    } else if (fileName.indexOf('musica') >= 0) {
      this.type = 'music'
    } else if (fileName.indexOf('br') >= 0) {
      this.type = 'br'
    } else if (fileName.indexOf('a&r') >= 0) {
      this.type = 'ar'
    }

    filesystem.cache(file, this.store + '_' + this.type)
  }

  resetPreviousClicked(event) {
    stock.resetPrevious(this.store, this.type)
  }

  newStockClicked(event) {
    var market = event.target.id
    stock.createStock(this.store, this.type, market)
  }
  </script>
</stock-panel>
