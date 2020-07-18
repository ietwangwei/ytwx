const errorMap = {
  400: {
    msg: '请求参数错误'
  },
  404: {
    msg: '找不到服务地址'
  },
  401: {
    msg: '当前用户没有权限,请重新登录'
  },
  403: {
    msg: '访问被拒绝'
  },
  405: {
    msg: '请求方法错误'
  },
  500: {
    msg: '服务器出现问题'
  }
}

export default class {
  static setConfig (options) {
    let openid = localStorage.getItem('openid')
    var headers = {
      'OPENID': openid,
    }
    if (options && options.header) {
      for (let i in options.header) {
        headers[i] = options.header[i]
      }
    }
    return headers
  }

  static toLogin () {
    let preHref = location.href
    localStorage.setItem('preHref', preHref)
    location.href = './index.html#/login'
  }

  static responseHandler (res, resolve, reject) {
    if (!res) return
    if (res.data && res.data.errorCode === 10002) {
      GlobalLoading.close()
      this.toLogin()
    } else if (res.data || res.data.errorCode === 0) {
      return resolve(res.data)
    } else {
      reject(res.data)
    }
  }

  static errorHandler (error, reject) {
    GlobalLoading.close()
    const status = error.response.status
    if (errorMap[status]) {
      console.log(errorMap[status].msg)
    } else {
      console.log('未知错误')
    }
  }
}
