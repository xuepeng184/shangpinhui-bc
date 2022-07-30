<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category1Id"
          @change="handler1"
          :disabled="show"
        >
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="(c1, index) in list1"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category2Id"
          @change="handler2"
          :disabled="show"
        >
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="(c2, index) in list2"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category3Id"
          @change="handler3"
          :disabled="show"
        >
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="(c3, index) in list3"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  props: ["show"],
  data() {
    return {
      //一级分类的数组
      list1: [],
      //二级分类的数组
      list2: [],
      //三级分类的数组
      list3: [],
      //收集相应的一二三级id
      cForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  mounted() {
    this.getCategory1List();
  },
  methods: {
    //获取一级分类数据
    async getCategory1List() {
      let result = await this.$API.attr.reqCategory1List();
      console.log("一级分类", result);
      if (result.code == 200) {
        this.list1 = result.data;
      }
    },
    //一二三级分类改变的回调
    async handler1() {
      //清除数据
      this.list2 = [];
      this.list3 = [];
      this.cForm.category2Id = "";
      this.cForm.category3Id = "";
      this.$emit("getCategoryId", {
        categoryId: this.cForm.category1Id,
        level: 1,
      });
      let result = await this.$API.attr.reqCategory2List(
        this.cForm.category1Id
      );
      console.log("二级分类", result);
      if (result.code == 200) {
        this.list2 = result.data;
      }
    },
    async handler2() {
      this.list3 = [];
      this.cForm.category3Id = "";
      this.$emit("getCategoryId", {
        categoryId: this.cForm.category2Id,
        level: 2,
      });
      let result = await this.$API.attr.reqCategory3List(
        this.cForm.category2Id
      );
      console.log("三级分类", result);
      if (result.code == 200) {
        this.list3 = result.data;
      }
    },

    handler3() {
      this.$emit("getCategoryId", {
        categoryId: this.cForm.category3Id,
        level: 3,
      });
    },
  },
};
</script>

<style>
</style>