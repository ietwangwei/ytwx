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
  exportPdfFile (id) {
    return ytzx.exportPdfFile + id
  }
}
