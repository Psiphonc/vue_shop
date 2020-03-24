<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" size="mini" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
        :data="cates"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text=""
        border
        :show-row-hover="false"
        class="tree-table"
      >
        <!-- 是否有效列插槽 -->
        <template v-slot:isvalid="slotProps">
          <i
            class="el-icon-check"
            v-if="slotProps.row.cat_deleted === true"
            style="color: lightgreen;"
          ></i>
          <i class="el-icon-close" v-else style="color: red;"></i>
        </template>
        <!-- 级别列插槽 -->
        <template v-slot:level="slotProps">
          <el-tag type="info" size="mini" v-if="slotProps.row.cat_level === 0"
            >一级</el-tag
          >
          <el-tag size="mini" v-if="slotProps.row.cat_level === 1">二级</el-tag>
          <el-tag
            type="success"
            size="mini"
            v-if="slotProps.row.cat_level === 2"
            >三级</el-tag
          >
        </template>
        <template v-slot:operation="slotProps">
          <!-- 修改按钮 -->
          <el-tooltip
            effect="dark"
            content="修改"
            placement="top"
            :enterable="false"
          >
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              @click="showEditDialog(slotProps.row.id)"
            ></el-button>
          </el-tooltip>
          <!-- 删除按钮 -->
          <el-tooltip
            effect="dark"
            content="删除"
            placement="top"
            :enterable="false"
          >
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
          </el-tooltip>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-row type="flex" justify="center">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryParams.pagenum"
          :page-sizes="[3, 5, 10, 20]"
          :page-size="queryParams.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageCount"
        ></el-pagination>
      </el-row>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisable"
      width="50%"
      @close="addCateFormClose"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCates"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ddCateDialogVisable = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      // 查询参数
      queryParams: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类列表
      cates: [],
      // 总分类页数
      pageCount: 0,
      // 树型表列配置数组
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isvalid'
        },
        {
          label: '排序',
          type: 'template',
          template: 'level'
        },
        {
          label: '操作',
          type: 'template',
          template: 'operation'
        }
      ],
      addCateDialogVisable: false,
      // 添加分类的表单数据
      addCateForm: {
        // 分类名
        cat_name: '',
        // 父级分类的id
        cat_pid: 0,
        // 分类级别
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 1、2级分类
      parentCates: [],
      // 级联选择器配置
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true,
        expandTrigger: 'hover'
      },
      // 被级联选择器选中的分类id数组
      selectedKeys: []
    }
  },
  created: function() {
    this.getCates()
  },
  methods: {
    getCates: async function() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryParams
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类列表失败')
      }
      this.cates = res.data.result
      this.pageCount = res.data.total
    },
    handleSizeChange: function(newSize) {
      this.queryParams.pagesize = newSize
      this.getCates()
    },
    handleCurrentChange: function(newPage) {
      this.queryParams.pagenum = newPage
      this.getCates()
    },
    showAddCateDialog: function() {
      this.addCateDialogVisable = true
      this.getParentCates()
    },
    getParentCates: async function() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类列表失败')
      }
      this.parentCates = res.data
    },
    parentCateChange: function() {
      if (this.selectedKeys.length <= 0) {
        this.addCateForm.cat_level = 0
        this.addCateForm.cat_pid = 0
      }
      // 如果选择器选择结果数组长度大于0
      // 就取出最后一项作为新分类的父级分类
      this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
      // 且新权限的等级和结果数组长度刚好一致
      this.addCateForm.cat_level = this.selectedKeys.length
    },
    // 关闭对话框就清空表单
    addCateFormClose: function() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys.length = 0
    },
    addCate: function() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error('添加分类失败')
        this.$message.success('添加分类成功')
        this.getCates()
        this.addCateDialogVisable = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.cascader-float {
  height: 200px !important;
}
</style>
