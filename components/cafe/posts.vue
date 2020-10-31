<template>
  <div class="cafe-posts-info cp-tb-margin cp-tb-padding cp-side-padding">
    <!-- {{apiCall}} -->
    <b-modal :active.sync="isPostImageModalActive">
      <p class="image is-4by3">
        <img :src="currentImg" />
      </p>
    </b-modal>

    <b-skeleton
      v-for="i in skeletonNum"
      :key="i"
      size="is-large"
      width="100%"
      height="200px"
      :active="globalLoading && posts.length == 0"
      :animated="true"
    ></b-skeleton>

    <div
      v-for="(post, index) in posts"
      :key="post.date"
      class="post cp-card has-background-white"
    >
      <span
        class="post-type-label"
        :style="{ backgroundColor: `${post.type.color}` }"
      >
        {{ post.type.name }}
      </span>

      <div
        @click="setCurrentImg(post.image)"
        class="img"
        :style="{
          backgroundImage: `url(${post.image})`
        }"
      >
        <!-- backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.5),rgba(0, 246, 252, 0.2)),url(${post.image})` -->
        <!-- <p class="post-title font-16 right-align">{{ post.description }}</p> -->
      </div>

      <div class="post-content cp-tb-padding cp-side-padding">
        <p class="post-content right-align">{{ post.description }}</p>
      </div>

      <div class="post-action cp-side-padding">
        <transition name="router-anim" mode="out-in">
          <span class="likes-count" :key="post.likes_count">
            {{ post.likes_count | currency }}
          </span>
          <!-- <span v-if="post.is_liked" :key="1">like shode</span>
        <span v-else :key="2">like nashode</span> -->
        </transition>

        <div class="icon-container">
          <b-icon
            :class="{ bounceIn: post.is_liked, flxipInY: !post.is_liked }"
            @click.native="likeToggle(index, post.pk)"
            size="is-medium"
            class="like-icon animated"
            :icon="post.is_liked ? 'heart' : 'heart-outline'"
          ></b-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isPostImageModalActive: false,
      currentImg: null,
      posts: [],
      skeletonNum: 3,
      apiCall: true
    }
  },
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  mounted() {},
  methods: {
    setCurrentImg(imgUrl) {
      this.currentImg = imgUrl
      this.isPostImageModalActive = true
    },
    likeToggle(index, id) {
            // unlike
        if (this.posts[index].is_liked) {
          this.posts[index].likes_count += -1
        }
        // like
        else {
          this.posts[index].likes_count += 1
        }
        this.posts[index].is_liked = !this.posts[index].is_liked
        // this.$forceUpdate()
      
        this.$api({
          url: `api/v1/post/${id}/like/`,
          method: 'post'
        })
        .then(res=> {

        })
       .catch(err =>{
              // unlike
        if (this.posts[index].is_liked) {
          this.posts[index].likes_count += 1
        }
        // like
        else {
          this.posts[index].likes_count += -1
        }
        this.posts[index].is_liked = !this.posts[index].is_liked
      }) 
    },
    async getPostList() {
      try {
        let data = await this.$api({
          method: 'get',
          url: `api/v1/cafe/${this.cafe.pk}/post/list/`
        })
        this.posts = data.data

        for (let i = 0; i < this.posts.length; i++) {
          let color
          if (this.posts[i].type == 3) color = '#20BC32'
          if (this.posts[i].type == 2) color = '#E91E63'
          if (this.posts[i].type == 1) color = '#FFDB4A'
          if (this.posts[i].type == 0) color = '#009fe3'

          this.posts[i].type = {
            id: this.posts[i].type,
            name: this.posts[i].get_type_display,
            color
          }
          console.log('posts', this.posts)
        }
        this.apiCall = false
      } catch (err) {
        this.apiCall = false
      }
    }
    // /cafe/{cafe_id}/post/list/
  },
  computed: {
    cafe() {
      return this.$store.state.cafe
    }
  },

  watch: {
    isActive: {
      immediate: true,
      handler(val, oldValue) {
        if (val && this.apiCall) this.getPostList()
      }
    }
  }
}
</script>

<style scoped lang="sass">

.slide-enter-active
  animation: slideUp 1s
  // animation-timing-function: cubic-bezier(0.42, 0, 1, 1)
  opacity: 0

.slide-leave-active
  animation: slideDown 1s
  animation-timing-function: cubic-bezier(0.42, 0, 1, 1)

@keyframes slideUp
  from
  transform: translateY(0px)
  to
  transform: translateY(20px)
  opacity: 0

@keyframes slideDown
  from
  transform: translateY(-20px)
  opacity: 0

  to
  transform: translateY(0px)
  opacity: 1



.router-anim-enter-active 
  animation: coming 0.15s
  opacity: 0

.router-anim-leave-active 
  animation: going 0.15s


@keyframes going 
  from 
  transform: translateY(0)
  
  to 
  transform: translateY(-10px)
  opacity: 0
  

@keyframes coming 
  from 
  transform: translateY(10px)
  opacity: 0
  
  to 
  transform: translateY(0)
  opacity: 1
  


</style>