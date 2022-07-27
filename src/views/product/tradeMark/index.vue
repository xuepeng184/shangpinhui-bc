<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0"
      @click="showDialog"
      >添加</el-button
    >
    <!-- 表格组件 -->
    <el-table border :data="list">
      <el-table-column
        label="序号"
        prop="prop"
        width="80px"
        align="center"
        type="index"
      ></el-table-column>
      <el-table-column label="品牌名称" prop="tmName"></el-table-column>
      <el-table-column label="品牌logo" prop="logoUrl">
        <template slot-scope="{ row, $index }">
          <img src="./static/default.jpg" style="height: 100px; width: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="prop">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      @current-change="getPageList"
      @size-change="handleSizeChange"
      :total="total"
      :current-page="page"
      :page-size="limit"
      :page-count="7"
      :page-sizes="[3, 5, 10]"
      layout="prev,pager,next,jumper,->,sizes,total"
      style="margin-top: 20px; textalign: center"
    ></el-pagination>
    <!-- 对话框 -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件,且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    return {
      //分页器第几页
      page: 1,
      //当前页数展示的条数
      limit: 3,
      total: 0,
      list: [],
      //对话框显示与隐藏
      dialogFormVisible: false,
      //收集品牌信息,内部属性不能瞎写，key已经固定
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      //表单验证规则
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" }, //blur失焦
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "change",
          },
        ],
        //logo验证规则
        logoUrl: [{ required: true, message: "请选择品牌图片" }],
      },
    };
  },
  mounted() {
    //获取列表数据
    this.getPageList();
  },
  methods: {
    async getPageList(pager = 1) {
      this.page = pager;
      let { page, limit } = this;
      const result = await this.$API.tradeMark.reqTradeMarkList(page, limit);
      console.log("trademark", result);
      if (result.code == 200) {
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getPageList();
    },
    //点击添加品牌
    showDialog() {
      this.dialogFormVisible = true;
      this.tmForm = { logoUrl: "", tmName: "" };
    },
    //修改某一个品牌
    updateTradeMark(row) {
      // row为当前品牌展示信息
      this.dialogFormVisible = true;
      this.tmForm = { ...row };
    },
    //上传图片相关回调
    handleAvatarSuccess(res, file) {
      this.tmForm.logoUrl = res.data;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //添加按钮，添加品牌，或修改品牌
    addOrUpdateTradeMark() {
      this.$refs.ruleForm.validate(async (success) => {
        if (success) {
          this.dialogFormVisible = false;
          const result = await this.$API.tradeMark.reqAddOrUpdateTradeMark(
            this.tmForm
          );
          console.log("添加或修改品牌", result);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
            });
            //修改品牌后应该留在当前页
            this.getPageList(this.tmForm.id ? this.page : 1);
          } else {
            console.log("error submit!");
            return false;
          }
        }
      });
    },
    //删除
    deleteTradeMark(row) {
      // 弹框组件
      this.$confirm(`你确定删除${row.tmName}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let result = await this.$API.tradeMark.reqDeleteTradeMark(row.id);
          console.log('删除trademark',result);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getPageList(this.list.length>1?this.page:this.page-1)
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>