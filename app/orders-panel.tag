<orders-panel>
  <div class="panel">
    <div class="heading">
      <span class="title">Ordini</span>
    </div>

    <div class="content">
      <form class="padding10">
        <div class="input-control file full-size" data-role="input">
          <input type="file" onchange={ fileChanged }>
          <button class="button">
            <span class="mif-folder"></span>
          </button>
        </div>

        <div class="grid">
          <div class="row cells2">
            <button class="button cell" onclick={ salesListClicked }>
              Elenco vendite
            </button>
            <button class="button cell" onclick={ shippingConfirmationClicked }>
              Conferma spedizioni
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>

  var filesystem = require('./filesystem')
  var orders = require('./orders')

  fileChanged(event) {
    var file = event.target.files[0]
    var name = 'orders'
    filesystem.cache(file, name)
  }

  salesListClicked(event) {
    orders.createSalesList()
  }

  shippingConfirmationClicked(event) {
    orders.createShippingConfirmation()
  }
</orders-panel>
