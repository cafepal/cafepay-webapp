<template>
  <div>
    <v-tour
      name="menuTour"
      :steps="steps"
      :options="myOptions"
      :callbacks="myCallbacks"
    ></v-tour>
    <div
      id="selected-products-preview"
      class="selected-products-preview-is-shown"
    >
      <b-button
        :disabled="!showSubmitBtn"
        @click="sumbitOnTable"
        :loading="globalLoading"
        class="button bcp-btn cp-btn-submit-order shadow-lg-bb"
        size="is-medium"
        type="is-info"
        >ثبت سفارشات</b-button
      >
    </div>


    <div class="category-navigation">

      <div class="search-wrapper"    :class="{'search-expanded': searchExpandActive}">
      <div
        v-if="menu.length > 0"
        :class="{'shadow-md': searchExpandActive}"
        class="radio-button category-navigation__search shadow-sm"
      >
        <input
          @input="emitSearch"
          v-model="searchParam"
          ref="searchInput"
          id="search-input"
          type="text"
        />
        <img
          v-if="!searchExpandActive"
          @click="expandSearchBox"
          src="@/assets/img/shape/icons/search-bold-p.png"
          alt=""
        />
        <img
          id="search-close"
          v-if="searchExpandActive"
          @click="expandSearchBox"
          src="@/assets/img/shape/icons/close.png"
          alt=""
        />
      </div>
      </div>

       <div class="category-navigation__list">

      <div
        class="category-item-wrapper"
        v-for="(cat, index) in menu"
        :key="cat.name"
      >
        <!-- cat.products.length > 0 means if category has products then show it. it's for category -->
        <!-- that is reserved for myOrders Category -->
        <div
          v-if="cat.products.length > 0"
          class="category-item"
          :class="{
            'active-category': index == activeCategory,
            'current-order-category': index == 0,
            'shadow-none': index == 0
          }"
          @click="changeActiveCategory(index)"
        >
          {{ cat.name }}
        </div>
      </div>
    </div>


    </div>

    <div v-if="searchExpandActive" class="search-result">
      <p>محصولات: <span class="font-18 font-norm">{{searchResultCount}}</span></p>
      <img src="@/assets/img/shape/icons/searching.png" alt="">
    </div>

   
    <!-- <transition-group :name="slideTransition" tag="div" class=""> -->
      <product-list @updateSearch='updateSearch' :filtered="true" v-if="searchExpandActive" 
      key="filteredMenu" :menu="filteredMenu" />
      <product-list :filtered="false" v-else key="normalMenu" :menu="menu" />
    <!-- </transition-group> -->
  </div>
</template>

