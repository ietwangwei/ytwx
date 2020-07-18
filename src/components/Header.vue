<template>
  <div class="header">
  </div>
</template>

<script>
export default {
  name: 'center',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  methods: {
    onClickLeft () {
      this.$Taro.navigateBack({
        delta: 1
      })
    }
  }
}
</script>

<style lang="scss">
.header {
  height: 60px;
  background: url('../static/images/logo.png') no-repeat;
  background-size: contain;
  background-position: 12px 0;
}
</style>

