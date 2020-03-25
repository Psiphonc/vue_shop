<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 出错提示 -->
      <el-row>
        <transition name="el-zoom-in-top">
          <el-alert
            title="只允许为第三级分类设置参数"
            type="warning"
            effect="dark"
            show-icon
            v-show="isWarningShow"
          ></el-alert>
        </transition>
      </el-row>
      <!-- 选择商品分类输入框 -->
      <el-row class="cat-row">
        <el-col>
          <span>请选择商品分类：</span>
          <el-cascader
            v-model="selectedCateKeys"
            :options="cates"
            :props="catesProps"
            @change="handleSelectedCateKeys"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 操作标签页面区 -->
      <el-row>
        <el-tabs
          v-model="activeTabName"
          @tab-click="handleTabClick"
        >
          <!-- 动态参数面板 -->
          <el-tab-pane
            label="动态参数"
            name="many"
          >
            <el-button
              type="primary"
              size="mini"
              :disabled="isBtnDisable"
              @click="addDialogVisible=true"
            >添加参数</el-button>
            <el-table
              :data="manyTabData"
              border
              stripe
            >
              <!-- 展开行 -->
              <el-table-column type="expand">
                <template v-slot="slotParams">
                  <!-- 渲染tag标签 -->
                  <el-tag
                    v-for="(item,idx) in slotParams.row.attr_vals"
                    :key=idx
                    closable
                    @close="handelTagClose(idx,slotParams.row)"
                  >
                    {{item}}
                  </el-tag>
                  <!-- 添加标签 -->
                  <el-input
                    class="input-new-tag"
                    v-if="slotParams.row.inputVisible"
                    v-model="slotParams.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(slotParams.row)"
                    @blur="handleInputConfirm(slotParams.row)"
                  >
                  </el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput(slotParams.row)"
                  >+ New Tag</el-button>
                </template>
              </el-table-column>
              <!-- 索引列 -->
              <el-table-column type="index"></el-table-column>
              <el-table-column
                label="参数名称"
                prop="attr_name"
              ></el-table-column>
              <el-table-column label="操作">
                <template v-slot:default='slotParams'>
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="mini"
                    round
                    @click="showEditDialog(slotParams.row)"
                  >编辑</el-button>
                  <el-button
                    type="danger"
                    icon="el-icon-edit"
                    size="mini"
                    round
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <!-- 静态属性面板 -->
          <el-tab-pane
            label="静态属性"
            name="only"
          >
            <el-button
              type="primary"
              size="mini"
              :disabled="isBtnDisable"
              @click="addDialogVisible=true"
            >添加属性</el-button>
            <el-table
              :data="onlyTabData"
              border
              stripe
            >
              <!-- 展开行 -->
              <el-table-column type="expand">
                <template v-slot="slotParams">
                  <!-- 渲染tag标签 -->
                  <el-tag
                    v-for="(item,idx) in slotParams.row.attr_vals"
                    :key=idx
                    closable
                    @close="handelTagClose(idx,slotParams.row)"
                  >
                    {{item}}
                  </el-tag>
                  <!-- 添加标签 -->
                  <el-input
                    class="input-new-tag"
                    v-if="slotParams.row.inputVisible"
                    v-model="slotParams.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(slotParams.row)"
                    @blur="handleInputConfirm(slotParams.row)"
                  >
                  </el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput(slotParams.row)"
                  >+ New Tag</el-button>
                </template>
              </el-table-column>>
              <!-- 索引列 -->
              <el-table-column type="index"></el-table-column>
              <el-table-column
                label="参数名称"
                prop="attr_name"
              ></el-table-column>
              <el-table-column label="操作">
                <template v-slot:default='slotParams'>
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="mini"
                    round
                    @click="showEditDialog(slotParams.row)"
                  >编辑</el-button>
                  <el-button
                    type="danger"
                    icon="el-icon-edit"
                    size="mini"
                    round
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-row>
    </el-card>
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="handleAddDialogClose"
    >
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFromRules"
        label-width="80px"
      >
        <el-form-item
          label="参数名称"
          prop="attr_name"
        >
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleAddParams"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data: function () {
    return {
      cates: [],
      selectedCateKeys: [],
      catesProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      isWarningShow: false,
      warningTimer: 0,
      activeTabName: 'many',
      manyTabData: [],
      onlyTabData: [],
      addDialogVisible: false,
      addForm: {},
      addFromRules: {
        attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
      },
      // 添加标签的切换flag
      inputVisible: false,
      // 添加标签的输入绑定
      inputValue: ''
    }
  },
  created: function () {
    this.getCates()
  },
  methods: {
    getCates: async function () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取商品分类失败')
      this.cates = res.data
      // console.log(this.cates)
    },
    handleSelectedCateKeys: function () {
      this.getParamsData()
    },
    getParamsData: async function () {
      if (this.selectedCateKeys.length < 3) {
        this.isWarningShow = true
        this.selectedCateKeys = []
        this.manyTabData = []
        this.onlyTabData = []
        this.warningTimer = setTimeout(() => {
          this.isWarningShow = false
        }, 5000)
      } else {
        // 根据所选分类ID和当前所处的面板获取参数
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeTabName } })
        if (res.meta.status !== 200) return this.$message.error('获取参数列表失败')
        res.data.forEach(element => {
          element.attr_vals = element.attr_vals ? element.attr_vals.split(' ') : []
          // 控制文本框的显示与隐藏
          element.inputVisible = false
          element.inputVal = ''
        })
        console.log(res.data)
        // 判断并分别挂载静态参数和动态参数
        if (this.activeTabName === 'many') {
          this.manyTabData = res.data
        } else {
          this.onlyTabData = res.data
        }
      }
    },
    handleTabClick: function () {

    },
    handleAddDialogClose: function () {
      this.$refs.addFormRef.resetFields()
    },
    handleAddParams: function () {
      this.$refs.addFormRef.validate(async isValid => {
        if (!isValid) return
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeTabName
        })
        if (res.meta.status !== 201) return this.$message.error('添加参数失败')
        this.$message.success('添加参数成功')

        this.addDialogVisible = false
        this.getParamsData()
      })
    },
    showEditDialog: function (row) {
      this.addDialogVisible = true
    },
    // 添加新属性
    handleInputConfirm: function (row) {
      if (row.inputValue.trim().length !== 0) {
        row.attr_vals.push(row.inputValue)
        this.saveAttrVals(row)
      }
      row.inputValue = ''
      // 关闭输入框 显示按钮
      row.inputVisible = false
    },
    showInput: function (row) {
      row.inputVisible = true
      // $nextTick在页面重新被渲染后 执行里面的回调函数
      // 因为点击完加号按钮后 内层的input输入框不一定已经被渲染出来了
      // 直接调用focus可能会找不到对象
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除对应的参数
    handelTagClose: function (idx, row) {
      console.log(`length before:${row.attr_vals.length}`)
      row.attr_vals.splice(idx, 1)
      console.log(`length after:${row.attr_vals.length}`)
      console.log(row.attr_vals)
      // row.attr_vals.length = 0
      this.saveAttrVals(row)
    },
    saveAttrVals: async function (row) {
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
      console.log(row.attr_vals.join(' '))
      if (res.meta.status !== 200) return this.$message.error('修改失败')
      this.$message.success('修改成功')
    }
  },
  computed: {
    isBtnDisable: function () {
      return this.selectedCateKeys.length !== 3
    },
    cateId: function () {
      if (this.selectedCateKeys.length === 3) return this.selectedCateKeys[2]
      return null
    },
    titleText: function () {
      if (this.activeTabName === 'many') return '动态参数'
      else return '静态参数'
    }
  }
}
</script>
<style lang="less" scoped>
.cat-row {
  margin: 15px 0;
}
.el-tag {
  margin: 10px;
}
.el-input {
  width: 120px;
}
</style>
