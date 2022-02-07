export default ({ app, store }) => {
  let localStorageToken = localStorage.getItem("token");
  if (!!localStorageToken && localStorageToken != 'null' && localStorageToken != 'undefined') {
    const cookieValObject = {'token': `${localStorageToken}`}
    // Works client side only
    const getDomainName = function() {
        let hostName = window.location.hostname;
        if(hostName == 'localhost' || Number(hostName.split('.')[0]) != NaN) {
          return hostName
        }
        return hostName.substring(hostName.lastIndexOf(".", hostName.lastIndexOf(".") - 1) + 1);
    }
    const domain = getDomainName();
    if(domain.includes('localhost') || ('0' <= domain[0] && domain[0] <= '9')) {
      app.$cookies.set('CafepayWebappToken', cookieValObject, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        domain,
      })
    } else {
      app.$cookies.set('CafepayWebappToken', cookieValObject, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        domain,
        sameSite: 'none',
        secure: true
      })
    }
  }

  let token = app.$cookies.get('CafepayWebappToken')
  if (!!token) store.commit('setToken', token.token)
  
  // let tableToken = localStorage.getItem('tableToken')
  // if (tableToken != 'undefined' && tableToken != 'null') {
  //   let tableName = localStorage.getItem('tableName')
  //   let table = {
  //     number: tableName,
  //     token: tableToken
  //   }
      
  //   store.commit('table/setToken', table)
  // }
}
// window.onNuxtReady(() => {
//   console.log('Nuxt.js is ready and mounted')
// })
