<template>
  <view class="signup">
    <van-cell-group>
      <van-cell
        v-for="(item, index) in formConfig"
        :key="index"
        :border="true"
        @click="click(item)"
      >
        <div class="ceel-label">
          <span v-if="item.required" style="color: red">*</span>
          <span class="margin-left10 title">{{ item.label }}</span>
        </div>
        <van-field
          v-if="item.type === 'field'"
          v-model="formData[item.prop]"
          :placeholder="item.placeholder"
          :border="false"
          :type="item.mode"
          :prop="item.prop"
          clearable
          @change="inputChange"
          @clear="clearHandler(item)"
        />
        <div
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
        </div>
      </van-cell>
      <div class="button">
        <van-checkbox
          v-model="checked"
          style="margin-top: 12px"
          icon-size="14px"
          checked-color="#07c160"
        >
          <span style="color: rgba(69, 90, 100, 0.6); font-size: 14px"
            >我承诺所填信息均真实有效</span
          >
        </van-checkbox>
        <van-button
          :disabled="submitDisabled || !checked"
          :loading="loading"
          loading-text="正在提交..."
          loading-type="spinner"
          type="primary"
          style="margin-top: 12px"
          @click="submitData"
        >
          提 交
        </van-button>
      </div>
    </van-cell-group>
    <!-- 选择特长 -->
    <van-popup v-model="show" position="bottom">
      <van-picker
        v-model="formData.techang"
        :columns="columns"
        show-toolbar
        @confirm="pickerConfirmHandler"
        @cancel="show = false"
      />
    </van-popup>
    <!-- 选择省市区 -->
    <van-popup v-model="areaShow" position="bottom">
      <van-area
        :area-list="areaList"
        :value="formData.householdCode"
        @confirm="onAreaConfirm"
        @cancel="onAreaCancle"
      />
    </van-popup>
  </view>
</template>

<script>
import regionData from "../../static/region";

