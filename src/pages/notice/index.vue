<template>
  <view class="notice">
    <div class="page-container">
      <div class="notice-bar">
        <p>温馨提示：</p>
        <div v-html="notice" />
      </div>
      <div class="btn">
        <van-checkbox
          v-model="checked"
          :disabled="time > 1"
          class="test"
          icon-size="16px"
          checked-color="#07c160"
        >
          <span style="color: rgba(69, 90, 100, 0.6)"
            >阅读并同意《报名须知》</span
          >
        </van-checkbox>
        <van-button
          :disabled="!checked"
          class="margin-top24"
          type="primary"
          @click="handleClick"
        >
          已阅读并开始报名<span v-if="time > 0">(剩余{{ time }}秒)</span>
        </van-button>
      </div>
    </div>
  </view>
</template>

<script>
let timer;
export default {
  data() {
    return {
      notice: "",
      checked: false,
      time: 10,
      timer: null,
    };
  },
  mounted() {
    this.getBmConfig();
    this.timer = setInterval(() => {
      if (this.time <= 0) {
        clearInterval(this.timer);
      }
      this.time--;
    }, 1000);
  },
  methods: {
    handleClick() {
      this.$Taro.navigateTo({
        url: "/pages/signup/index",
      });
    },
    getBmConfig() {
      this.$http.ytzx.getBmConfig().then((res) => {
        if (res.code === 200) {
          this.notice = res.data.notice;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>

