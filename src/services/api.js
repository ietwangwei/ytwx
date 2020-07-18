const prefix = 'https://sljy.cdsledu.net/cms'

export const ytzx = {
  download: prefix + '/file/download', // 文件下载
  upload: prefix + '/file/upload', // 文件上传
  multiUpload: prefix + '/file/uploadMulti', // 多文件上传
  getBaomingById: prefix + '/ytzx/getBaomingById/', // 获取报名信息
  getBaomingByOpenid: prefix + '/ytzx/getBaomingByOpenid', // 根据openid获取用户的报名信息
  saveBaoming: prefix + '/ytzx/saveBaoming', // 保存报名信息（新增无id，修改有id）
  getWechatUserInfo: prefix + '/ytzx/getWechatUserInfo', // 获取用户信息
  exportPdfFile: prefix + '/ytzx/exportPdfFile/', // 下载准考证
}