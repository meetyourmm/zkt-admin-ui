<template>
<div class="app-container calendar-list-container">
  <div class="filter-container">
    <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="姓名或账户" v-model="listQuery.name"> </el-input>
    <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
    <el-button class="filter-item"  v-if="userManager_btn_add"  style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
  </div>
  <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
    <!--<el-table-column align="center" label="序号" width="65"> <template scope="scope">-->
          <!--<span>{{scope.row.id}}</span>-->
        <!--</template> </el-table-column>-->
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
    <el-table-column width="180" align="center" label="最后时间"> <template scope="scope">
          <span>{{scope.row.updateTime | parseTime}}</span>
        </template> </el-table-column>
    <el-table-column width="200" align="center" label="最后更新人"> <template scope="scope">
            <span>{{scope.row.updateUserName}}</span>
          </template> </el-table-column>
    <el-table-column align="center" label="操作"> <template scope="scope">
        <el-button v-if="userManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
        </el-button>
        <el-button v-if="userManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
        </el-button>
      </template> </el-table-column>
  </el-table>
  <div v-show="!listLoading" class="pagination-container">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
  </div>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="姓名" prop="realName">
        <el-input v-model="form.realName" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="账户" prop="userName">
        <el-input v-if="dialogStatus == 'create'" v-model="form.userName" placeholder="请输入账户"></el-input>
        <el-input v-else v-model="form.userName" placeholder="请输入账户" readonly></el-input>
      </el-form-item>
      <el-form-item v-if="dialogStatus == 'create'" label="密码" placeholder="请输入密码" prop="password">
        <el-input type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-select class="filter-item" v-model="form.gender" placeholder="请选择">
          <el-option v-for="item in  sexOptions" :key="item" :label="item" :value="item"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="mobile">
        <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
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
  page,
  addObj,
  getObj,
  delObj,
  putObj,
  validateUser
} from '@/api/admin/user/index';
import { mapGetters } from 'vuex';
import { getElements } from '@/utils/permission'
import { validateMobile,validateEmail } from '@/utils/validate'

export default {
  name: 'user',
  data() {
    let validUser = (rule, userName, callback) => {
      if(this.dialogStatus == 'update'){
        callback()
      }
      //后台方法
      validateUser({userName}).then(res => {
        if (res.data === true) {
          callback('用户名已存在')
        } else {
          callback()
        }
      })
    }
    let validMobile = (rule, value, callback) => {
      if(!validateMobile(value)){
        callback('手机号格式错误')
      } else {
        callback()
      }
    }
    let validEmail = (rule, value, callback) => {
      if(!validateEmail(value)){
        callback('邮箱格式错误')
      } else {
        callback()
      }
    }
    return {
      form: {
        userName: undefined,
        realName: undefined,
        sex: '男',
        password: undefined,
        mobile: undefined,
        email: undefined
      },
      rules: {
        realName: [
          {
            required: true,
            message: '请输入用户姓名',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 20 个字符',
            trigger: 'blur'
          }
        ],
        userName: [
          {
            required: true,
            message: '请输入账户',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          },
          {
            validator:validUser,
            trigger: 'blur'
          }
        ],
        password: [
          // {
          //   required: true,
          //   message: '请输入密码',
          //   trigger: 'blur'
          // },
          {
            min: 6,
            max: 30,
            message: '长度在 6 到 30 个字符',
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            validator:validMobile,
            trigger: 'blur'
          }
        ],
        email: [
          {
            validator:validEmail,
            trigger: 'blur'
          }
        ]
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined
      },
      sexOptions: ['男', '女'],
      dialogFormVisible: false,
      dialogStatus: '',
      userManager_btn_edit: false,
      userManager_btn_del: false,
      userManager_btn_add: false,
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
    this.userManager_btn_edit = elements['userManager:btn_edit'] | this.role =='admin';
    this.userManager_btn_del = elements['userManager:btn_del'] | this.role =='admin';
    this.userManager_btn_add = elements['userManager:btn_add'] | this.role =='admin';
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
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = 'create';
      this.dialogFormVisible = true;
    },
    handleUpdate(row) {
      getObj({"id":row.id})
        .then(response => {
          this.form = response.data;
          this.dialogFormVisible = true;
          this.dialogStatus = 'update';
        });
    },
    handleDelete(row) {
      this.$confirm('此操作将删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delObj({"id":row.id})
            .then(() => {
              this.dialogFormVisible = false;
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
    create(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          addObj(this.form)
            .then(() => {
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
      this.$refs[formName].resetFields();
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
              message: '保存成功',
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
        userName: undefined,
        realName: undefined,
        sex: '男',
        password: undefined,
        mobile: undefined,
        email: undefined
      };
    }
  }
}
</script>