export default {
  data() {
    return {
      submit: true,
      submitStr: "",
      show: false,
      areaShow: false,
      checked: false,
      areaList: regionData,
      formConfig: [
        {
          label: "考生姓名",
          type: "field",
          prop: "studentName",
          required: true,
          placeholder: "请输入姓名",
        },
        {
          label: "考生电话",
          type: "field",
          mode: "number",
          prop: "telephone",
          required: true,
          placeholder: "请输入联系电话",
        },
        {
          label: "身份证号码",
          type: "field",
          prop: "idCardNumber",
          required: true,
          placeholder: "请输入身份证号码",
        },
        {
          label: "户 籍",
          type: "area",
          prop: "household",
          required: true,
          placeholder: "请输入户籍",
        },
        {
          label: "初中毕业学校（全称）",
          type: "field",
          prop: "graduateMiddleSchool",
          required: true,
          placeholder: "请输入初中毕业学校（全称）",
        },
        {
          label: "报考特长",
          type: "picker",
          prop: "skill",
          required: true,
          placeholder: "请输入报考特长",
        },
        {
          label: "监护人姓名",
          type: "field",
          prop: "guarderName",
          required: true,
          placeholder: "请输入监护人姓名",
        },
        {
          label: "监护人电话",
          type: "field",
          prop: "guarderTelephone",
          required: true,
          mode: "number",
          placeholder: "请输入监护人电话",
        },
        {
          label: "考生照片（2寸证件照）",
          type: "upload",
          required: true,
          max: 1,
          prop: "zjzUrls",
        },
        {
          label: "身份证或户口簿",
          type: "upload",
          required: true,
          max: 1,
          prop: "sfzhkbUrls",
        },
        {
          label: "获得的主要荣誉",
          type: "upload",
          prop: "honourUrls",
          required: false,
          max: 3,
          placeholder: "请输入获得的主要荣誉",
        },
        {
          label: "艺术体育学习经历",
          type: "field",
          prop: "studyExperience",
          required: false,
          mode: "textarea",
          placeholder: "请输入艺术体育学习经历",
        },
      ],
      formData: {
        studentName: "",
        household: "四川省,成都市,双流区",
        householdCode: "510116",
        idCardNumber: "",
        graduateMiddleSchool: "",
        skill: "美术",
        telephone: "",
        guarderName: "",
        zjzUrls: [],
        sfzhkbUrls: [],
        honourUrls: [],
        studyExperience: "",
      },
      currentPickerProp: "",
      currentPickerValue: "",
      columns: [],
      columnsMap: {
        skill: ["美术", "体育", "声乐", "器乐", "舞蹈", "播音主持", "书法"],
      },
      submitDisabled: true,
      uploadProp: null,
      loading: false,
    };
  },
  watch: {
    formData: {
      handler() {
        let result = false;
        for (let i = 0; i < this.formConfig.length; i++) {
          let item = this.formConfig[i];
          if (item.required) {
            if (
              Array.isArray(this.formData[item.prop]) &&
              !this.formData[item.prop].length
            ) {
              result = true;
              break;
            } else if (!this.formData[item.prop]) {
              result = true;
              break;
            }
          }
        }
        this.submitDisabled = result;
        if (this.submit == false) {
          this.submitDisabled = true;
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.canSubmit();
    let routeParams = this.$Taro.Current.router.params;
    if (routeParams.hasData) {
      let data = localStorage.getItem("baoming");
      this.formData = JSON.parse(data);
      this.formData.zjzUrls = this.formData.zjzUrls.map((i) => {
        return {
          url: i,
          name: "测试",
        };
      });
      this.formData.sfzhkbUrls = this.formData.sfzhkbUrls.map((i) => {
        return {
          url: i,
          name: "测试",
        };
      });
      this.formData.honourUrls = this.formData.honourUrls.map((i) => {
        return {
          url: i,
          name: "测试",
        };
      });
    }
  },
  methods: {
    canSubmit() {
      this.$http.ytzx.canSubmit().then((res) => {
        if (res.code === 200) {
          console.info(res.data.submit);
          this.submit = res.data.submit;
          this.submitStr = res.data.message;
          if (res.data.submit == false) {
            this.$toast(res.data.message);
            this.submitDisabled = true;
          }
        } else {
          this.$toast(res.message);
        }
      });
    },
    inputChange(e) {
      const value = e.target.value;
      const prop = e.target.getAttribute("prop");
      this.formData[prop] = value;
    },
    openPicker(item) {
      this.columns = this.columnsMap[item.prop];
      this.currentPickerProp = item.prop;
      this.show = true;
    },
    openArea() {
      this.areaShow = true;
    },
    afterRead(e) {
      if (!e) return;
      let size = e.file.size / 1024 / 1024;
      console.info(size);
      if (size >= 2) {
        let array = this.formData[this.uploadProp];
        let newArray = [];
        if (array.length > 0) {
          array.forEach((element) => {
            if (element.url) {
              newArray.push(element);
            }
          });
        }
        this.formData[this.uploadProp] = newArray;
        this.$toast("图片大小不能超过2M");
        return;
      }
      let formData = new FormData();
      formData.append("file", e.file);
      let len = this.formData[this.uploadProp].length;
      this.formData[this.uploadProp].splice([len - 1], 1);
      this.$http.ytzx.upload(formData).then((res) => {
        if (res.code === 200) {
          this.formData[this.uploadProp].push({
            url: res.data.url,
          });
          this.uploadProp = null;
          this.$toast("上传成功");
        } else {
          this.uploadProp = null;
          this.$toast(res.message);
        }
      });
    },
    getUuid() {
      return new Date().getTime();
    },
    submitData() {
      if (!this.submit) {
        this.$toast(this.submitStr);
        return;
      }
      this.loading = true;
      const queryData = Object.assign({}, this.formData, {
        zjzUrls: this.formData.zjzUrls.map((i) => i.url),
        sfzhkbUrls: this.formData.sfzhkbUrls.map((i) => i.url),
        honourUrls: this.formData.honourUrls.map((i) => i.url),
      });
      let openid = localStorage.getItem("openid");
      this.$http.ytzx.saveBaoming(queryData).then((res) => {
        this.loading = false;
        if (res.code === 200) {
          this.$toast("报名成功！");
          localStorage.clear();
          this.$Taro.navigateTo({
            url: `/pages/index/index?openid=${openid}&id=${this.getUuid()}`,
          });
        } else {
          this.$toast(res.message);
        }
      });
    },
    onAreaConfirm(e) {
      let str = e.map((i) => i.name).join(",");
      let code = e[2].code;
      this.formData.household = str;
      this.formData.householdCode = code;
      this.areaShow = false;
    },
    onAreaCancle() {
      this.areaShow = false;
    },
    deleteHandler(file, index) {
      // todo
    },
    click(item) {
      if (item.type !== "upload") return;
      this.uploadProp = item.prop;
    },
    pickerConfirmHandler(e, index) {
      this.formData[this.currentPickerProp] = e;
      this.currentPickerProp = "";
      this.show = false;
    },
    clearHandler(item) {
      this.formData[item.prop] = "";
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
