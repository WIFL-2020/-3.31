<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="showDialog =true"
              >新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table border="" :data="list">
              <el-table-column align="center" label="序号" width="120" type="index" />
              <el-table-column align="center" label="角色名称" prop="name" width="240" />
              <el-table-column align="center" label="描述" prop="description" />
              <el-table-column align="center" label="操作">
                <template slot-scope="{row}">
                  <el-button size="small" type="success" @click="assignPerm(row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <!-- 分页组件 -->
              <el-pagination
                layout="prev,pager,next"
                :current-page="page.page"
                :page-size="page.pagesize"
                :total="page.total"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="formDate.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formDate.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formDate.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formDate.remarks" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>

        </el-tabs>
      </el-card>
    </div>
    <!-- 弹层组件 -->
    <el-dialog :title="show" :visible="showDialog" @close="btnCancel">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 放置弹层 -->
    <el-dialog title="分配权限" :visible="showPermDialog" @close="btnPermCancel">
      <!-- 权限是一颗树 -->
      <!-- 将数据绑定到组件上 -->
      <!-- check-strictly 如果为true 那表示父子勾选时  不互相关联 如果为false就互相关联 -->
      <!-- id作为唯一标识 -->
      <el-tree
        ref="permTree"
        :data="permData"
        :props="defaultProps"
        :show-checkbox="true"
        :check-strictly="true"
        :default-expand-all="true"
        :default-checked-keys="selectCheck"
        node-key="id"
      />
      <!-- 确定 取消 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnPermOK">确定</el-button>
          <el-button size="small" @click="btnPermCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole } from '@/api/setting'
import { mapGetters } from 'vuex'
import { tranListToTreeData } from '@/utils'
import { getPermissionList } from '@/api/permisson'
import { assignPerm } from '@/api/setting'
export default {
  data() {
    return {
      // 接收的数组
      list: [],
      page: {
        // 页码
        page: 1,
        // 每页条数
        pagesize: 10,
        // 记录总数
        total: 0
      },
      // 承载信息
      formDate: {},
      // 获取的弹层信息
      roleForm: {
        name: '',
        description: ''
      },
      // 控制弹显示
      showDialog: false,
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
      showPermDialog: false, // 控制分配权限弹层的显示后者隐藏
      defaultProps: {
        label: 'name'
      },
      permData: [], // 专门用来接收权限数据 树形数据
      selectCheck: [], // 定义一个数组来接收 已经选中的节点
      roleId: null // 用来记录分配角色的id
    }
  },
  computed: {
    ...mapGetters(['companyId']),
    show() {
      return this.roleForm.id ? '编辑角色' : '新增角色'
    }
  },
  created() {
    // 获取公司角色列表
    this.getRoleList()
    // 获取公司信息
    this.getCompanyInfo()
  },
  methods: {
    async getRoleList() {
      const { rows, total } = await getRoleList(this.page)
      // 总数
      this.page.total = total
      this.list = rows
    },
    async getCompanyInfo() {
      // 获取的数据放在formDate里面存储起来
      this.formDate = await getCompanyInfo(this.companyId)
    },
    // 点击翻页事件    传入当前点击的页码
    changePage(newPage) {
      this.page.page = newPage
      // 刷新
      this.getRoleList()
    },
    // 删除角色
    async deleteRole(id) {
      try {
        await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }) // 删除问一下
        await deleteRole(id) // 调用删除接口
        if (this.page.total - (this.page.page - 1) * this.page.pagesize === 1) {
          this.page.page !== 1 && this.page.page--
        }
        this.getRoleList() // 重新获取数据
        this.$message.success('删除数据成功') // 删除成功提示语
      } catch (error) {
        console.log(error)
      }
    },
    async editRole(id) {
      // 获取数据
      this.roleForm = await getRoleDetail(id)
      // 显示弹层
      this.showDialog = true
    },
    // 确定按钮
    async btnOK() {
      try {
        // 先对表单整体校验
        await this.$refs.roleForm.validate()
        if (this.roleForm.id) {
          // 成功之后 上传  --- 编辑业务
          await updateRole(this.roleForm)
        } else {
          // 新增业务   ----调用新增角色接口
          await addRole(this.roleForm)
        }
        // 重新获取数据  -----刷新数据
        this.getRoleList()
        // 成功提示消息
        this.$message.success('编辑成功')
        // 弹层隐藏
        this.showDialog = false
      } catch (error) {
        console.log(error)
      }
    },
    // 取消按钮事件
    btnCancel() {
      // 重置表单数据
      this.roleForm = {
        name: '',
        description: ''
      }
      // 调用element resetFields属性  重置表单
      this.$refs.roleForm.resetFields
      // 关闭弹层
      this.showDialog = false
    },
    async assignPerm(id) {
      // 获取所有的权限点
      this.permData = tranListToTreeData(await getPermissionList(), '0')
      // 记录Id
      this.roleId = id
      // 应该去获取 这个id的 权限点
      // 有id 就可以 id应该先记录下来
      const { permIds } = await getRoleDetail(id) // permIds是当前角色所拥有的权限点数据
      this.selectCheck = permIds // 将当前角色所拥有的权限id赋值
      this.showPermDialog = true
    },
    btnPermCancel() {
      this.selectCheck = [] // 重置数据
      this.showPermDialog = false
    },
    async  btnPermOK() {
      // 调用el-tree的方法
      // console.log(this.$refs.permTree.getCheckedKeys())
      await assignPerm({ permIds: this.$refs.permTree.getCheckedKeys(), id: this.roleId })
      this.$message.success('分配权限成功')
      this.showPermDialog = false
    }

  }
}
</script>

<style lang="sass">

</style>
