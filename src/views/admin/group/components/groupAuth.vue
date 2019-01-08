<template>
  <div class="app-container calendar-list-container">

    <el-row  v-loading.body="listLoading">
      <el-col style='margin-top:15px;padding-right: 10px;'>
          <div slot="header" class="clearfix">
            <span>资源权限</span>
          </div>
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterText">
          </el-input>
          <el-tree
            class="filter-tree"
            :data="treeData"
            show-checkbox
            node-key="id"
            highlight-current
            :props="defaultProps"
            :filter-node-method="filterNode"
            ref="menuTree"
            default-expand-all
          >
          </el-tree>
      </el-col>
    </el-row>
    <el-row style="padding-top: 15px">
      <el-button class="filter-item" v-if="groupManager_btn_auth_save" v-bind:disabled="groupId==-1" style="margin-left: 10px;" @click="save"
                 type="primary" icon="edit">保存
      </el-button>
    </el-row>
  </div>
</template>

<script>
  import {
    getGroupAuth,fetchTree, saveAuthTree
  } from '@/api/admin/menu/index';
  import {mapGetters} from 'vuex';
  import {getElements} from '@/utils/permission'

  export default {
    name: 'element',
    data() {
      return {
        filterText: '',
        treeData: [],
        listLoading: true,
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        groupManager_btn_auth_save: false,
        groupId: -1
      }
    },
    created() {
      this.listLoading = false;
      if(!this.allMenus){
        fetchTree().then(res => {
          this.$store.dispatch('setAllMenus', res.data)
          this.treeData = this.allMenus;
        });
      }else{
        this.treeData = this.allMenus;
      }
      const elements = {}
      getElements(this.menus, elements);
      this.groupManager_btn_auth_save = elements['groupManager:btn_auth_save'] | this.role == 'admin'
    },
    watch: {
      filterText(val) {
        this.$refs.menuTree.filter(val);
      }
    },
    computed: {
      ...mapGetters([
        'menus',
        'allMenus',
        'role'
      ])
    },
    methods: {
      getList() {
        this.listLoading = true;
        getGroupAuth({"groupId":this.groupId}).then(res => {
          var selectedIds = [];
          res.data.forEach((item)=>{
            selectedIds.push(item.id);
          })
          this.$refs.menuTree.setCheckedKeys(selectedIds)
          this.listLoading = false;

        });
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      save(){
        var selectedIds = this.$refs.menuTree.getCheckedKeys()
        saveAuthTree({"groupId":this.groupId,"ids":selectedIds.join(",")}).then(res => {
          this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success',
            duration: 2000
          });
        });
      }
    }
  }
</script>
