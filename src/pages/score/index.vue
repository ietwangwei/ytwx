<template>
  <div class="score">
    <van-cell-group>
      <van-cell
        v-for="(item, index) in formConfig"
        :key="index"
        :border="true"
      >
        <div class="ceel-label">
          <span
            v-if="item.required"
            style="color: red;"
          >*</span>
          <span class="margin-left10 title">{{ item.label }}</span>
        </div>
        <van-field
          v-if="item.type === 'field'"
          v-model="formData[item.prop]"
          :placeholder="item.placeholder"
          :border="false"
          :type="item.mode"
          :prop="item.prop"
          :disabled="item.disabled"
          clearable
          @change="inputChange"
          @clear="clearHandler(item)"
        />
        <!-- <div
          v-if="item.type === 'picker'"
          class="cell-value van-cell"
          @click="openPicker(item)"
        >
          {{ formData[item.prop] }}
        </div>
        <van-uploader
          v-if="item.type === 'upload'"
          v-model="formData[item.prop]"
          :max-count="item.max"
          :after-read="afterRead"
          class="van-cell"
          accept="image" 
        />
        <div
          v-if="item.type === 'area'"
          class="cell-value van-cell"
          @click="openArea(item)"
        >
          {{ formData[item.prop] }}
        </div> -->
      </van-cell>
      <div class="button">
        <van-checkbox
          v-model="checked"
          style="margin-top: 12px;"
          icon-size="14px"
          checked-color="#07c160"
        >
          <span style="color: rgba(69, 90, 100, 0.6);font-size: 14px;">我承诺所填信息均真实有效</span>
        </van-checkbox>
        <van-button
          :disabled="submitDisabled || !checked"
          :loading="loading"
          loading-text="正在提交..."
          loading-type="spinner"
          type="primary"
          style="margin-top: 12px;"
          @click="submitData"
        >
          提 交
        </van-button>
      </div>
    </van-cell-group>
  </div>
</template>

<script>
export default {
  name: 'Score',
  data () {
    return {
      formConfig: [
        {
          label: "语文",
          type: "field",
          prop: "chinese",
          required: true,
          mode: 'number',
          placeholder: "请输入语文成绩"
        },
        {
          label: "数学",
          type: "field",
          prop: "math",
          required: true,
          mode: 'number',
          placeholder: "请输入数学成绩"
        },
        {
          label: "英语",
          type: "field",
          prop: "english",
          required: true,
          mode: 'number',
          placeholder: "请输入英语成绩"
        },
        {
          label: "物理",
          type: "field",
          prop: "physics",
          required: true,
          mode: 'number',
          placeholder: "请输入物理成绩"
        },
        {
          label: "化学",
          type: "field",
          prop: "chemistry",
          required: true,
          mode: 'number',
          placeholder: "请输入化学成绩"
        },
        {
          label: "道德与法治",
          type: "field",
          prop: "politics",
          required: true,
          mode: 'number',
          placeholder: "请输入道德与法治成绩"
        },
        {
          label: "历史",
          type: "field",
          prop: "history",
          required: true,
          mode: 'number',
          placeholder: "请输入历史成绩"
        },
        {
          label: "生物",
          type: "field",
          prop: "biology",
          required: true,
          mode: 'number',
          placeholder: "请输入生物成绩"
        },
        {
          label: "地理",
          type: "field",
          prop: "geography",
          required: true,
          mode: 'number',
          placeholder: "请输入地理成绩"
        },
        {
          label: "体育",
          type: "field",
          prop: "physical",
          required: true,
          mode: 'number',
          placeholder: "请输入体育成绩"
        },
        {
          label: "总分",
          type: "field",
          prop: "total",
          required: true,
          mode: 'number',
          disabled: true,
          placeholder: "请输入总分"
        },
      ],
      formData: {
        chinese: '',
        math: '',
        english: '',
        physics: '',
        chemistry: '',
        politics: '',
        history: '',
        biology: '',
        geography: '',
        physical: '',
        total: 0
      },
      loading: false,
      checked: false,
      total: ''
    }
  },
  computed: {
    submitDisabled () {
      let result = false
      for (let i in this.formData) {
        if (this.formData[i] === undefined) {
          result = true
          break
        }
      }
      return result
    }
  },
  mounted () {
    this.getScore()
  },
  methods: {
    getScore () {
      this.$http.ytzx.getScore().then(res => {
        if (res.code === 200) {
          this.formData = res.data
        } else {
          this.$toast(res.message)
        }
      })
    },
    inputChange (e) {
      const value = e.target.value;
      const prop = e.target.getAttribute("prop");
      this.formData[prop] = value;
      this.getTotal()
    },
    getTotal () {
      let total = 0
      for (let i in this.formData) {
        if (i !== 'total' && this.formData[i]) {
          total += parseInt(this.formData[i])
        }
      }
      this.formData.total = total
    },
    clearHandler (item) {
      this.formData[item.prop] = ''
      this.getTotal()
    },
    submitData () {
      this.loading = true
      let openid = localStorage.getItem('openid');
      this.$http.ytzx.submitScore(this.formData).then(res => {
        this.loading = false
        if (res.code === 200) {
          this.$toast("提交成功！");
          localStorage.clear()
          this.$Taro.navigateTo({
            url: `/pages/index/index`
          });
        } else {
          this.$toast(res.message);
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
