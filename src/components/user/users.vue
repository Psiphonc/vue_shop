<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 搜索与添加用户 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
            @change="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
              @keyup.enter="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            @click="addDialogVisable=true"
          >添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区 -->
      <!-- 为表格指定数据源 -->
      <el-table
        :data="users"
        border
        stripe
      >
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column
          label="姓名"
          prop="username"
        ></el-table-column>
        <el-table-column
          label="邮箱"
          prop="email"
        ></el-table-column>
        <el-table-column
          label="电话"
          prop="mobile"
        ></el-table-column>
        <el-table-column
          label="角色"
          prop="role_name"
        ></el-table-column>
        <el-table-column label="状态">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
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
                @click="showEditDialog(scope.row.id)"
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
            <!-- 分配角色按钮 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-s-tools"
                circle
                size="mini"
                @click="fillRoleForm(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-row
        type="flex"
        justify="center"
      >
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[2 ,5, 10, 20, 50]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="userCnt"
        >
        </el-pagination>
      </el-row>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisable"
      width="50%"
      @close="addDialogClose"
    >
      <!-- 添加用户表单 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item
          label="用户名"
          prop="username"
        >
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input
            type="password"
            v-model="addForm.password"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="手机"
          prop="mobile"
        >
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区 -->

      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addDialogVisable = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addUser"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisable"
      width="50%"
      @close="editDialogClose"
    >
      <!-- 修改用户对话框主体内容区 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input
            v-model="editForm.username"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item
          label="手机"
          prop="mobile"
        >
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 修改用户对话框按钮区域 -->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editDialogVisable = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editUser"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="allotRoleDialogVisable"
      width="50%"
    >
      <!-- 分配角色对话框主体部分 -->
      <el-form
        :inline="true"
        :model="userInfo"
      >
        <el-form-item label="用户名">
          <el-input
            v-model="userInfo.username"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="selectedRoleId">
            <el-option
              v-for="role in roles"
              :key="role.id"
              :label="role.roleName"
              :value="role.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <div class="role-desc">
          <span>角色描述:</span>
          <p>{{roleDesc}}</p>
        </div>
      </el-form>
      <!-- 分配角色对话框按钮区域 -->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="allotRoleDialogVisable = false">取 消</el-button>
        <el-button
          type="primary"
          @click="allotRole"
          :disabled="isRoleChanged ? false : true"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data: function () {
    // 注意：data里没有return出去的数据是整个组件共享的 return的数据是组件实例私有的
    // 验证邮箱合法性
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/
      if (regEmail.test(value)) return callback()
      callback(new Error('请输入合法邮箱'))
    }
    // 验证手机号合法性
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^1[3456789]\d{9}$/
      if (regMobile.test(value)) return callback()
      callback(new Error('请输入合法手机号'))
    }
    return {
      queryInfo: {
        query: '',
        // 当前页数
        pagenum: 1,
        // 每页显示的记录条数
        pagesize: 5
      },
      users: [],
      userCnt: 0,
      addDialogVisable: false,
      editDialogVisable: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名的长度在3-10个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码的长度在3-10个字符之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editForm: {},
      editFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名的长度在3-10个字符之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      allotRoleDialogVisable: false,
      // 正在被编辑的角色信息
      userInfo: {},
      // 所有列表
      roles: [],
      // 选中的角色
      selectedRoleId: '',
      // 初始角色
      originSelectedRoleId: ''
    }
  },
  created: function () {
    this.getUserList()
    this.getRoleList()
  },
  methods: {
    getUserList: async function () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.users = res.data.users
      this.userCnt = res.data.total
    },
    getRoleList: async function () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.roles = res.data
    },
    // 处理pagesize改变
    handleSizeChange: function (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 处理页码改变事件
    handleCurrentChange: function (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 处理用户状态改变
    userStateChange: async function (userInfo) {
      const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    // 在表单关闭时重置表单
    addDialogClose: function () {
      this.$refs.addFormRef.resetFields()
    },
    addUser: function () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // 发起添加用户请求
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败')
        } else {
          this.$message.success('添加用户成功')
          // 隐藏添加用户对话框
          this.addDialogVisable = false
          this.addDialogClose()
          this.getUserList()
        }
      })
    },
    // 根据id查询用户信息并填入编辑用户表单
    showEditDialog: async function (id) {
      this.editDialogVisable = true
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('找不到用户信息')
      this.editForm = res.data
      this.editDialogVisable = true
    },
    // 清除表单状态
    editDialogClose: function () {
      this.$refs.editFormRef.resetFields()
    },
    // 提交修改用户信息表单数据
    editUser: function () {
      this.$refs.editFormRef.validate(async valid => {
        const { data: res } = await this.$http.put('users/' + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if (res.meta.status !== 200) {
          return this.$message.error('更新用户信息失败')
        }
        // 关闭对话框并刷新数据
        this.editDialogVisable = false
        this.getUserList()
        this.$message('修改成功')
      })
    },
    // 根据id删除用户
    removeUserById: async function (id) {
      const confirmResult = await this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      } else {
        this.$message.success('删除成功')
        this.getUserList()
      }
    },
    fillRoleForm: async function (row) {
      this.userInfo = row
      // 获取所有角色
      const rawRole = this.roles.find(item => item.roleName === this.userInfo.role_name)
      if (rawRole) this.selectedRoleId = rawRole.id
      else this.selectedRoleId = ''
      this.originSelectedRoleId = this.selectedRoleId
      this.allotRoleDialogVisable = true
    },
    allotRole: async function () {
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectedRoleId })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success('分配角色成功')
      this.getUserList()
      this.allotRoleDialogVisable = false
    }
  },
  computed: {
    roleDesc: function () {
      const idx = this.roles.findIndex(item => item.id === this.selectedRoleId)
      if (idx < 0) return ''
      return this.roles[idx].roleDesc
    },
    isRoleChanged: function () {
      return !(this.originSelectedRoleId === this.selectedRoleId)
    }
  }
}
</script>
<style lang="less" scoped>
.role-desc > p {
  text-indent: 2em;
}
</style>
