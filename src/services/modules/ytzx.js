import httpService from '../httpService'
import { ytzx } from '../api'

export default {
  upload (data) {
    return httpService({
      options: {
        
      },
      url: ytzx.upload,
      method: 'post',
      data
    })
  },
  getBmConfig(){
    return httpService({
      url: ytzx.getBmConfig,
      method: 'get'
    })
  },
  getBaomingByOpenid () {
    return httpService({
      url: ytzx.getBaomingByOpenid,
      method: 'get'
    })
  },
  saveBaoming (data) {
    return httpService({
      url: ytzx.saveBaoming,
      method: 'post',
      data
    })
  },
  getWechatUserInfo () {
    return httpService({
      url: ytzx.getWechatUserInfo,
      method: 'get'
    })
  },
  canSubmit () {
    return httpService({
      url: ytzx.canSubmit,
      method: 'get'
    })
  },
  exportPdfFile (id) {
    return ytzx.exportPdfFile + id
  },
  submitScore (data) {
    return httpService({
      url: ytzx.submitScore,
      method: 'post',
      data
    })
  },
  getScore () {
    return httpService({
      url: ytzx.getScore,
      method: 'get'
    })
  },
}
