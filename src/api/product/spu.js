import request from "@/utils/request"

//获取spu列表数据的接口
export const reqSpuList=(page,limit,category3Id)=>{
  return request({
    url:`/admin/product/${page}/${limit}`,
    method:'get',
    params:{category3Id}
  })
}