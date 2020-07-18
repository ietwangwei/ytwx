<template>
  <view class="notice">
    <div class="page-container">
      <div class="notice-bar">
        <p>温馨提示：</p>
        <p>1.报名成功后，考生自行打印准考证，按照准考证要求提前到校参加测试。</p>
        <p>2.请考生到四川省双流艺体中学微信公众号查看各专业具体考试要求，并按照要求进行准备。</p>
        <p>3.考试当天，请所有考生持健康码复印件、准考证按照学校要求有序进校参加考试。</p>
        <p>4.请所有考生合理规划出行时间，提前1个小时到考试地点点到候考。</p>
      </div>
      <div class="btn">
        <van-checkbox
          v-model="checked"
          :disabled=" time > 1"
          class="test"
          icon-size="16px"
          checked-color="#07c160"
        >
          <span style="color: rgba(69, 90, 100, 0.6);">阅读并同意《报名须知》</span>
        </van-checkbox>
        <van-button
          :disabled="!checked"
          class="margin-top24"
          type="primary"
          @click="handleClick"
        >
          已阅读并开始报名<span v-if="time > 1">(剩余{{ time }}秒)</span>
        </van-button>
      </div>
    </div>
  </view>
</template>

<script>
let timer
export default {
  data () {
    return {
      checked: false,
      time: 6,
      timer: null
    }
  },
  mounted () {
    this.timer = setInterval(() => {
      this.time--
      if (this.time < 1) {
        clearInterval(this.timer)
      }
    }, 1000)
  },
  methods: {
    handleClick () {
      this.$Taro.navigateTo({
        url: '/pages/signup/index'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>

