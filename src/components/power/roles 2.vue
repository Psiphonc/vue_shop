<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区 -->
      <el-row>
        <el-button type='primary'>添加角色</el-button>
      </el-row>
      <el-table
        :data="roles"
        border
        stripe
      >
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bd-bottom', index === 0 ? 'bd-top' : '', 'vcenter']"
              v-for="(item,index) in scope.row.children"
              :key="item.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag
                  type="info"
                  closable
                  @close="removeRightByid(scope.row, item.id)"
                >{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级、三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[indexSec !== 0 ? 'bd-top' : '', 'vcenter']"
                  v-for="(itemSec,indexSec) in item.children"
                  :key="itemSec.id"
                >
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      type="primary"
                      closable
                      @close="removeRightByid(scope.row, itemSec.id)"
                    >{{itemSec.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      :key="itemThird.id"
                      v-for="(itemThird) in itemSec.children"
                      type="success"
                      closable
                      @close="removeRightByid(scope.row, itemThird.id)"
                    > {{itemThird.authName}}</el-tag>

                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column
          label="角色名称"
          prop="roleName"
        ></el-table-column>
        <el-table-column
          label="角色描述"
          prop="roleDesc"
        ></el-table-column>
        <el-table-column
          label="操作"
          width="300px"
        >
          <template slot-scope="scope">
            <el-button
              round
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row)"
            >编辑</el-button>
            <el-button
              round
              type="danger"
              size="mini"
              icon="el-icon-delete"
            >删除</el-button>
            <el-button
              round
              type="warning"
              size="mini"
              icon="el-icon-setting"
              @click="showSetRightsDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分配权限对话框 -->
      <el-dialog
        title="分配权限"
        :visible.sync="setRightsDialogVisible"
        width="50%"
        @close="setRightsDialogClose"
      >
        <!-- 分配权限对话框内容主体 -->
        <el-tree
          :data="rightsTree"
          :props="treeProps"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="selectedLeafKeys"
          ref="treeRef"
        ></el-tree>
        <!-- 分配权限对话框按钮区 -->
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="setRightsDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="allotRights()"
          >确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑角色对话框 -->
      <el-dialog
        title="编辑角色"
        :visible.sync="editRoleDialogVisable"
        width="50%"
      >
        <!-- 编辑角色对话框主体区域 -->
        <el-form
          :model="editingRole"
          :rules="roleRules"
          ref="editRoleFormRef"
          label-width="80px"
        >
          <el-form-item
            label="角色名"
            prop="roleName"
          >
            <el-input v-model="editingRole.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input
              type="textarea"
              resize="none"
              rows="3"
              v-model="editingRole.roleDesc"
            ></el-input>
          </el-form-item>
        </el-form>
        <!-- 编辑角色对话框按钮区域 -->
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="editRoleDialogVisable = false">取 消</el-button>
          <el-button
            type="primary"
            @click="submitRole"
          >确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data: function () {
    return {
      // 所有角色列表
      roles: [],
      // 分配权限对话框flag
      setRightsDialogVisible: false,
      // 权限树
      rightsTree: [],
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点
      selectedLeafKeys: [],
      // 当前要操作的角色id
      roleId: '',
      // 编辑角色对话框flag
      editRoleDialogVisable: false,
      // 添加角色flag
      addRoleFlag: false,
      // 当前编辑的角色信息
      editingRole: {},
      roleRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' }
        ]
      }
    }
  },
  created: function () {
    this.getRoles()
  },
  methods: {
    getRoles: async function () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('加载角色列表失败')
      this.roles = res.data
    },
    removeRightByid: async function (role, rightId) {
      console.log(role, rightId)
      const confirmRet = await this.$confirm('此操作会回收该用户权限，是否继续？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
      if (confirmRet !== 'confirm') return this.$message.info('已经取消删除操作')
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('回收权限失败')
      // 如果直接调用getRoles会刷新页面，不如直接给本次操作的行直接赋值
      role.children = res.data
    },
    showSetRightsDialog: async function (row) {
      // 获取所有权限数据
      const { data: res } = await this.$http('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取权限列表失败')
      this.rightsTree = res.data
      // 递归获取被选中的三级节点id
      this.getSelectedLeafKeys(row, this.selectedLeafKeys)
      this.roleId = row.id
      this.setRightsDialogVisible = true
    },
    // 通过递归的形式，获取角色下所有三级权限的id并保存到dfKeys数组中
    getSelectedLeafKeys: function (node, arr) {
      // console.log(node)
      if (!node.children) return arr.push(node.id)
      node.children.forEach(item => this.getSelectedLeafKeys(item, arr))
    },
    // 监听分配权限对话框的关闭事件
    setRightsDialogClose: function () {
      // 清空被选中的叶节点权限列表
      this.selectedLeafKeys.length = 0
    },
    // 分配权限
    allotRights: async function () {
      let keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // 把选择的权限转换成以逗号拼接的字符串
      keys = keys.join(',')
      console.log(keys)
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: keys })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('授权失败')
      this.$message.success('授权成功')
      this.setRightsDialogVisible = false
      this.getRoles()
    },
    showEditDialog: function (role) {
      this.editRoleDialogVisable = true
      const { id, roleName, roleDesc } = role
      this.editingRole = { id, roleName, roleDesc }
    },
    submitRole: async function () {
      const { id, roleName, roleDesc } = this.editingRole
      const { data: res } = await this.$http.put(`roles/${id}`, { roleName, roleDesc })
      if (res.meta.status !== 200) this.$message.error('修改角色信息失败')
      this.getRoles()
      this.editRoleDialogVisable = false
      this.editingRole = {}
    }
  }
}
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bd-top {
  border-top: 1px solid #eee;
}
.bd-bottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
