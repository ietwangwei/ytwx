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
    };
  },
  mounted() {
    let routeParams = this.$Taro.Current.router.params;
    this.openid = routeParams.openid;
    if (this.openid) {
      localStorage.setItem("openid", this.openid);
    }
    this.getBmConfig();
    this.getWechatUserInfo();
    this.getBaomingByOpenid();
    // this.$toast(`${document.body.clientHeight}`)
  },
  methods: {
    navTo(item) {
      if (item.type === "3") {
        this.download(this.fileId);
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
            // this.$set(this.navs[0], "disabled", false);
          }
          if (res.data.canZkz) {
            this.$set(this.navs[2], "disabled", false);
          }else{
             this.$set(this.navs[2], "label", res.data.zkz.beginTip);
          }
          if (res.data.canScore) {
            this.$set(this.navs[4], "disabled", false);
          }
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
            this.fileId = res.data.id;
            this.$set(this.navs[1], "disabled", false);
            // this.$set(this.navs[2], "disabled", false);
            // this.$set(this.navs[3], "disabled", false);
            localStorage.setItem("baoming", JSON.stringify(res.data));
          } else {
            this.$set(this.navs[0], "disabled", false);
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
            "准考证下载后将无法修改报名信息，请再次检查确认所填信息，特别是考生照片是否清晰、头向上！是否下载 ？", //改变弹出框的内容
          confirmButtonText: "确定下载",
          showCancelButton: true, //展示取水按钮
        })
        .then(() => {
          this.$toast("正在下载准考证，请稍后...");
          let target = document.createElement("a");
          target.style.display = "none";
          target.href = this.$http.ytzx.exportPdfFile(id);
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