<script>
import { Order } from '~/middleware/models/cafe.js'
import { swipable } from '@/plugins/makeTabSwipe.js'
import productDefaultImage from '@/assets/img/product-default.png'
import productList from '@/components/cafe/productList.vue'
export default {
  components: {productList},
  props: {
    menu: {
      default: 3
    },
    ActiveTab: {
      default: true
    }
  },
  data() {
    return {
      searchParam: '',
      skeletunMenu: 3,
      key: 'value',
      count: 0,
      filteredMenu: [
        {
          pk: 'filtered',
          name: 'filtered',
          products: []
        }
      ],
      totalPrice: 0,
      searchResultCount: '',
      orderList: [],
      searchExpandActive: false,
      productDefaultImage,
      slideTransition: 'slide-category-next',
      myOptions: {
        highlight: true,
        useKeyboardNavigation: false,
        labels: {
          buttonSkip: false,
          buttonPrevious: 'قبلی',
          buttonNext: 'چگونه پرداخت کنم؟',
          buttonStop: 'فهمیدم!'
        }
      },
      myCallbacks: {
        onNextStep: this.sliderAnimate
      },
      steps: [
        {
          target: '#selected-products-preview', // We're using document.querySelector() under the hood
          content: `با انتخاب این گزینه سفارش خود را ثبت کنید`,
          params: {
            placement: 'top' // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
          }
        }

        // {
        //   target: '.v-step-1',
        //   content: 'An awesome plugin made with Vue.js!'
        // },
        // {
        //   target: '[data-v-step="2"]',
        //   content: 'Try it, you\'ll love it!<br>You can put HTML in the steps and completely customize the DOM to suit your needs.',
        //   params: {
        //     placement: 'top' // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
        //   }
        // }
      ]
    }
  },
  methods: {
    sumbitOnTable() {
      this.$store.commit(
        'table/productsPayloadSeperator',
        this.productChangeArray
      )
    },
    updateSearch(data){
      this.filteredMenu[0].products[data.index] = data.count
      // this is update product count on filteredarray
    },

    emitSearch() {
      let filteredProducts = this.$store.getters['cafe/productsFlatten'].filter(
        p => {
          return p.name.includes(this.searchParam)
        }
      )
      this.searchResultCount = filteredProducts.length
      this.filteredMenu[0].products = filteredProducts
    },

    expandSearchBox() {
      // delay to dispatch in order to prevent lag (due to high process at the same time)
      setTimeout(() => {
        this.emitSearch()
      }, 600)
      this.searchExpandActive = !this.searchExpandActive
      if (this.searchExpandActive) {
        this.$emit('shrink', true)
        this.$bus.$emit('shrink', true)
        $('#selected-products-preview').addClass('submit-orders-shrink')
        $('.category-navigation__list').addClass('category-navigation__list--hide')

        setTimeout(() => {
          $('.category-navigation__list').hide()
          $('.category-navigation__search input').show()
          this.$refs.searchInput.focus()
          // document.getElementById('search-input').style.display = block
        }, 500)
      } else {
        // delay to dispatch in order to prevent lag (due to high process at the same time)

        $('#selected-products-preview').removeClass('submit-orders-shrink')
        this.$bus.$emit('shrink', false)
        this.$emit('shrink', false)
        $('.category-navigation__list').show()
        $('.category-navigation__list').removeClass('category-navigation__list--hide')
        $('.category-navigation__search input').hide()
      }
    },

    changeActiveCategory(index) {
      // if (this.activeCategory > index)
      //   this.slideTransition = 'slide-category-prev'
      // else this.slideTransition = 'slide-category-next'
      this.$store.commit('cafe/changeActiveCategory', index)
    },

  },

  computed: {
    activeCategory() {
      return this.$store.state.cafe.activeCategory
    },
    isMenuPage() {
      return this.$store.state.currentMainPage == 'currentCafe'
    },
    firstTimeActive() {
      return this.$store.state.firstTimeActive
    },
    initialTour() {
      // it must be the first component and user must be new and page must be table
      return this.showSubmitBtn > 0 && this.isMenuPage && this.firstTimeActive
    },
    productChangeArray() {
      return this.$store.state.cafe.productChangeArray
    },

    totalCap() {
      return this.$store.state.cafe.productChangeArray.reduce(
        (sum, prod) => prod.capital + sum,
        0
      )
    },

    totalCount() {
      return this.$store.state.cafe.productChangeArray.reduce(
        (sum, prod) => prod.count + sum,
        0
      )
    },
    showSubmitBtn() {
      return this.$store.state.cafe.productChangeArray.length
    }
  },
  mounted() {},
  watch: {
    initialTour: {
      immediate: true,
      handler(val, old) {
        if (val) {
          setTimeout(() => {
            this.$tours['menuTour'].start()
          }, 500)
        }
      }
    },

    // showSubmitBtn(val, old) {
    //   if (val > 0) {
    //     document
    //       .getElementById('selected-products-preview')
    //       .classList.add('selected-products-preview-is-shown')
    //   } else {
    //     this.$store.commit('table/setOrder', { orders: [], totalPrice: 0 })
    //     document
    //       .getElementById('selected-products-preview')
    //       .classList.remove('selected-products-preview-is-shown')
    //   }
    // },
    ActiveTab(val) {
      if (!val) {
        document
          .getElementById('selected-products-preview')
          .classList.remove('selected-products-preview-is-shown')
      } else {
        document
          .getElementById('selected-products-preview')
          .classList.add('selected-products-preview-is-shown')
      }
    },

  }
}
</script>

<style scoped lang="sass">
</style>