//平台属性管理模块的请求文件

import request from "@/utils/request"

//获取一级分类数据的接口
export const reqCategory1List=()=>{
  return request({
    url:'/admin/product/getCategory1',
    method:'get'
  })
}

//二级分类
export const reqCategory2List=(category1Id)=>{
  return request({
    url:`/admin/product/getCategory2/${category1Id}`,
    method:'get'
  })
}

//三级分类
export const reqCategory3List=(category2Id)=>{
  return request({
    url:`/admin/product/getCategory3/${category2Id}`,
    method:'get'
  })
}

//获取平台属性的接口
export const reqAttrList=(c1Id,c2Id,c3Id)=>{
  return request({
    url:`/admin/product/attrInfoList/${c1Id}/${c2Id}/${c3Id}`,
    method:'get'
  })
}