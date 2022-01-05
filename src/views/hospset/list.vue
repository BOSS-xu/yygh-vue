<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="searchObj.hosname" placeholder="医院名称"/>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchObj.hoscode" placeholder="医院编号"/>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
    </el-form>
    <!-- banner列表 -->
    <el-table
      :data="list"
      stripe
      style="width: 100%">

      <el-table-column type="index" width="50"/>
      <el-table-column prop="hosname" label="医院名称"/>
      <el-table-column prop="hoscode" label="医院编号"/>
      <el-table-column prop="apiUrl" label="api基础路径" width="200"/>
      <el-table-column prop="contactsName" label="联系人姓名"/>
      <el-table-column prop="contactsPhone" label="联系人手机"/>
      <el-table-column label="状态" width="80">
        <template slot-scope="scope">
          {{ scope.row.status === 1 ? '可用' : '不可用' }}
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination :current-page="current" :page-size="limit" :total="total" style="padding: 30px 0; text-align: center;" layout="total, prev, pager, next, jumper" @current-change="getList"/>
  </div>
</template>

<script>
import hospitalSetApi from '@/api/hospset'

export default {
  // 定义数据模型
  data() {
    return {
      // list: null // 列表
      current: 1,
      limit: 3,
      searchObj: {},
      list: [],
      total: 0
    }
  },

  // 页面渲染成功后获取数据
  created() {
    this.getList()
  },

  methods: {

    // 加载列表数据
    getList(page = 1) {
      console.log('翻页。。。' + page)
      // 异步获取远程数据（ajax）
      this.current = page
      hospitalSetApi.getPageList(this.current, this.limit, this.searchObj).then(
        response => {
          console.log(response)
          this.list = response.data.records
          this.total = response.data.total
        }
      ).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>
