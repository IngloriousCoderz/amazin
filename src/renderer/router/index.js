import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/orders',
      name: 'orders',
      component: require('@/components/orders').default
    },
    {
      path: '/stock',
      name: 'stock',
      component: require('@/components/stock').default
    },
    {
      path: '/blacklist',
      name: 'blacklist',
      component: require('@/components/blacklist').default
    },
    {
      path: '*',
      redirect: '/orders'
    }
  ]
})
