<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId"></CategorySelect>
    </el-card>
    <el-card>
      <el-button type="primary" icon="el-icon-plus">添加属性</el-button>
      <!-- 表格 -->
      <el-table border style="width: 100%" :data="attrList">
        <el-table-column type='index' label="序号" width="80" align="center"></el-table-column>
        <el-table-column label="属性名称" width="150" prop="attrName"></el-table-column>
        <el-table-column label="属性值列表">
          <template slot-scope="{row,$index}">
            <el-tag style="margin:0 20px" type="success" v-for="(attrValue,index) in row.attrValueList" :key="attrValue.id">{{attrValue.valueName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作"  width="150">
          <template slot-scope="{row,$index}">
            <el-button type="warning" icon="el-icon-edit" ></el-button>
                      <el-button type="danger" icon="el-icon-delete" ></el-button>

          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      //平台属性
      attrList: [],
    };
  },
  methods: {
    //自定义事件的回调
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
        this.getAttrList();
      }
    },
    //获取平台属性的数据
    //确定三级id时，发请求获得数据进行展示
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      console.log("平台属性", result);
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
  },
};
</script>

<style scoped>
</style>