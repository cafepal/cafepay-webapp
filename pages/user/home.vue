<template>
  <div dir="rtl">
    <keep-alive>
      <component
        v-if="currentMainPage != 'scan'"
        class=""
        @changeView="changeViewTrigger"
        :is="currentMainPage"
      ></component>
    </keep-alive>
    <navigation class="navigation-in-home" />
    <component
      v-if="currentMainPage == 'scan'"
      class=""
      @changeView="changeViewTrigger"
      :is="currentMainPage"
    ></component>
  </div>
</template>

<script>
import navigation from '~/components/user/navigation.vue'
import scan from '~/components/user/scan.vue'
import cpTable from '~/components/user/table.vue'
import profile from '~/components/user/profile.vue'
import feed from '~/components/user/feed.vue'
import currentCafe from '~/components/cafe/currentCafe.vue'
export default {
  components: { navigation, scan, cpTable, feed, currentCafe, profile },
  head() {},
  data() {
    return {
      dynamicComponent: this.hasActiveTable ? 'currentCafe' : 'scan'
    }
  },
  methods: {
    changeTab(componentName) {
      this.dynamicComponent = componentName
    },
    changeViewTrigger(command) {
      this.dynamicComponent = command
    }
  },
  computed: {
    currentMainPage() {
      return this.$store.state.currentMainPage
    }
  },

  mounted() {
    this.$bus.$on('shrink', flag => {
      if (flag) {
        $('.navigation-in-home').addClass('navigation-in-home-shrink')
      } else {
        $('.navigation-in-home').removeClass('navigation-in-home-shrink')
      }
    })
  }
}
</script>

<style scoped lang="sass">
</style>