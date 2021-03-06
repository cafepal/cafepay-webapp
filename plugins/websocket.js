import Vue from 'vue'
import VueNativeSock from "vue-native-websocket";

export default function ({
  $config,
  store,
}) {
  Vue.use(VueNativeSock, `${$config.CAFEPAY_WEBAPP_SOCKET_URL}ws/v1/`, {
    connectManually: true,
    store: store, // connect to store
    reconnection: true, // (Boolean) whether to reconnect automatically (false)
    reconnectionAttempts: 5, // (Number) number of reconnection attempts before giving up (Infinity),
    reconnectionDelay: 3000 // (Number) how long to initially wait before attempting a new (1000)
  });
}