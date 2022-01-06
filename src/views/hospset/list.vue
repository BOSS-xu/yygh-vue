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

    <!-- 工具条 -->
    <div>
      <el-button type="danger" size="mini" @click="removeRows()">批量删除</el-button>
    </div>
    <!-- banner列表 -->
    <el-table
      :data="list"
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"/>
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
      <el-table-column label="操作" width="280" align="center">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除
          </el-button>
          <el-button
            v-if="scope.row.status==1"
            type="primary"
            size="mini"
            icon="el-icon-delete"
            @click="lockHostSet(scope.row.id,0)">锁定
          </el-button>
          <el-button
            v-if="scope.row.status==0"
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="lockHostSet(scope.row.id,1)">取消锁定
          </el-button>
          <router-link :to="'/hosp/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit"/>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :current-page="current"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getList"/>
  </div>
</template>

<script>
import hospset from '@/api/hospset'

export default {
  // 定义数据模型
  data() {
    return {
      // list: null // 列表
      current: 1,
      limit: 3,
      searchObj: {},
      list: [],
      total: 0,
      multipleSelection: [] // 批量选择中选择的记录列表
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
      hospset.getPageList(this.current, this.limit, this.searchObj).then(
        response => {
          console.log(response)
          this.list = response.data.records
          this.total = response.data.total
        }
      ).catch(error => {
        console.log(error)
      })
    },
    // 删除医院设置的方法
    removeDataById(id) {
      this.$confirm('此操作将永久删除医院是设置信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        hospset.deleteHospSet(id).then(response => {
          this.$message({ type: 'success', message: '删除成功!' })
          this.getList(this.current)
        })
      })
    },
    // 当表格复选框选项发生变化的时候触发
    handleSelectionChange(selection) {
      this.multipleSelection = selection
    },
    // 批量删除
    removeRows() {
      this.$confirm('此操作将永久删除医院是设置信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const idList = []
        for (let i = 0; i < this.multipleSelection.length; i++) {
          const obj = this.multipleSelection[i]
          const id = obj.id
          idList.push(id)
        }
        hospset.removeRows(idList).then(response => {
          this.$message({ type: 'success', message: '删除成功!' })
          this.getList(1)
        })
      })
    },
    // 锁定和取消锁定
    lockHostSet(id, status) {
      hospset.lockHospSet(id, status)
        .then(response => {
          // 刷新
          this.getList()
        })
    }
  }
}
</script>
