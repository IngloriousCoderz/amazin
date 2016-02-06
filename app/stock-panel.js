riot.tag2('stock-panel', '<div class="panel"> <div class="heading"> <span class="title">Inventario</span> </div> <div class="content"> <form class="padding10"> <div class="grid no-margin"> <div class="row cells3"> <label class="cell padding10">Fornitore</label> <div class="input-control select cell colspan2"> <select onchange="{supplierChanged}"> <option>Scegli un fornitore...</option> <option value="nada">Nadalin</option> <option value="terminal">Terminal</option> </select> </div> </div> <div class="supplier" show="{supplier === \'nada\'}"> <div class="row cells3"> <label for="type" class="cell padding10">Tipo</label> <div class="input-control select cell colspan2"> <select onchange="{typeChanged}"> <option value="dvd" __selected="{type === \'dvd\'}">DVD</option> <option value="br" __selected="{type === \'br\'}">Blu-ray</option> <option value="ar" __selected="{type === \'ar\'}">A&amp;R</option> </select> </div> </div> </div> <div class="supplier" show="{supplier === \'terminal\'}"> <div class="row cells3"> <label for="type" class="cell padding10">Tipo</label> <div class="input-control select cell colspan2"> <select onchange="{typeChanged}"> <option value="all" __selected="{type === \'all\'}">Tutto</option> <option value="dvd" __selected="{type === \'dvd\'}">Home Video</option> <option value="books" __selected="{type === \'books\'}">Libri</option> <option value="merchandising" __selected="{type === \'merchandising\'}">Merchandising</option> <option value="music" __selected="{type === \'music\'}">Musica</option> </select> </div> </div> </div> <div class="input-control file full-size" data-role="input"> <input type="file" onchange="{fileChanged}"> <button class="button"> <span class="mif-folder"></span> </button> </div> <button class="button" onclick="{resetPreviousClicked}">Azzera precedente</button> <fieldset id="new-stock"> <legend>Nuovo inventario</legend> <button id="it" class="button" onclick="{newStockClicked}">IT</button> <button id="uk" class="button" onclick="{newStockClicked}">UK</button> <button id="fr" class="button" onclick="{newStockClicked}">FR</button> <button id="de" class="button" onclick="{newStockClicked}">DE</button> <button id="es" class="button" onclick="{newStockClicked}">ES</button> </fieldset> </div> </form> </div> </div>', '', '', function(opts) {

  var filesystem = require('./filesystem')
  var stock = require('./stock')

  this.supplierChanged = function(event) {
    this.supplier = event.target.value
  }.bind(this)

  this.typeChanged = function(event) {
    this.type = event.target.value
  }.bind(this)

  this.fileChanged = function(event) {
    var file = event.target.files[0]

    if (file.name.toLowerCase().indexOf('tutto') >= 0) {
      this.type = 'all'
    } else if (file.name.toLowerCase().indexOf('dvd') >= 0 || file.name.toLowerCase().indexOf('home_video') >= 0) {
      this.type = 'dvd'
    } else if (file.name.toLowerCase().indexOf('libri') >= 0) {
      this.type = 'books'
    } else if (file.name.toLowerCase().indexOf('merchandising') >= 0) {
      this.type = 'merchandising'
    } else if (file.name.toLowerCase().indexOf('musica') >= 0) {
      this.type = 'music'
    } else if (file.name.toLowerCase().indexOf('br') >= 0) {
      this.type = 'br'
    } else if (file.name.toLowerCase().indexOf('a&r') >= 0) {
      this.type = 'ar'
    }

    filesystem.cache(file, this.supplier + '_' + this.type)
  }.bind(this)

  this.resetPreviousClicked = function(event) {
    stock.resetPrevious(this.supplier, this.type)
  }.bind(this)

  this.newStockClicked = function(event) {
    var market = event.target.id
    stock.createStock(this.supplier, this.type, market)
  }.bind(this)
}, '{ }');
