<template>
<div class="app-container calendar-list-container">
  <div class="filter-container">
     <el-button-group>
    <el-button type="primary" v-if="menuManager_btn_add" icon="plus" @click="handlerAdd">添加</el-button>
    <el-button type="primary" v-if="menuManager_btn_edit" icon="edit" @click="handlerEdit">编辑</el-button>
    <el-button type="primary" v-if="menuManager_btn_del" icon="delete" @click="handleDelete">删除</el-button>
  </el-button-group>
  </div>

<el-row>
  <el-col :span="8" style='margin-top:15px;'>
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
  </el-col>
  <el-col :span="16" style='margin-top:15px;'>
     <el-card class="box-card">
    <el-form :label-position="labelPosition" :rules="rules" label-width="80px" :model="form" ref="form">
      <el-form-item label="菜单编码" prop="code">
          <el-input v-model="form.code" :disabled="formEdit" placeholder="请输入菜单编码"></el-input>
      </el-form-item>
          <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" :disabled="formEdit"  placeholder="请输入标题"></el-input>
      </el-form-item>
          <el-form-item label="父级节点" prop="parentId">
          <el-input v-model="form.parentId" :disabled="formEdit" placeholder="请输入父级节点" readonly></el-input>
      </el-form-item>
      <el-form-item label="图标" prop="icon">
          <el-input v-model="form.icon" :disabled="formEdit" placeholder="请输入图标"></el-input>
      </el-form-item>
      <el-form-item label="路由地址" prop="path">
        <el-input v-model="form.path" :disabled="formEdit" placeholder="请输入路由地址"></el-input>
      </el-form-item>
      <el-form-item label="视图路径" prop="view">
          <el-input v-model="form.view" :disabled="formEdit" placeholder="请输入视图路径"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
         <el-select class="filter-item" v-model="form.type"  :disabled="formEdit"  placeholder="请输入资源类型">
          <el-option v-for="item in  typeOptions" :key="item" :label="item" :value="item"> </el-option>
        </el-select>
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
        <span>按钮或资源</span>
      <menu-element :menuId='currentId' ref="menuElement"></menu-element>
    </el-card>
  </el-col>
</el-row>
  </div>
</template>

<script>
import {
  fetchTree, getObj, addObj, delObj, putObj, validateCode
} from '@/api/admin/menu/index';
import { mapGetters } from 'vuex';
import { getElements, getMenus, hasChild } from '@/utils/permission'
export default {
  name: 'menu',
  components: {
    'menu-element': () => import('./components/element')
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
      // typeOptions: ['menu', 'button'],
      typeOptions: ['menu'],
      listQuery: {
        name: undefined
      },
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      labelPosition: 'right',
      form: {
        code: undefined, //编码
        title: undefined, //标题
        parentId: undefined, //父节点
        href: undefined, //
        icon: undefined, //图标
        orderNum: undefined, //排序
        description: undefined, //描述
        path: undefined, //菜单路由
        view: undefined,//试图路径
        uri: undefined,//后台请求路径
        status: undefined, //启用禁用删除
        type: undefined //
      },
      rules: {
        code: [
          {
            required: true,
            message: '请输入菜单编码',
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
        title: [
          {
            required: true,
            message: '请输入标题名称',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ],
        type: [{
          required: true,
          message: '请输入资源类型"',
          trigger: 'blur'
        }
        ]
      },
      currentId: -1,
      menuManager_btn_add: false,
      menuManager_btn_edit: false,
      menuManager_btn_del: false
    }
  },
  watch: {
    filterText(val) {
      this.$refs.menuTree.filter(val);
    }
  },
  created() {
    this.getList();
    const elements = {}
    getElements(this.menus,elements);
    this.menuManager_btn_add = elements['menuManager:btn_add'] | this.role =='admin';
    this.menuManager_btn_del = elements['menuManager:btn_del'] | this.role =='admin';
    this.menuManager_btn_edit = elements['menuManager:btn_edit'] | this.role =='admin';
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
        this.treeData = getMenus(res.data);
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
      this.$refs.menuElement.parentId = data.id;
      this.$refs.menuElement.getList();
    },
    handlerEdit() {
      if (this.form.id) {
        this.formEdit = false;
        this.formStatus = 'update';
      }
    },
    handlerAdd() {
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
        title: undefined, //标题
        parentId:  this.currentId, //父节点
        href: undefined, //
        icon: undefined, //图标
        orderNum: undefined, //排序
        description: undefined, //描述
        path: undefined, //菜单路由
        view: undefined,//试图路径
        uri: undefined,//后台请求路径
        status: undefined, //启用禁用删除
        type: undefined //
      };
    }
  }
}
</script>

