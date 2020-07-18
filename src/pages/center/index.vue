<template>
  <view class="page1">
    <myHeader title="我的报名" />
  </view>
</template>

<script>
export default {
  data () {
    return {
      
    }
  },
  mounted () {
    this.getBaomingById()
  },
  methods: {
    getBaomingById () {
      this.$http.ytzx.getBaomingById(1).then(res => {
        // todo
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>

