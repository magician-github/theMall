<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/welcome'}">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            clearable
            @clear="getUserList"
            v-model="queryInfo.query"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="changeState(scope.row)"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="showUserEditDialog(scope.row.id)"
              circle
              size="mini"
            ></el-button>
            <el-button type="info" icon="el-icon-delete" circle size="mini" @click="removeUserById(scope.row.id)"></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              :enterable="false"
              placement="top"
            >
              <el-button type="warning" icon="el-icon-star-off" circle size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="closeDialog">
      <el-form
        :model="userForm"
        :rules="userFormRules"
        ref="userFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="userForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">添加</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改用户" @close="resetEditFrom" :visible.sync="showEditUser" width="50%">
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEditUser = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var validteEmil = (rule, value, cb) => {
      var reg = /[\w|\d|_||$]+@[\w]+\.[\w|\d|_|$]/
      if (!reg.test(value)) {
        cb(new Error("请输入合格的邮箱"))
        return
      }
      cb()
    }
    var validteMobile = (rule, value, cb) => {
      var reg = /1\d{10}/
      if (reg.test(value)) {
        cb()
        return
      }
      cb(new Error("请输入合格的电话"))
    }
    return {
      userForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      userFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 16, message: "长度在 3 到 10个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: validteEmil, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入电话", trigger: "blur" },
          { validator: validteMobile, trigger: "blur" }
        ]
      },
      addDialogVisible: false,
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 4
      },
      userList: [],
      total: 0,
      showEditUser: false,
      editForm: {},
      editFormRules:{
         email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: validteEmil, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入电话", trigger: "blur" },
          { validator: validteMobile, trigger: "blur" }
        ]
        
      }
    }
  },
  methods: {
    resetEditFrom(){
      this.$refs.editFormRef.resetFields();
    },
    closeDialog() {
      this.$refs.userFormRef.resetFields()
    },
    addUser() {
      this.$refs.userFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        const { data: resp } = await this.$http.post("users", this.userForm)
        console.log(resp.meta.status)
        if (resp.meta.status !== 201) {
          this.$message.error("添加用户失败")
          return
        }
        this.$message.success("添加用户成功")

        this.addDialogVisible = false
        this.getUserList()
      })
    },
    async getUserList() {
      const { data: resp } = await this.$http.get("users", {
        params: {
          ...this.queryInfo
        }
      })
      if (resp.meta.status !== 200) {
        this.$message.error("获取用户错误")
        return
      }
      this.userList = resp.data.users
      this.total = resp.data.total
    },
    async showUserEditDialog(id) {
      this.showEditUser = true
      const { data: resp } = await this.$http.get("users/" + id)
      if (resp.meta.status !== 200)
        return this.$message.error("查询用户信息失败")
      this.editForm = resp.data
      this.$message.success("查询用户信息成功")
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    async changeState(newState) {
      const { data: resp } = await this.$http.put(
        `users/${newState.id}/state/${newState.mg_state}`
      )
      if (resp.meta.status !== 200) {
        newState.mg_state = !newState.mg_state
        this.$message.error("修改转态失败")
        return
      }
      this.$message.success("更新转态成功")
    },
    editUserInfo(){
      this.$refs.editFormRef.validate(async (valid)=>{
        if(!valid){
          this.$message.error("修改的信息不合法");
          return
        }
        const {data:resp} = await this.$http.put('users/' + this.editForm.id,{
          email:this.editForm.email,
          mobile:this.editForm.mobile
        })
        if(resp.meta.status !== 200) return this.$message.error("修改用户失败");
        this.$message.success("修改用户成功");
        this.showEditUser = false;
        this.getUserList(); 

      })
    },
    async removeUserById(removeId){
       const result = await this.$confirm('此操作将永久删用户, 是否继续?', '友情提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err);
        if(result!=='confirm') return this.$message.error("取消删除");
        const {data:resp} = await this.$http.delete('users/' + removeId);
        if(resp.meta.status !=200) return this.$message.error("删除失败");
        this.$message.success("删除成功");
        this.getUserList();
    }


  },
  created() {
    this.getUserList()
  }
}
</script>

<style>
/* .box-card{
    margin-top:10px;
    
} */
.el-pagination {
  margin-top: 10px;
}
.el-breadcrumb {
  margin-bottom: 15px;
}
.el-table {
  margin-top: 15px;
  font-size: 12px;
}
.el-talbe_body tr,
td,
thead,
th {
  text-align: center !important;
}
</style>