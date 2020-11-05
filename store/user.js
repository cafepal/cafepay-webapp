// user section includes 3 major Data-set 
// 1. user profile info can be A.retrieved B.updated C.created
// 2. user wallet transaction can be A.created (charge wallet)  B.retrieved
// 3. number that can be Changed
import Vue from 'vue'
import User from '../middleware/models/user'
import {
  Table
} from '../middleware/models/table'
export const state = () => ({
  history: {
    count: 0,
    data: [{}]
  },
  user: {

  }
})

export const getters = {

}

export const mutations = {
  set(state, user) {
    state.user = new User(user)
  },
  clear(state) {
    state.user = {}
  },
  setHistory(state, payload) {
          state.history.count = payload.res.count
          state.history.next = payload.res.next
          for (let i = 0; i < payload.res.results.length; i++) {
            let rawOrders = payload.res.results[i]
            console.log('products here', payload.products);
            let table = new Table(rawOrders, payload.products, this.state.user.id)
            state.history.data.push(table)

          }
          console.log('history res', state.history)
  }

}

export const actions = {

  getOrderHistory(context) {
    return new Promise((resolve, reject) => {

      this.$api.$get('/api/v1/user-profile/orders/history/', {
          params: {}
        }).then(res => {
          let products = this.state.cafe.categories.map(c => c.products)
          products = [].concat.apply([], products)
          context.commit('setHistory', {products, res})
          // context.commit('setHistoryOrder', res)
          resolve(res)
        })

        .catch(err => {
          reject(err)

        })
    })
  },

  retrieve(context) {
    return new Promise((resolve, reject) => {

      this.$api.$get('/api/v1/user-profile/', {
          params: {}
        }).then(res => {
          context.commit('set', res)
          resolve(res)
        })

        .catch(err => {
          reject(err)

        })
    })


  },

  sendCode(context) {
    return new Promise(() => {

    })
  }

}
