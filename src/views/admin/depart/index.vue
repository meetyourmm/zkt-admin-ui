<template>
<div class="app-container calendar-list-container">
  <div class="filter-container">
     <el-button-group>
      <el-button type="primary" v-if="departManager_btn_add" icon="plus" @click="handlerAddChild">添加子节点</el-button>
       <el-button type="primary" v-if="departManager_btn_edit" icon="edit" @click="handlerEdit">编辑</el-button>
      <el-button type="primary" v-if="departManager_btn_del" icon="delete" @click="handleDelete">删除节点</el-button>
    </el-button-group>
  </div>

<el-row>
  <el-col :span="8" style='margin-top:15px;padding-right: 10px;'>
    <el-card>
      <div slot="header" class="clearfix">
        <span>组织架构</span>
      </div>
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText">
      </el-input>
      <el-tree
        class="filter-tree"
        :data="treeData"
        node-key="id"
        highlight-current
        :props="defaultProps"
        :filter-node-method="filterNode"
        ref="menuTree"
        @node-click="getNodeData"
        default-expand-all
      >
      </el-tree>
    </el-card>
  </el-col>
  <el-col :span="16" style='margin-top:15px;'>
     <el-card class="box-card" v-if="!formEdit">
       <div slot="header" class="clearfix">
         <span>组织架构详情</span>
       </div>
    <el-form :label-position="labelPosition" :rules="rules" label-width="80px" :model="form" ref="form">
      <el-form-item label="部门编码" prop="code">
          <el-input v-model="form.code" :disabled="formEdit" placeholder="请输入部门编码"></el-input>
      </el-form-item>
      <el-form-item label="部门名称" prop="title">
          <el-input v-model="form.name" :disabled="formEdit"  placeholder="请输入部门名称"></el-input>
      </el-form-item>
          <el-form-item label="父级节点" prop="parentId">
          <el-input v-model="form.parentId" :disabled="formEdit" placeholder="请输入父级节点" readonly></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="orderNum">
          <el-input v-model="form.orderNum" :disabled="formEdit" placeholder="请输入排序"></el-input>
      </el-form-item>
      <el-form-item label="描述"   prop="description">
          <el-input v-model="form.description" :disabled="formEdit" placeholder="请输入描述"></el-input>
      </el-form-item>
      <el-form-item v-if="formStatus == 'update'">
        <el-button type="primary" @click="update('form')">更新</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
      <el-form-item v-if="formStatus == 'create'">
        <el-button type="primary" @click="create('form')">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
     </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>组织相关</span>
      </div>
      <el-tabs style='margin-top:15px;'  v-model="activeName">
        <el-tab-pane  label="用户管理" name="user">
            <group-user :groupId='currentId' ref="groupElement"></group-user>
        </el-tab-pane>
        <el-tab-pane  label="权限管理"  name="auth">
           <group-auth :groupId='currentId' ref="authElement"></group-auth>
        </el-tab-pane>
      </el-tabs>

    </el-card>
  </el-col>
</el-row>
  </div>
</template>

<script>
import {
  fetchTree, getObj, addObj, delObj, putObj, validateCode
} from '@/api/admin/group/index';
import { mapGetters } from 'vuex';
import { getElements, getMenus, hasChild } from '@/utils/permission'
export default {
  name: 'depart',
  components: {
    'group-user': () => import('./components/groupUser'),
    'group-auth': () => import('./components/groupAuth')
  },
  data() {
    let validCode = (rule, code, callback) => {
      if(this.formStatus == 'update'){
        callback()
      }
      //后台方法
      validateCode({code}).then(res => {
        if (res.data === true) {
          callback('编码已存在')
        } else {
          callback()
        }
      })
    }
    return {
      filterText: '',
      list: null,
      total: null,
      formEdit: true,
      formAdd: true,
      formStatus: '',
      showElement: false,
      listQuery: {
        name: undefined,
        type:2,//1权限组2部门
      },
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      labelPosition: 'right',
      form: {
        code: undefined, //编码
        name: undefined, //标题
        parentId: -1, //父节点 默认-1
        orderNum: undefined, //排序
        groupType:'2',
        description: undefined, //描述
        status: undefined, //启用禁用删除
        type: undefined //
      },
      rules: {
        code: [
          {
            required: true,
            message: '请输入部门编码',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 20 个字符',
            trigger: 'blur'
          },
          {
            validator:validCode,
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: '请输入部门名称',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ]
      },
      currentId: -1,
      activeName: "user",
      departManager_btn_add: false,
      departManager_btn_edit: false,
      departManager_btn_del: false
    }
  },
  watch: {
    filterText(val) {
      this.$refs.menuTree.filter(val);
    },
    'activeName':function(val) {
      if(this.activeName=="user"){
        this.$refs.groupElement.groupId = this.currentId;
        this.$refs.groupElement.getList();
      }else if(this.activeName=="auth"){
        this.$refs.authElement.groupId = this.currentId;
        this.$refs.authElement.getList();
      }
    },
  },
  created() {
    this.getList();
    const elements = {}
    getElements(this.menus,elements);
    this.departManager_btn_add = elements['departManager:btn_add'] | this.role =='admin';
    this.departManager_btn_edit = elements['departManager:btn_edit'] | this.role =='admin';
    this.departManager_btn_del = elements['departManager:btn_del'] | this.role =='admin';
  },
  computed: {
    ...mapGetters([
      'menus',
      'role'
    ])
  },
  methods: {
    getList() {
      fetchTree(this.listQuery).then(res => {
        this.treeData = res.data;
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    getNodeData(data) {
      if (!this.formEdit) {
        this.formStatus = 'update';
      }
      getObj({"id":data.id}).then(response => {
        this.form = response.data;
      });
      this.currentId = data.id;
      this.showElement = true;
      if(this.activeName=="user"){
        this.$refs.groupElement.groupId = data.id;
        this.$refs.groupElement.getList();
      }else if(this.activeName=="auth"){
        this.$refs.authElement.groupId = data.id;
        this.$refs.authElement.getList();
      }

    },
    handlerEdit() {
      if (this.form.id) {
        this.formEdit = false;
        this.formStatus = 'update';
      }
    },
    handlerAddChild() {
      this.resetForm();
      this.formEdit = false;
      this.formStatus = 'create';
    },
    handleDelete() {
      if(hasChild(this.treeData,this.currentId)){//判断是否有子节点
        this.$alert('请先删除所有子节点以及该节点下的按钮','提示')
        return
      }
      this.$confirm('此操作将删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delObj({"id":this.currentId}).then(() => {
          this.getList();
          this.resetForm();
          this.onCancel();
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          });
        });
      });
    },
    update(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        putObj(this.form).then(() => {
          this.getList();
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          });
        });
      })
    },
    create(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          addObj(this.form).then(() => {
            this.getList();
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            });
          });
        }
      })
    },
    onCancel() {
      this.formEdit = true;
      this.formStatus = '';
    },
    resetForm() {
      this.form = {
        code: undefined, //编码
        name: undefined, //标题
        parentId:  this.currentId, //父节点
        orderNum: undefined, //排序
        groupType:'2',
        description: undefined, //描述
        status: undefined, //启用禁用删除
        type: undefined //
      };
    }
  }
}
</script>

