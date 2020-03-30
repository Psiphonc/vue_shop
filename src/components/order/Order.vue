<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table
        :data="orders"
        border
        stripe
      >
        <el-table-column type="index"></el-table-column>
        <el-table-column
          label="订单编号"
          prop="order_number"
        ></el-table-column>
        <el-table-column
          label="订单价格"
          prop="order_price"
        ></el-table-column>
        <el-table-column label="是否付款">
          <template v-slot:default="slotProps">
            <el-tag
              type="danger"
              v-if="slotProps.row.pay_status === '0'"
            >未付款</el-tag>
            <el-tag
              type="success"
              v-else
            >已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="是否发货"
          prop="is_send"
        ></el-table-column>
        <el-table-column
          label="下单时间"
          prop="create_time"
        >
          <template v-slot:default="slotProps">
            {{slotProps.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot:default="slotProps">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="handleEdit(slotProps.row)"
              size="mini"
              round
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              @click="handleProgress(slotProps.row)"
              size="mini"
              round
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row
        justify="center"
        type="flex"
      >
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="this.queryInfo.pagenum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="this.queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="this.pageCnt"
        >
        </el-pagination>
      </el-row>
    </el-card>
    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="handleEditDialogClose"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item
          label="省市区/县"
          prop="address1"
        >
          <el-cascader
            :options="cityData"
            v-model="addressForm.address1"
          ></el-cascader>
          <!-- <el-input v-model="addressForm.address1"></el-input> -->
        </el-form-item>
        <el-form-item
          label="详细地址"
          prop="address2"
        >
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editDialogVisible = false"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流信息对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="progressDialogVisible"
      width="50%"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(activity,idx) in progressInfo"
          :key="idx"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="progressDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="progressDialogVisible = false"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import cityData from './citydata.js'
export default {
  data: function () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      pageCnt: 0,
      orders: [],
      editDialogVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [
          { required: true, message: '请选择省市区/县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      cityData: cityData,
      progressDialogVisible: false,
      progressInfo: []
    }
  },
  created: function () {
    this.getOrders()
  },
  methods: {
    getOrders: async function () {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单失败')
      }
      this.orders = res.data.goods
      this.pageCnt = res.data.total
    },
    handleSizeChange: function (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrders()
    },
    handleCurrentChange: function (newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrders()
    },
    handleEdit: function (row) {
      this.editDialogVisible = true
    },
    handleEditDialogClose: function () {
      this.$refs.addressFormRef.resetFields()
    },
    handleProgress: function (row) {
      this.getProgess()
      this.progressDialogVisible = true
    },
    getProgess: async function () {
      const { data: res } = await this.$http.get('/kuaidi/110697571266')
      if (res.meta.status !== 200) return this.$message('查询快递进度失败')
      this.progressInfo = res.data
      console.log(this.progressInfo)
    }
  },
  computed: {

  }
}
</script>
<style lang="less" scoped>
@import '../../plugins/timeline/timeline.css';
@import '../../plugins/timeline-item/timeline-item.css';
.el-cascader {
  width: 100%;
}
</style>
