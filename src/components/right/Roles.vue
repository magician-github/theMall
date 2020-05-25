<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/welcome'}">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="isShowRoleDialog = true">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="roleList" border stripe class="roleTable">
        <el-table-column type="expand"></el-table-column>

        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="editRole(scope.row.id)"
              circle
              size="mini"
            ></el-button>
            <el-button
              type="info"
              icon="el-icon-delete"
              circle
              size="mini"
              @click="removeRoleById(scope.row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配权限"
              :enterable="false"
              placement="top"
            >
              <el-button type="warning" icon="el-icon-star-off" circle size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="添加角色" :visible.sync="isShowRoleDialog" width="40%" @close="closeDialog">
      <el-form
        :model="roleForm"
        ref="roleFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="roleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
       
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddRole">添加</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改角色" :visible.sync="isShowEditDialog" width="40%">
      <el-form
        :model="editRoleForm"
        ref="editRoleFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
       
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditRole">添加</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    return {
      roleList:[],
      isShowRoleDialog:false,
      isShowEditDialog:false,
      roleForm:{
        roleName:'',
        roleDesc:''
      },
      editRoleForm:{
        roleName:'',
        roleDesc:'',
        roleId:''
      }
    }
  },
  created(){
    this.getRoleList();
  },
  methods:{
    async getRoleList(){
      const {data:resp} = await this.$http.get('roles');
      if(resp.meta.status !==200) {
        this.$message.error('获取角色列表失败');
      }
      this.roleList = resp.data;
    },
    async confirmAddRole(){
      const {data:resp} = await this.$http.post('roles',this.roleForm);
      if(resp.meta.status !==201) return this.$message.error('添加失败');
      this.$message.success('添加角色成功');
      this.isShowRoleDialog = false;
      this.getRoleList();
    },
    closeDialog(){
      this.$refs.roleFormRef.resetFields();
    },
    async editRole(id){
      this.isShowEditDialog = true;
      const {data:resp} = await this.$http.get('roles/'+id);
      if(resp.meta.status!==200) return this.$message.error("获取角色失败");
      console.log(resp)
      this.editRoleForm.roleName = resp.data.roleName;
      this.editRoleForm.roleDesc = resp.data.roleDesc;
      this.editRoleForm.roleId = resp.data.roleId;
    },
    async confirmEditRole(){
      const {data:resp} = await this.$http.put('roles/'+ this.editRoleForm.roleId,this.editRoleForm);
      if(resp.meta.status !==200) return this.$message.error("修改失败");
      this.$message.success('修改成功');
      this.isShowEditDialog = false;
      this.getRoleList();

    },
    async removeRoleById(id) {
      const result = await this.$confirm('此操作将永久此角色, 是否继续?', '友情提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err);
      if(result!=='confirm') return this.$message.error("取消删除");
      const {data:resp} = await this.$http.delete('roles/'+id);
      if(resp.meta.status !==200) return this.$message.error("删除失败");
      this.$message.success("删除成功");
      this.getRoleList();

    }
   
    

}
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 20px;
}
.roleTable tr,
td {
  text-align: center;
}
</style>