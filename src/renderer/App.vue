<template>
<md-app>
  <md-app-toolbar class="md-primary">
    <h1 class="md-title">Amazin</h1>
  </md-app-toolbar>

  <md-app-drawer md-permanent="clipped">
    <md-list>
      <md-list-item>
        <md-icon>store_mall_directory</md-icon>
        <router-link to="orders" class="md-list-item-text">Ordini</router-link>
      </md-list-item>

      <md-list-item>
        <md-icon>local_grocery_store</md-icon>
        <router-link to="stock" class="md-list-item-text">Inventario</router-link>
      </md-list-item>
    </md-list>
  </md-app-drawer>

  <md-app-content>
    <router-view></router-view>
  </md-app-content>
</md-app>
</template>

<script>
export default {
  name: 'amazin'
}
</script>

<style scoped>
.md-app {
  height: 100vh;
}

.md-drawer {
  width: 230px;
  max-width: calc(100vw - 125px);
}
</style>
