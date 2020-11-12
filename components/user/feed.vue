<template>
  <div class="feed">
    <section class="feed__cafe-list">
      <div
        v-for="(cafe, index) in cafeList"
        :key="index"
        class="feed__cafe-list__cafe"
        :style="{
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 1) 85%),url(${cafe.header})`
        }"
      >
        <img class="shadow" :src="cafe.img" alt="" />
        <div class="cafe-content">
          <p class="cafe-content__name">{{ cafe.name }}</p>
          <p class="cafe-content__short-desc">{{ cafe.description }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cafeList: [
        {
          name: 'باغشاه - ۵۰',
          token: '123456',
          description: 'توضیح مختصر در این قسمت',
          img: require('~/assets/img/shape/icons/test-cafe.png'),
          header: require('~/assets/img/1.jpg')
        },
        {
          name: 'باغشاه - ۵۰',
          token: '123456',
          description: 'توضیح مختصر در این قسمت',
          img: require('~/assets/img/shape/icons/test-cafe.png'),
          header: require('~/assets/img/2.jpg')
        },
        {
          name: 'باغشاه - ۵۰',
          token: '123456',
          description: 'توضیح مختصر در این قسمت',
          img: require('~/assets/img/shape/icons/test-cafe.png'),
          header: require('~/assets/img/3.jpg')
        },
        {
          name: 'باغشاه - ۵۰',
          token: '123456',
          description: 'توضیح مختصر در این قسمت',
          img: require('~/assets/img/shape/icons/test-cafe.png'),
          header: require('~/assets/img/4.jpg')
        }
      ]
    }
  }
}
</script>

<style scoped>
</style>