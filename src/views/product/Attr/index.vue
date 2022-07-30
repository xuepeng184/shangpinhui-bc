<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
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
        <!-- 初始进入展示属性值的表格 -->
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
                @click="updateAttr(row)"
              ></el-button>
              <el-button type="danger" icon="el-icon-delete"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加或修改属性的结构 -->
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
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="row.flag = false"
                :ref="$index"
              ></el-input>
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display: block; height: 23px"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row, $index }">
              <!-- 气泡确认框 -->
              <el-popconfirm
                :title="`确定删除${row.valueName}?`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdateAttr" :disabled="attrInfo.attrValueList.length<1">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
//引入lodash中的深拷贝
import cloneDeep from "lodash/cloneDeep";
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
      isShowTable: true,
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
    //添加属性值按钮的回调
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        //
        attrId: this.attrInfo.id,
        valueName: "",
        //控制是查看模式还是编辑模式
        flag: true,
      });
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
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
    //修改某一个属性
    updateAttr(row) {
      this.isShowTable = false;
      //扩展运算符 row如果为简单数据就是深拷贝，如果是复杂就是浅拷贝
      this.attrInfo = cloneDeep(row);
      //加上flag标记
      this.attrInfo.attrValueList.forEach((item) => {
        this.$set(item, "flag", false);
      });
    },
    //失去焦点事件的回调
    toLook(row) {
      if (row.valueName.trim() == "") {
        this.$message("请你输入一个正常的属性值");
        return;
      }
      //新增的属性值不能重复
      let isRept = this.attrInfo.attrValueList.some((item) => {
        if (row !== item) {
          return row.valueName == item.valueName;
        }
      });
      if (isRept) return;
      //使编辑模式变为查看模式
      row.flag = false;
    },
    //点击span的回调，变为编辑模式
    toEdit(row, index) {
      row.flag = true;
      //需要重新渲染后才能获得dom元素
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    //气泡确认框的确认按钮的回调
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1);
    },
    //保存按钮
    async addOrUpdateAttr() {
      // 整理参数,删除flag字段
      this.attrInfo.attrValueList=this.attrInfo.attrValueList.filter((item) => {
        //过滤掉属性值不为空的
        if (item.valueName != "") {
          //删除掉falg属性
          delete item.flag;
          return true;
        }
      });
      try {
        let result=await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
        console.log('保存属性值',result);
        this.isShowTable=true
        this.$message({ type: "success", message: "保存成功" });
        this.getAttrList();
      } catch (error) {
        this.$message("保存失败",error.message);
      }
    },
  },
};
</script>

<style scoped>
</style>