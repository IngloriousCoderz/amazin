riot.tag2('orders-panel', '<div class="panel"> <div class="heading"> <span class="title">Ordini</span> </div> <div class="content"> <form class="padding10"> <div class="input-control file full-size" data-role="input"> <input type="file" onchange="{fileChanged}"> <button class="button"> <span class="mif-folder"></span> </button> </div> <div class="grid"> <div class="row cells2"> <button class="button cell" onclick="{salesListClicked}"> Elenco vendite </button> <button class="button cell" onclick="{shippingConfirmationClicked}"> Conferma spedizioni </button> </div> </div> </form> </div> </div>', '', '', function(opts) {
  var filesystem = require('../filesystem')
  var orders = require('./orders')

  this.fileChanged = function(event) {
    var file = event.target.files[0]
    var name = 'orders'
    filesystem.cache(file, name)
  }.bind(this)

  this.salesListClicked = function(event) {
    orders.createSalesList()
  }.bind(this)

  this.shippingConfirmationClicked = function(event) {
    orders.createShippingConfirmation()
  }.bind(this)
}, '{ }');
