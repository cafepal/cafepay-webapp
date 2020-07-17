import Vue from 'vue'

Vue.mixin({
    data() {
      return {
        baseUrl: 'https://cafepay.app/',
        cloading: false,
        colors: {
          primary: '#009fe3',
          secondary: '#E91E63',
          thirdinary: '#006FB9',
          black: '#4a4a4a',
          darkGrey: '#595959',
          grey: '#717070',
          lightGrey: '#E4E4E4',
          lightblue: '#29abe2',
          blueShade: '#F2F6F9',
          green: '#20BC32',
          purple: '#8e24aa',
        }
      }
    },

    methods: {
        toaster (massage, type , position) {
            this.$buefy.toast.open({
                duration: 3000,
                message: massage,
                position,
                type: type
            })
        }
    },
    mounted(){
      
      // if (this.token !== null && this.user == null) {
        // this.$store.dispatch('user/retrive')
      // }
    },
    computed: {
      // cloading (){
      //     return this.$store.state.loading
      // },
      hasActiveTable() {
        return this.$store.state.hasActiveTable
      },
      token() {
        return this.$store.state.token
      },
      globalLoading() {
        return this.$store.state.globalLoading
      },
      user() {
        return this.$store.state.user.user
      }
    },
    watch: {
      // token(newValue, oldValue) {
        
      // },
    },
})