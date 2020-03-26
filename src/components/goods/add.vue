<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-steps
        :space="200"
        :active="activeIdx - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 商品信息表单 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <!-- 纵向标签 -->
        <el-tabs
          tab-position="left"
          v-model="activeIdx"
          :before-leave="befroeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane name="0" label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item type="number" label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                :options="cates"
                :props="cateProps"
                v-model="addForm.goods_cat"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="1" label="商品参数">
            <!-- 渲染表单的item项 -->
            <el-form-item
              v-for="attr in manies"
              :key="attr.attr_id"
              :label="attr.attr_name"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="attr.attr_vals">
                <el-checkbox
                  border
                  v-for="(cb, idx) in attr.attr_vals"
                  :key="idx"
                  :label="cb"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="2" label="商品属性">
            <el-form-item
              v-for="attr in onlies"
              :key="attr.attr_id"
              :label="attr.attr_name"
            >
              <!-- 复选框组 -->
              <el-input v-model="attr.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="3" label="商品图片">
            <el-upload
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleUploadSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane name="4" label="商品内容">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="add-btn" @click="handleAdd"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览对话框 -->
    <el-dialog
      title="预览图片"
      :visible.sync="previewDialogVisible"
      width="50%"
    >
      <el-image
        style="width: 500px; height: 500px"
        :src="previewImgUrl"
        fit="contain"
      ></el-image>
      <span slot="footer">
        <el-button @click="previewDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="previewDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  data: function() {
    var validateCascader = (rule, value, callback) => {
      if (this.addForm.goods_cat.length < 3) {
        return callback(new Error(')只能选择三级分类'))
      }
      callback()
    }
    return {
      activeIdx: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_num: 0,
        goods_cat: [],
        // 商品图片数组
        pics: [],
        // 商品详情
        goods_introduce: '',
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' },
          { validator: validateCascader, trigger: 'change' }
        ]
      },
      cates: [],
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover'
      },
      manies: [],
      onlies: [],
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传组件的header请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewImgUrl: '',
      previewDialogVisible: false
    }
  },
  methods: {
    getCates: async function() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类列表失败')
      }
      this.cates = res.data
    },
    // 级联选择器选项变化
    handleChange: function() {},
    befroeTabLeave: function(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length < 3) {
        this.$message.error('请先填写商品分类')
        return false
      }
    },
    tabClicked: async function() {
      if (this.activeIdx === '1') {
        // 访问动态参数面板
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'many' }
          }
        )
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数失败')
        }
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manies = res.data
      } else if (this.activeIdx === '2') {
        // 访问静态属性面板
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'only' }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数失败')
        }
        this.onlies = res.data
      }
    },
    // 处理图片预览
    handlePreview: function(file) {
      this.previewImgUrl = file.response.data.url
      this.previewDialogVisible = true
    },
    // 处理图片删除
    handleRemove: function(file) {
      const filePath = file.response.data.tmp_path
      const idx = this.addForm.pics.findIndex(item => item.pic === filePath)
      this.addForm.pics.splice(idx, 1)
    },
    // 监听图片上传成功
    handleUploadSuccess: function(res) {
      const picInfo = { pic: res.data.tmp_path }
      this.addForm.pics.push(picInfo)
      console.log(this.addForm)
    },
    handleAdd: function() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请先填写必填表单项')
        // 处理动态参数
        this.manies.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_vals: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态参数
        this.onlies.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_vals: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        // 由于addForm的goods_cat被绑定过 如果直接修改类型会报错
        // lodash.cloneDeep可以深拷贝
        const form = _.cloneDeep(this.addForm)
        // 把addForm里的商品参数拼接成字符串
        form.goods_cat = this.addForm.goods_cat.join(',')
        // 发起请求添加商品（保证商品名称唯一）
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败')
        }
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      })
    }
  },
  created: function() {
    this.getCates()
  },
  computed: {
    cateId: function() {
      if (this.addForm.goods_cat.length === 3) return this.addForm.goods_cat[2]
      return null
    }
  }
}
</script>
<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.add-btn {
  margin-top: 15px;
}
</style>
