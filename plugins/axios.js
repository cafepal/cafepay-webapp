export default function ({
  $axios,
  store,
  $buefy
}, inject) {


  // if (process.client) {}
  

  const api = $axios.create()


  api.onRequest(req => {
    store.commit("toggleLoading", true)
    req.headers.common['Authorization'] = `Token ${store.state.token}`
  })


  api.onResponse(res => {
    store.commit("toggleLoading", false)
  })

  api.onError(error => {
    store.commit("toggleLoading", false)
    if (error.response) {
      const code = parseInt(error.response && error.response.status)

    } else {
      store.commit("errorMsg", {
        message: 'خطا در اتصال به اینترنت'
      })
    }
  })

  $axios.onRequest(config => {
    store.commit("toggleLoading", true)
  })

  $axios.onResponse(res => {
    store.commit("toggleLoading", false)
  })

  $axios.onError(error => {
    store.commit("toggleLoading", false)
    if (error.response) {
      const code = parseInt(error.response && error.response.status)

    } else {
      store.commit("errorMsg", {
        message: 'خطا در اتصال به اینترنت'
      })
    }
  })
  inject('api', api)
}
