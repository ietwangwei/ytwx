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
        <div
          v-else
          class="user-cover"
          style="width:80px; height: 80px;"
        />
      </div>
      <div class="desc">
        2020年艺体特长生招生测试
      </div>
      <div class="logo" />
    </div>
    <div class="page-container">
      <van-button
        v-for="item in navs"
        :key="item.type"
        :icon="item.icon"
        :disabled="item.disabled"
        class="nav-item"
        type="info"
        round
        @click="navTo(item)"
      >
        {{ item.label }}
      </van-button>
    </div>
  </view>
</template>

<script>
export default {
  data () {
    return {
      navs: [
        {
          label: '开始报名',
          type: '1',
          url: '/pages/notice/index',
          icon: 'edit',
          disabled: true
        },
        {
          label: '我的报名',
          type: '2',
          url: '/pages/signup/index?hasData=true',
          icon: 'user-circle-o',
          disabled: true
        },
        {
          label: '下载准考证',
          type: '3',
          url: '/pages/center/index',
          icon: 'down',
          disabled: true
        }
      ],
      openid: null,
      fileId: '',
      userInfo: {
        headimgurl: ''
      },
      hasUser: false
    }
  },
  mounted () {
    let routeParams = this.$Taro.Current.router.params
    this.openid = routeParams.openid
    if (this.openid) {
      localStorage.setItem('openid', this.openid)
    }
    this.getWechatUserInfo()
    this.getBaomingByOpenid()
    // this.$toast(`${document.body.clientHeight}`)
  },
  methods: {
    navTo (item) {
      if (item.type === '3') {
        this.download(this.fileId)
      } else {
        this.$Taro.navigateTo({
          url: item.url
        })
      }
    },
    getWechatUserInfo () {
      this.$http.ytzx.getWechatUserInfo().then(res => {
        if (res.code === 200) {
          this.userInfo = res.data
        } else {
          this.$toast(res.message);
        }
      })
    },
    getBaomingByOpenid () {
      this.$http.ytzx.getBaomingByOpenid().then(res => {
        if (res.code === 200) {
          if (res.data) {
            this.fileId = res.data.id
            this.$set(this.navs[1], 'disabled', false)
            this.$set(this.navs[2], 'disabled', false)
            localStorage.setItem('baoming', JSON.stringify(res.data))
          } else {
            this.$set(this.navs[0], 'disabled', false)
          }
        } else {
          this.$toast(res.message);
          this.$set(this.navs[0], 'disabled', false)
        }
      })
    },
    download (id) {
      this.$toast('正在下载准考证，请稍后...')
      let target = document.createElement('a')
      target.style.display = 'none'
      target.href = this.$http.ytzx.exportPdfFile(id)
      target.addEventListener('click', () => {
        console.log('阻止跳转')
        return false
      })
      target.click()
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>

