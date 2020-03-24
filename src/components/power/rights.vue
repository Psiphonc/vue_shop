<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 权限表 -->
      <el-table
        :data='rightList'
        border
        stripe
      >
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column
          label="权限名称"
          prop="authName"
        ></el-table-column>
        <el-table-column
          label="路径"
          prop="path"
        ></el-table-column>
        <el-table-column
          label="权限等级"
          prop="level"
        >
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.level==='0'"
              type="info"
            >一级</el-tag>
            <el-tag v-if="scope.row.level==='1'">二级</el-tag>
            <el-tag
              v-if="scope.row.level==='2'"
              type="success"
            >三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      rightList: []
    }
  },
  created: function () {
    this.getRightsList()
  },
  methods: {
    getRightsList: async function () {
      const { data: res } = await this.$http.get('rights/' + 'list')
      if (res.meta.status !== 200) return this.$message.error('权限列表加载失败')
      this.rightList = res.data
    }
  }
}
</script>

<style lang="less" scoped>
</style>
