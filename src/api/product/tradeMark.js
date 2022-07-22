import request from '@/utils/request'

export const reqTradeMarkList = (page, limit) => {
  return request({
    url: `/admin/product/baseTrademark/${page}/${limit}`,
    method: 'get'
  })
}

//处理添加品牌
export const reqAddOrUpdateTradeMark = (tradeMark) => {
  if (tradeMark.id) {
    return request({
      method: 'put',
      url: '/admin/product/baseTrademark/update',
      data: tradeMark
    })
  } else {
    return request({
      method: 'post',
      url: '/admin/product/baseTrademark/save',
      data:tradeMark
    })
  }
}
