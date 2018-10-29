<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="资源名称"
                v-model="listQuery.name"></el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" v-if="menuManager_btn_element_add" style="margin-left: 10px;" @click="handleCreate"
                 type="primary" icon="edit">添加
      </el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row
              style="width: 100%">
      <!--<el-table-column align="center" label="id" width="65">-->
        <!--<template scope="scope">-->
          <!--<span>{{scope.row.id}}</span>-->
        <!--</template>-->

      <!--</el-table-column>-->
      <el-table-column width="200px" align="center" label="资源编码">
        <template scope="scope">
  <span>
    {{scope.row.code}}</span>
        </template>

      </el-table-column>
      <el-table-column width="100px" align="center" label="资源类型">
        <template scope="scope">
  <span>
    {{scope.row.type}}</span>
        </template>

      </el-table-column>
      <el-table-column width="120px" align="center" label="资源名称">
        <template scope="scope">
  <span>
    {{scope.row.title}}</span>
        </template>

      </el-table-column>
      <el-table-column width="200px" align="center" label="资源地址">
        <template scope="scope">
  <span>
    {{scope.row.uri}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="描述">
        <template scope="scope">
  <span>
    {{scope.row.description}}</span>
        </template>

      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template scope="scope">
          <el-button v-if="menuManager_btn_element_edit" size="small" type="success" @click="handleUpdate(scope.row)">
            编辑
          </el-button>
          <el-button v-if="menuManager_btn_element_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>

      </el-table-column>
    </el-table>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="资源编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入资源编码"></el-input>
        </el-form-item>
        <el-form-item label="资源类型" prop="type">
          <el-select class="filter-item" v-model="form.type" placeholder="请输入资源类型">
            <el-option v-for="item in  typeOptions" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入资源名称"></el-input>
        </el-form-item>
        <el-form-item label="资源地址" prop="uri">
          <el-input v-model="form.uri" placeholder="请输入资源地址"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" placeholder=""></el-input>
        </el-form-item>
        <!--<el-form-item label="资源请求类型" prop="method">-->
        <!--<el-select class="filter-item" v-model="form.method" placeholder="请输入资源请求类型">-->
        <!--<el-option v-for="item in  methodOptions" :key="item" :label="item" :value="item"> </el-option>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getElementList,
    addObj,
    getObj,
    delObj,
    putObj
  } from '@/api/admin/menu/index';
  import {mapGetters} from 'vuex';
  import {getElements} from '@/utils/permission'

  export default {
    name: 'element',
    // props: {
    //   parentId: {
    //     default: '1'
    //   }
    // },
    data() {
      return {
        // methodOptions: ['GET', 'POST', 'PUT', 'DELETE'],
        // typeOptions: ['uri', 'button'],
        typeOptions: ['button'],
        form: {
          code: undefined,
          type: undefined,
          title: undefined,
          uri: undefined,
          parentId: undefined,
          method: undefined,
          description: undefined
        },
        rules: {
          code: [{
            required: true,
            message: '请输入资源编码',
            trigger: 'blur'
          }
          ],
          type: [{
            required: true,
            message: '请选择资源类型',
            trigger: 'blur'
          },
            {
              min: 2,
              max: 20,
              message: '长度在 2 到 20 个字符',
              trigger: 'blur'
            }
          ],
          name: [{
            required: true,
            message: '请输入资源名称',
            trigger: 'blur'
          },
            {
              min: 2,
              max: 20,
              message: '长度在 2 到 20 个字符',
              trigger: 'blur'
            }
          ]
        },
        list: null,
        listLoading: true,
        listQuery: {
          name: undefined,
          parentId: this.parentId
        },
        dialogFormVisible: false,
        dialogStatus: '',
        menuManager_btn_element_add: false,
        menuManager_btn_element_edit: false,
        menuManager_btn_element_del: false,
        parentId: -1,
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
      getElements(this.menus, elements);
      this.menuManager_btn_element_add = elements['menuManager:btn_element_add'] | this.role == 'admin'
      this.menuManager_btn_element_del = elements['menuManager:btn_element_del'] | this.role == 'admin'
      this.menuManager_btn_element_edit = elements['menuManager:btn_element_edit'] | this.role == 'admin'
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
        this.listQuery.parentId = this.parentId;
        getElementList(this.listQuery).then(response => {
          this.list = response.data;
          this.listLoading = false;
        })
      },
      handleFilter() {
        this.getList();
      },
      handleCreate() {
        this.resetTemp();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
      },
      handleUpdate(row) {
        getObj({"id": row.id}).then(response => {
          this.form = response.data;
          this.dialogFormVisible = true;
          this.dialogStatus = 'update';
        });
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj({"id": row.id}).then(() => {
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
      create(formName) {
        const set = this.$refs;
        this.form.parentId = this.parentId;
        set[formName].validate(valid => {
          if (valid) {
            addObj(this.form).then(() => {
              this.dialogFormVisible = false;
              this.getList();
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              });
            })
          } else {
            return false;
          }
        });
      },
      cancel(formName) {
        this.dialogFormVisible = false;
        const set = this.$refs;
        set[formName].resetFields();
      },
      update(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false;
            this.form.password = undefined;
            putObj(this.form).then(() => {
              this.dialogFormVisible = false;
              this.getList();
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              });
            });
          } else {
            return false;
          }
        });
      },
      resetTemp() {
        this.form = {
          code: undefined,
          type: undefined,
          name: undefined,
          uri: undefined,
          parentId: undefined,
          method: undefined,
          description: undefined
        };
      }
    }
  }
</script>
