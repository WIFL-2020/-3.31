<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <span slot="before">共{{ page.total }}条记录</span>
        <template slot="after">
          <el-button size="small" type="warning" @click="$router.push('/import')">导入</el-button>
          <el-button size="small" type="danger">导出</el-button>
          <el-button :disabled="!checkPermission('POINT-USER-ADD')" size="small" type="primary" @click="showDialog=true">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card v-loading="loading">
        <el-table border :data="list">
          <el-table-column label="序号" type="index" sortable="" />
          <el-table-column label="姓名" prop="username" sortable="" />
          <el-table-column label="工号" prop="workNumber" sortable="" />
          <el-table-column label="聘用形式" :formatter="formatEmployment" prop="formOfEmployment" sortable="" />
          <el-table-column label="部门" prop="departmentName" sortable="" />
          <el-table-column label="入职时间" prop="timeOfEntry" sortable="">
            <template slot-scope="{row}">
              {{ row.timeOfEntry |formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" prop="enableState" sortable="">
            <template slot-scope="{row}">
              <el-switch :value="row.enableState===1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="{row}">
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
              <el-button type="text" size="small" @click="deleteEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination
            :current-page="page.page"
            :page-size="page.size"
            :total="page.total"
            layout="prev, pager, next"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
    </div>
    <add-demployee :show-dialog.sync="showDialog" />

    <!-- 放置分配组件 -->
    <assign-role ref="assignRole" :show-role-dialog.sync="showRoleDialog" :user-id="userId" />
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddDemployee from './components/add-employee'
import AssignRole from './components/assign-role'
export default {
  components: {
    AddDemployee, AssignRole
  },
  data() {
    // 承载数据
    return {
      list: [],
      page: {
        // 页码
        page: 1,
        // 每页页数
        size: 10,
        // 总页数
        total: 0
      },
      showDialog: false,
      // 分配组件的显示隐藏
      showRoleDialog: false,
      // 添加userId
      userId: null
    }
  },
  created() {
    // 调用接口获取页面初始化数据
    this.getEmployeeList()
  },
  methods: {
    // 获取初始化方法
    async getEmployeeList() {
      // 开启进度条效果
      this.loading = true
      // 获取数据并结构
      const { total, rows } = await getEmployeeList(this.page)
      // 放在定义好的容器中
      this.list = rows
      this.page.total = total
      this.loading = false
    },
    // 分页效果
    changePage(newPage) {
      this.page.page = newPage
      // 重新更新数据
      this.getEmployeeList()
    },
    // 格式化聘用形式
    formatEmployment(row, column, cellValue, index) {
      // 要去找 1所对应的值
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    // 删除员工的方法
    async deleteEmployee(id) {
      try {
        // await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // })
        await this.$confirm('您确定删除该员工吗')
        // 调用删除接口
        await delEmployee(id)
        // 重新获取数据 刷新数据
        this.getEmployeeList()
        // 成功提示消息
        this.$message.success('删除数据成功')
      } catch (error) {
        // 失败打印错误
        console.log(error)
      }
    },
    async editRole(id) {
      this.userId = id
      // 弹出层
      await this.$refs.assignRole.getUserDetailById(id)
      this.showRoleDialog = true
    }
  }
}
</script>
<style lang="">

</style>
