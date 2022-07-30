<template>
  <div>
    <!-- 上面的三级联动 -->
    <el-card style="margin: 20px 0">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="!show"
      ></CategorySelect>
    </el-card>
    <el-card>
      <!-- 三部分进行切换 -->
      <div v-show="scene==0">
        <!-- 展示spu列表的结构 -->
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu">添加SPU</el-button>
        <el-table border :data="records">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80"
          ></el-table-column>
          <el-table-column label="spu名称" prop="spuName"></el-table-column>
          <el-table-column label="spu描述" prop="description"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row, $index }">
              <HintButton
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
              ></HintButton>
              <HintButton
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="updateSpu(row)"
              ></HintButton>
              <HintButton
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu全部sku列表"
              ></HintButton>
              <HintButton
                type="danger"
                icon="el-icon-delete"
                size="mini"
                title="删除spu"
              ></HintButton>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="text-align: center"
          :total="total"
          :page-sizes="[3,5,10]"
          :current-page="page"
          :page-size="limit"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
          layout="prev,pager,next,jumper,->,sizes,total"
        ></el-pagination>
      </div>
      <SpuForm v-show="scene==1"></SpuForm>
      <SkuForm v-show="scene==2"></SkuForm>
    </el-card>
  </div>
</template>

<script>
import SpuForm from './SpuForm'
import SkuForm from './SkuForm'
export default {
  name: "Spu",
  components:{
    SpuForm,
    SkuForm,
},
  data() {
    return {
      //分别是分类的id
      category1Id: "",
      category2Id: "",
      category3Id: "",
      //控制三级联动的可操作性
      show: true,
      //分页器的数据
      page: 1,
      limit: 3,
      records: [],
      total: 0,
      scene:0 //代表展示sku列表  1 添加或修改spu  2 添加sku
    };
  },
  methods: {
    getCategoryId({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        this.getSpuList();
      }
    },
    //获取spu列表的方法
    async getSpuList(pages=1) {
      this.page=pages
      const { page, limit, category3Id } = this;
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      console.log("spu列表", result);
      if (result.code == 200) {
        this.total = result.data.total ;
        this.records = result.data.records;
      }
    },
    //当分页器每页展示的条数发生变化
    handleSizeChange(limit){
      this.limit=limit
      this.getSpuList()
    },
    //添加spu按钮的回调
    addSpu(){
      this.scene=1
    },
    //修改某一个spu
    addSpu(){
      this.scene=1
    },
  },
};
</script>

<style>
</style>