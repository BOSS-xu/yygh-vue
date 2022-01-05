import request from '@/utils/request.js'

// const api_name = '/admin/hosp/hospitalSet'

export default {

  getPageList(page, limit, searchObj) {
    return request({
      // url: `${api_name}/${page}/${limit}`,
      url: `/admin/hosp/hospitalSet/findPageHospSet/${page}/${limit}`,
      method: 'post',
      data: searchObj
    })
  }
}
