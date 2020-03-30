<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryParams.query"
            clearable
            @clear="queryParams.query=''"
            @keyup.enter.native="handleSearch"
            @blur="handleSearch"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="handleSearch"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            @click="redirectAddPage"
          >添加商品</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="goods"
        border
        stripe
        fit
      >
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column
          label="商品名称"
          prop="goods_name"
          min-width="500"
        ></el-table-column>
        <el-table-column
          label="价格"
          prop="goods_price"
        ></el-table-column>
        <el-table-column
          label="重量"
          prop="goods_weight"
        ></el-table-column>
        <el-table-column
          label="创建时间"
          min-width="150"
        >
          <template v-slot:default='slotProps'>
            {{slotProps.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot:default="slotProps">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              @click="handleEdit(slotProps.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="handleDelete(slotProps.row)"
              size="mini"
            ></el-button>
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
          :current-page="queryParams.pagenum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="queryParams.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageCnt"
        >
        </el-pagination>
      </el-row>
    </el-card>
  </div>
</template>
<script>
export default {
  data: function () {
    return {
      queryParams: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goods: [],
      pageCnt: 0
    }
  },
  created: function () {
    this.getGoods()
  },
  methods: {
    getGoods: async function () {
      const { data: res } = await this.$http.get('goods', { params: this.queryParams })
      if (res.meta.status !== 200) this.$message.error('获取商品列表失败')
      this.goods = res.data.goods
      this.pageCnt = res.data.total
    },
    handleDelete: async function (row) { },
    handleEdit: async function (row) { },
    handleSizeChange: function (newSize) {
      this.queryParams.pagesize = newSize
      this.getGoods()
    },
    handleCurrentChange: function (newpage) {
      this.queryParams.pagenum = newpage
      this.getGoods()
    },
    handleSearch: function () {
      this.getGoods()
    },
    redirectAddPage: function () {
      // 函数式导航
      this.$router.push('/goods/add')
    }
  }
}
</script>
<style lang="less" scoped>
</style>
