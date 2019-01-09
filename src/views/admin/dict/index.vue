<template>
  <div class="app-container calendar-list-container">
    <el-row>
      <el-col :span="8" style='margin-top:15px;padding-right: 10px;'>
        <el-card>
          <div slot="header" class="clearfix">
            <span>字典目录</span>
          </div>
          <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="名称" v-model="listQuery.name"> </el-input>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
            <el-button class="filter-item"  v-if="dictManager_btn_add"  style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
          </div>
          <el-table @row-click="openDetails" :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
            <el-table-column align="center" label="名称"> <template scope="scope">
              <span>{{scope.row.name}}</span>
            </template> </el-table-column>
            <el-table-column align="center" label="编码"> <template scope="scope">
              <span>{{scope.row.code}}</span>
            </template> </el-table-column>
            <el-table-column align="center" label="操作"> <template scope="scope">
              <el-button v-if="dictManager_btn_edit" type="text" @click="handleUpdate(scope.row)">编辑
              </el-button>
              <el-button v-if="dictManager_btn_del" type="text" @click="handleDelete(scope.row)">删除
              </el-button>
            </template> </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="16" style='margin-top:15px;'>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>字典值</span>
          </div>
          <div v-loading.body="listLoading2">
            <tree-table :data="detailList" :columns="columns" border/>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {
    getRootDict, getDictChildren
  } from '@/api/admin/dict/index';
  import { mapGetters } from 'vuex';
  import { getElements, getMenus, hasChild } from '@/utils/permission'
  import treeTable from '@/components/TreeTable'
  export default {
    name: 'dict',
    components: { treeTable },
    data() {
      return {
        columns: [
          {
            text: '名称',
            value: 'name'
          },
          {
            text: '编码',
            value: 'code'
          },
          {
            text: '类型',
            value: 'ctype'
          }
        ],
        detailList: [],
        listLoading: true,
        listLoading2: true,
        list:[],
        listQuery: {
          name: undefined,
        },
        dictManager_btn_add: false,
        dictManager_btn_edit: false,
        dictManager_btn_del: false
      }
    },

    created() {
      this.getList();
      const elements = {}
      getElements(this.menus,elements);
      this.dictManager_btn_add = elements['departManager:btn_add'] | this.role =='admin';
      this.dictManager_btn_edit = elements['departManager:btn_edit'] | this.role =='admin';
      this.dictManager_btn_del = elements['departManager:btn_del'] | this.role =='admin';
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
        getRootDict(this.listQuery).then(res => {
          this.list = res.data;
          this.listLoading = false;
        });
      },
      openDetails(row) {
        this.listLoading2 = true;
        getDictChildren({"parentId":row.id,"ctype":row.ctype}).then(response => {
          this.detailList = response.data;
          this.listLoading2 = false;
        });
      }
    }
  }
</script>

