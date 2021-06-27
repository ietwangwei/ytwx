<template>
  <view class="index">
    <div class="bg">
      <div class="user">
        <van-image
          v-if="userInfo.headimgurl"
          round
          width="80px"
          height="80px"
          use-error-slot
          :src="userInfo.headimgurl"
        >
          <!-- <text slot="error">
            加载失败
          </text> -->
        </van-image>
        <div v-else class="user-cover" style="width: 80px; height: 80px" />
      </div>
      <div class="grid">
        <van-button
          v-for="item in navs"
          :key="item.type"
          :icon="item.icon"
          :disabled="item.disabled"
          class="grid-btn"
          type="info"
          :style="{ width: item.width }"
          @click="navTo(item)"
        >
          {{ item.label }}
        </van-button>
      </div>
      <div class="desc" v-html="title"></div>
      <div class="logo" />
    </div>
  </view>
</template>

<script>
export default {
  data() {
    return {
      navs: [
        {
          label: "开始报名",
          type: "1",
          url: "/pages/notice/index",
          icon: "plus",
          disabled: true,
          width: "100%",
        },
        {
          label: "我的报名",
          type: "2",
          url: "/pages/signup/index?hasData=true",
          icon: "success",
          disabled: true,
          width: "100%",
        },
        {
          label: "下载准考证",
          type: "3",
          url: "/pages/center/index",
          icon: "down",
          disabled: true,
          width: "100%",
        },
        {
          label: "中考成绩录入",
          type: "4",
          url: "/pages/score/index",
          icon: "sign",
          disabled: true,
          width: "100%",
        },
        {
          label: "测试成绩查询",
          type: "5",
          url: "/pages/score/index",
          icon: "search",
          disabled: true,
          width: "204%",
        },
      ],
      openid: null,
      fileId: "",
      userInfo: {
        headimgurl: "",
      },
      hasUser: false,
      title: "",
      canBm: false,
      canZkz: false,
      canSubmitScore: false,
      canQueryScore: false,
      bmData: {},
    };
  },
  mounted() {
    let routeParams = this.$Taro.Current.router.params;
    this.openid = routeParams.openid;
    if (this.openid) {
      localStorage.setItem("openid", this.openid);
    }
    this.getWechatUserInfo();
    this.getBmConfig();
    // this.$toast(`${document.body.clientHeight}`)
  },
  methods: {
    navTo(item) {
      if (item.type === "3") {
        this.download(this.fileId);
      } else if (item.type === "5") {
        this.$dialog
          .alert({
            title: "测试结果", //加上标题
            message:
              this.bmData.studentName +
              " 你好，你在本次艺体特长测试 [" +
              this.bmData.skill +
              "] 专业的成绩为 " +
              this.bmData.skillTestResult,
          })
          .then(() => {})
          .catch(() => {});
      } else {
        this.$Taro.navigateTo({
          url: item.url,
        });
      }
    },
    getBmConfig() {
      this.$http.ytzx.getBmConfig().then((res) => {
        if (res.code === 200) {
          console.info(res.data);
          this.title = res.data.title;
          if (res.data.canBm) {
            this.canBm = true;
            this.$set(this.navs[0], "disabled", false);
          }
          if (res.data.canZkz) {
            this.canZkz = res.data.canZkz;
          } else {
            this.$set(this.navs[2], "label", res.data.zkz.beginTip);
          }
          this.canSubmitScore = res.data.canSubmitScore;
          this.canQueryScore = res.data.canQueryScore;
          this.getBaomingByOpenid();
        }
      });
    },
    getWechatUserInfo() {
      this.$http.ytzx.getWechatUserInfo().then((res) => {
        if (res.code === 200) {
          this.userInfo = res.data;
        } else {
          this.$toast(res.message);
        }
      });
    },
    getBaomingByOpenid() {
      this.$http.ytzx.getBaomingByOpenid().then((res) => {
        if (res.code === 200) {
          if (res.data) {
            this.bmData = res.data;
            this.fileId = res.data.id;
            this.$set(this.navs[0], "disabled", true);
            this.$set(this.navs[1], "disabled", false);
            if (this.canZkz) {
              this.$set(this.navs[2], "disabled", false);
            }
            if (this.canSubmitScore) {
              this.$set(this.navs[3], "disabled", false);
            }
            if (this.canQueryScore) {
              this.$set(this.navs[4], "disabled", false);
            }
            // this.$set(this.navs[2], "disabled", false);
            // this.$set(this.navs[3], "disabled", false);
            localStorage.setItem("baoming", JSON.stringify(res.data));
          }
        } else {
          this.$toast(res.message);
          // this.$set(this.navs[0], "disabled", false);
        }
      });
    },
    download(id) {
      this.$dialog
        .alert({
          title: "下载准考证提示", //加上标题
          message:
            "准考证下载后将无法修改报名信息，请再次检查确认所填信息，特别是专业信息是否正确，考生照片是否清晰、头向上！是否下载 ？", //改变弹出框的内容
          confirmButtonText: "确定下载",
          showCancelButton: true, //展示取水按钮
        })
        .then(() => {
          if (!this.bmData.zkzUrl) {
            this.$http.ytzx.exportPdfFileBak(id).then((res) => {});
            this.$dialog
              .alert({
                title: "准考证下载提示",
                message: "正在生成准考证，请稍后下载（点击确认3秒后自动刷新）",
              })
              .then(() => {
                setTimeout("location.reload()", 3000);
                this.$set(this.navs[2], "disabled", true);
                this.$toast.loading({
                  duration: 0, // 持续展示 toast
                  loadingType: "spinner",
                  message: "加载中...",
                  forbidClick: true,
                });
              });
            return;
          }
          // this.$toast("正在下载准考证，请稍后...");
          let target = document.createElement("a");
          target.style.display = "none";
          let url = this.$http.ytzx.exportPdfFile(id);
          if (this.bmData.zkzUrl) {
            url = this.bmData.zkzUrl;
          }
          target.href = url;
          target.addEventListener("click", () => {
            console.log("阻止跳转");
            return false;
          });
          target.click();
        })
        .catch(() => {
          //点击取消按钮后的调用
          console.log("点击了取消按钮噢");
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>

