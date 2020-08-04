<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card >
      <el-row :gutter="20">
        <el-col :span="8"><el-input placeholder="请输入内容" v-model="queryInfo.query" :clearable="true" @clear="getUsersList"><el-button slot="append" icon="el-icon-search" @click="getUsersList"></el-button></el-input></el-col>
        <el-col :span="4"><el-button type="primary" @click="addDialogVisible=true">添加用户</el-button></el-col>
      </el-row>
      <el-table :data="users" border :stripe="true">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label='电话'></el-table-column>
        <el-table-column prop="role_name" label='角色'></el-table-column>
        <el-table-column label='状态'>
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label='操作' width="220px">
          <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" :id="scope.row" @click="showEditDialog(scope.row.id)"></el-button>
              <el-button type="danger" icon="el-icon-delete" @click="deleteUser(scope.row.id)"></el-button>
              <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
                 <el-button type="warning" icon="el-icon-setting"></el-button>
              </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 3, 5]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
    title="添加用户"
    :visible.sync="addDialogVisible" width="50%" @close="addFormClear">
    <!-- 内容主体区 -->
    <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="70px">
      <el-form-item label="用户名" prop="username">
      <el-input v-model="addForm.username"></el-input>
       </el-form-item>
       <el-form-item label="密码" prop="password">
      <el-input v-model="addForm.password"></el-input>
       </el-form-item>
       <el-form-item label="邮箱" prop="email">
      <el-input v-model="addForm.email"></el-input>
       </el-form-item>
       <el-form-item label="手机" prop="mobile">
      <el-input v-model="addForm.mobile"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="addDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addUser" >确 定</el-button>
    </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%" @close="editFormClear">
      <el-form ref="editFormRef" label-width="80px" :model='editForm' :rules="editFormRules">
      <el-form-item label="用户名">
        <el-input v-model="editForm.username" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="editForm.mobile"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="editForm.email"></el-input>
      </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
</div>
</template>
<script>
export default {
  data() {
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      var regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) return cb()
      cb(new Error('请输入合法的邮箱'))
    }
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      var regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) return cb()
      cb(new Error('请输入合法的手机号'))
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      users: [],
      total: 0,
      addDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }, {
          min: 3, max: 14, message: '请输入3到14个字符', trigger: 'blur'
        }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '用户名的长度在6~15个字符之间',
            trigger: 'blur'
          }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' },
          {
            validator: checkMobile, trigger: 'blur'
          }]
      },
      editDialogVisible: false,
      // 根据查询用户信息表单
      editForm: {},
      editFormRules: {
        mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' },
          {
            validator: checkMobile, trigger: 'blur'
          }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUsersList()
  },
  methods: {
    async getUsersList() {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('用户列表获取失败')
      this.users = res.data.users
      this.total = res.data.total
    },
    handleSizeChange(pagesize) {
      this.queryInfo.pagesize = pagesize
      this.getUsersList()
    },
    handleCurrentChange(currentPage) {
      this.queryInfo.pagenum = currentPage
      this.getUsersList()
    },
    addFormClear() {
      this.$refs.addFormRef.resetFields()
    },
    async addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        // 如果没有，结束函数
        if (!valid) return false
        // 如果校验成功进行添加数据请求
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('用户添加失败')
        }
        this.$message.success('用户添加成功')
        this.addDialogVisible = false
        this.getUsersList()
      })
    },
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('查询用户数据失败')
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editFormClear() {
      this.$refs.editFormRef.resetFields()
    },
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put('users/' + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if (res.meta.status !== 200) return this.$message.error('更新用户信息失败')
        // 关闭窗口
        this.editDialogVisible = false
        // 更新用户列表
        this.getUsersList()
        // 提示修改用户成功
        this.$message.success('用户修改成功')
      })
    },
    async deleteUser(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => {
        return err
      })
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除用户')
      }
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除用户失败')
      // 更新用户列表
      this.getUsersList()
      // 提示删除成功
      this.$message.success('删除用户成功！')
    }
  }
}
</script>
<style lang="less" scoped>

</style>
