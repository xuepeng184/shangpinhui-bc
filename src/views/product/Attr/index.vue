<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button
          type="primary"
          :disabled="!category3Id"
          icon="el-icon-plus"
          style="margin-bottom: 20px"
          @click="addAttr"
          >添加属性</el-button
        >
        <!-- 表格 -->
        <el-table border style="width: 100%" :data="attrList">
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column
            label="属性名称"
            width="150"
            prop="attrName"
          ></el-table-column>
          <el-table-column label="属性值列表">
            <template slot-scope="{ row, $index }">
              <el-tag
                style="margin: 0 20px"
                type="success"
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                @click="isShowTable = false"
              ></el-button>
              <el-button type="danger" icon="el-icon-delete"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加修改属性的结构 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="from" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table border style="margin: 20px 0" :data="attrInfo.attrValueList">
          <el-table-column
            align="center"
            label="序号"
            type="index"
            width="80"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <template slot-scope="{ row, $index }">
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row, $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
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
      //控制table表格的显示与隐藏
      isShowTable: false,
      //收集新增或修改属性名
      attrInfo: {
        attrName: "", //属性名
        attrValueList: [],
        categoryId: 0, //三级分类的id
        categoryLevel: 3,
      },
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
    //添加属性值得回调
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        //
        attrId: undefined,
        valueName: "",
      });
    },
    //添加属性按钮的回调
    addAttr() {
      this.isShowTable = false;
      //清除数据
      this.attrInfo = {
        attrName: "", //属性名
        attrValueList: [],
        categoryId: this.category3Id, //三级分类的id
        categoryLevel: 3,
      };
    },
  },
};
</script>

<style scoped>
</style>