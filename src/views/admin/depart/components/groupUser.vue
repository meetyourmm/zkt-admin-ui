<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="姓名或账户"
                v-model="listQuery.name"></el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" v-if="departManager_btn_user_add" v-bind:disabled="groupId==-1" style="margin-left: 10px;" @click="handleCreate"
                 type="primary" icon="edit">添加用户
      </el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row
              style="width: 100%">
      <!--<el-table-column align="center" label="id" width="65">-->
      <!--<template scope="scope">-->
      <!--<span>{{scope.row.id}}</span>-->
      <!--</template>-->

      <!--</el-table-column>-->
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
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template scope="scope">
          <el-button v-if="departManager_btn_user_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
    <group-user-select :callBackFunc="createdUsers" ref="userSelectedElement"></group-user-select>
  </div>
</template>

<script>
  import {
    getGroupUsers,
    delGroupUsers,
    addGroupUsers
  } from '@/api/admin/group/index';
  import {mapGetters} from 'vuex';
  import {getElements} from '@/utils/permission'

  export default {
    name: 'element',
    components: {
      'group-user-select': () => import('./groupUserSelect'),
    },
    data() {
      return {
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          name: undefined,
          groupId:undefined
        },
        departManager_btn_user_add: false,
        departManager_btn_user_del: false,
        groupId: -1,
        tableKey: 0
      }
    },
    created() {
      // this.getList();
      this.listLoading = false;
      const elements = {}
      getElements(this.menus, elements);
      this.departManager_btn_user_add = elements['departManager:btn_user_add'] | this.role == 'admin'
      this.departManager_btn_user_del = elements['departManager:btn_user_del'] | this.role == 'admin'
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
        this.listQuery.groupId = this.groupId;
        getGroupUsers(this.listQuery).then(response => {
          this.list = response.data.list;
          this.total = response.data.total;
          this.listLoading = false;
        })
      },
      handleFilter() {
        this.getList();
      },
      handleCreate() {
        this.$refs.userSelectedElement.dialogFormVisible = true;
        //this.$refs.userSelectedElement.callBackFunc = this.createdUsers;
        this.$refs.userSelectedElement.getList();
      },
      createdUsers(ids){
        addGroupUsers({"ids": ids,"groupId":this.groupId}).then(() => {
          this.$notify({
            title: '成功',
            message: '添加成功',
            type: 'success',
            duration: 2000
          });
          this.getList();
        });
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delGroupUsers({"ids": row.id,"groupId":this.groupId}).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            });
            this.getList();
          });
        });
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
    }
  }
</script>
