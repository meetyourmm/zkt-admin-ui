<template>
  <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="姓名或账户" v-model="listQuery.name"> </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item"  style="margin-left: 10px;" @click="createGroupUser" type="primary" icon="edit">添加</el-button>
    </div>
    <el-table ref="userTable" :key='tableKey' :data="list"  border fit highlight-current-row style="width: 100%" @select="handleSelect" @selection-change="handleSelect" @select-all="handleSelect">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column width="110" align="center" label="姓名"> <template scope="scope">
        <span>{{scope.row.realName}}</span>
      </template> </el-table-column>
      <el-table-column width="110" align="center" label="账号"> <template scope="scope">
        <span>{{scope.row.userName}}</span>
      </template> </el-table-column>
      <!--<el-table-column width="110" align="center" label="昵称"> <template scope="scope">-->
      <!--<span>{{scope.row.nickName}}</span>-->
      <!--</template> </el-table-column>-->
      <el-table-column width="110" align="center" label="性别"> <template scope="scope">
        <span>{{scope.row.gender}}</span>
      </template> </el-table-column>
      <el-table-column width="200" align="center" label="手机"> <template scope="scope">
        <span>{{scope.row.mobile}}</span>
      </template> </el-table-column>
      <el-table-column width="250" align="center" label="邮箱"> <template scope="scope">
        <span>{{scope.row.email}}</span>
      </template> </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
  </el-dialog>
</template>
<script>
  import {
    page
  } from '@/api/admin/user/index';
  export default {
    name: 'user',
    props: {
      callBackFunc:Function
    },
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
        selectedIds:null,
        tableKey: 0
      }
    },
    created() {
      //this.getList();
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
      handleSelect(selection, row){
        this.selectedIds = []
        selection.forEach((item, index) => {
          this.selectedIds.push(item.id)
        })
      },
      createGroupUser() {
        if(this.selectedIds==null||this.selectedIds.length==0){
          this.$alert('<strong>请选择至少一条数据</strong>', '提醒', {
            dangerouslyUseHTMLString: true
          });
          return;
        }
        this.dialogFormVisible = false;
        this.callBackFunc(this.selectedIds.join(","));
      }
    }
  }
</script>
