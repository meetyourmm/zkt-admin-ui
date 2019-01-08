<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="姓名或账户" v-model="listQuery.name"> </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item"  v-if="logManager_btn_del"  style="margin-left: 10px;" @click="handleDelete" type="danger">清除所有日志</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <!--<el-table-column align="center" label="序号" width="65"> <template scope="scope">-->
      <!--<span>{{scope.row.id}}</span>-->
      <!--</template> </el-table-column>-->
      <el-table-column width="200" align="center" label="接口名称"> <template scope="scope">
        <span>{{scope.row.name}}</span>
      </template> </el-table-column>
      <el-table-column width="150" align="center" label="接口地址"> <template scope="scope">
        <span>{{scope.row.uri}}</span>
      </template> </el-table-column>
      <el-table-column width="300" align="center" label="参数"> <template scope="scope">
        <span>{{scope.row.params}}</span>
      </template> </el-table-column>
      <el-table-column width="200" align="center" label="操作时间"> <template scope="scope">
        <span>{{scope.row.createTime | parseTime}}</span>
      </template> </el-table-column>
      <el-table-column width="100" align="center" label="操作账号"> <template scope="scope">
        <span>{{scope.row.createUserName}}</span>
      </template> </el-table-column>
      <el-table-column width="100" align="center" label="操作主机"> <template scope="scope">
        <span>{{scope.row.createHost}}</span>
      </template> </el-table-column>
      <el-table-column width="100" align="center" label="状态码"> <template scope="scope">
        <span>{{scope.row.state}}</span>
      </template> </el-table-column>
      <el-table-column width="500" align="center" label="返回结果"> <template scope="scope">
        <span :style="{color:scope.row.state==500?'red':''}" >{{scope.row.result}}</span>
      </template> </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
  </div>
</template>

<script>
  import {
    page,delAll
  } from '@/api/admin/apiLog/index';
  import { mapGetters } from 'vuex';
  import { getElements } from '@/utils/permission'

  export default {
    name: 'log',
    data() {
      return {
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          name: undefined
        },
        dialogFormVisible: false,
        dialogStatus: '',
        // logManager_btn_edit: false,
        logManager_btn_del: false,
        // logManager_btn_add: false,
        textMap: {
          update: '编辑',
          create: '创建'
        },
        tableKey: 0
      }
    },
    created() {
      this.getList();
      const elements = {}
      getElements(this.menus,elements);
      // this.logManager_btn_edit = elements['logManager:btn_edit'] | this.role =='admin';
      this.logManager_btn_del = elements['logManager:btn_del'] | this.role =='admin';
      // this.logManager_btn_add = elements['logManager:btn_add'] | this.role =='admin';
    },
    computed: {
      ...mapGetters([
        'menus',
        'role'
      ])
    },
    methods: {
      getList() {
        this.listLoading = true;
        page(this.listQuery)
          .then(response => {
            this.list = response.data.list;
            this.total = response.data.total;
            this.listLoading = false;
          })
      },
      handleFilter() {
        this.getList();
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      handleDelete() {
        this.$confirm('此操作将删除所有日志数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            delAll()
              .then(() => {
                this.getList();
                this.$notify({
                  title: '成功',
                  message: '删除成功',
                  type: 'success',
                  duration: 2000
                });
              });
          });
      },
    }
  }
</script>
