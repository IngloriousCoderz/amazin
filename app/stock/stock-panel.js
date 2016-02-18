riot.tag2('stock-panel', '<div class="panel"> <div class="heading"> <span class="title">Inventario</span> </div> <div class="content"> <form class="padding10"> <div class="grid no-margin"> <div class="row cells3"> <label class="cell padding10">Fornitore</label> <div class="input-control select cell colspan2"> <select onchange="{storeChanged}"> <option value="">Scegli un fornitore...</option> <option value="nada">Nadalin</option> <option value="terminal">Terminal</option> <option value="discoteca">Discoteca Laziale</option> </select> </div> </div> <div class="row cells3" if="{isCurrent(\'nada\')}"> <label class="cell padding10">Tipo</label> <div class="input-control select cell colspan2"> <select onchange="{typeChanged}"> <option value="dvd" __selected="{type === \'dvd\'}">DVD</option> <option value="br" __selected="{type === \'br\'}">Blu-ray</option> <option value="ar" __selected="{type === \'a&amp;r\'}">A&amp;R</option> </select> </div> </div> <div class="row cells3" if="{isCurrent(\'terminal\')}"> <label class="cell padding10">Tipo</label> <div class="input-control select cell colspan2"> <select onchange="{typeChanged}"> <option value="all" __selected="{type === \'all\'}">Tutto</option> <option value="dvd" __selected="{type === \'dvd\'}">Home Video</option> <option value="books" __selected="{type === \'books\'}">Libri</option> <option value="merchandising" __selected="{type === \'merchandising\'}">Merchandising</option> <option value="music" __selected="{type === \'music\'}">Musica</option> </select> </div> </div> <div class="row cells3" if="{isCurrent(\'discoteca\')}"> <label class="cell padding10">Catalogo</label> <div class="input-control file cell colspan2" data-role="input"> <input type="file" onchange="{catalogFileChanged}"> <button class="button"> <span class="mif-folder"></span> </button> </div> </div> <div class="row cells3"> <label class="cell padding10">Stock</label> <div class="input-control file cell colspan2" data-role="input"> <input type="file" __disabled="{isCurrent(\'\') || missingCatalog()}" onchange="{fileChanged}"> <button class="button"> <span class="mif-folder"></span> </button> </div> </div> <button class="button" __disabled="{missingInput()}" onclick="{resetPreviousClicked}">Azzera precedente</button> <fieldset __disabled="{missingInput()}"> <legend>Nuovo inventario</legend> <button id="it" class="button" onclick="{newStockClicked}">IT</button> <button id="uk" class="button" onclick="{newStockClicked}">UK</button> <button id="fr" class="button" onclick="{newStockClicked}">FR</button> <button id="de" class="button" onclick="{newStockClicked}">DE</button> <button id="es" class="button" onclick="{newStockClicked}">ES</button> </fieldset> </div> </form> </div> </div>', '', '', function(opts) {
  var filesystem = require('../filesystem')
  var stock = require('./stock')

  this.store = ''

  this.isCurrent = function(store) {
    return this.store === store
  }.bind(this)

  this.missingCatalog = function() {
    return this.isCurrent('discoteca') && this.catalogFile === undefined
  }.bind(this)

  this.missingInput = function() {
    if (this.isCurrent('')) return true
    if (this.file === undefined) return true
    if (missingCatalog()) return true
  }.bind(this)

  this.storeChanged = function(event) {
    this.store = event.target.value
  }.bind(this)

  this.typeChanged = function(event) {
    this.type = event.target.value
  }.bind(this)

  this.catalogFileChanged = function(event) {
    this.catalogFile = event.target.files[0]
    var name = this.store + '_catalog'
    filesystem.read(this.catalogFile, function(results) {
      filesystem.cache(results, name)
    })
  }.bind(this)

  this.fileChanged = function(event) {
    this.file = event.target.files[0]
    var fileName = this.file.name.toLowerCase()

    if (fileName.indexOf('completo') >= 0) {
      this.type = 'stock'
    } else if (fileName.indexOf('tutto') >= 0) {
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
      this.type = 'a&r'
    }

    var name = this.store + '_' + this.type

    var self = this
    filesystem.read(this.file, function(results) {
      filesystem.cache(results, name, function() {
        stock.onCached(self.store, self.type)
      })
    })
  }.bind(this)

  this.resetPreviousClicked = function(event) {
    stock.resetPrevious(this.store, this.type)
  }.bind(this)

  this.newStockClicked = function(event) {
    var market = event.target.id
    stock.createStock(this.store, this.type, market)
  }.bind(this)
}, '{ }');
