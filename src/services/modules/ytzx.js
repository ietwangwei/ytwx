import httpService from '../httpService'
import { ytzx } from '../api'

export default {
  upload(data) {
    return httpService({
      options: {

      },
      url: ytzx.upload,
      method: 'post',
      data
    })
  },
  getBmConfig() {
    return httpService({
      url: ytzx.getBmConfig,
      method: 'get'
    })
  },
  getBaomingByOpenid() {
    return httpService({
      url: ytzx.getBaomingByOpenid,
      method: 'get'
    })
  },
  saveBaoming(data) {
    return httpService({
      url: ytzx.saveBaoming,
      method: 'post',
      data
    })
  },
  getWechatUserInfo(timestamp) {
    let url = ytzx.getWechatUserInfo;
    if (timestamp) {
      url = url + "?timestamp=" + timestamp;
    }
    return httpService({
      url: url,
      method: 'get'
    })
  },
  canSubmit() {
    return httpService({
      url: ytzx.canSubmit,
      method: 'get'
    })
  },
  exportPdfFile(id) {
    return ytzx.exportPdfFile + id + '?locked=true'
  },
  /**
   * 后端下载
   */
  exportPdfFileBak(id) {
    return httpService({
      url: ytzx.exportPdfFile + id + '?locked=true',
      method: 'get'
    })
  },
  submitScore(data) {
    return httpService({
      url: ytzx.submitScore,
      method: 'post',
      data
    })
  },
  getScore() {
    return httpService({
      url: ytzx.getScore,
      method: 'get'
    })
  },
}
