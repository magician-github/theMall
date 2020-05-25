<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/welcome'}">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table class="rightTable" :data="rightsList" border stripe>
        <el-table-column type="index"></el-table-column>

        <el-table-column label="权限名称" prop="authName"></el-table-column>

        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '1'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '2'">二级</el-tag>
            <el-tag type="warn
            ing" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: []
    }
  },
  async created() {
    const { data: resp } = await this.$http.get("rights/list")
    this.rightsList = resp.data
  }
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 20px;
  overflow: auto;
}
.rightTabe tr,td {
  text-align: center;
}
</style>