<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancal">
    <!-- el-checkbox-group选中的是 当前用户所拥有的角色  需要绑定 当前用户拥有的角色-->
    <el-checkbox-group v-model="roleIds">
      <!-- 选项 -->
      <!-- 要循环的选项 -->
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        <el-button size="small" @click="btnCancal">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    // 用户的id 用来查询当前用户的角色信息
    userId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      // 定义容器
      list: [], // 角色列表
      roleIds: []// 拥有的角色
    }
  },
  created() {
    // 调用方法 获取页面初始化
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      // 默认数据
      const { rows } = await getRoleList({ page: 1, pagesize: 20 })
      this.list = rows // 赋值  异步渲染
    },
    // 这个方法 props是异步调用的
    async getUserDetailById(id) {
      // 结构数据
      const { roleIds } = await getUserDetailById(id)
      // 存值
      this.roleIds = roleIds
    },
    // 确定
    async btnOk() {
      // 调用分配权限接口   传入ID 以及roleIds
      await assignRoles({ id: this.userId, roleIds: this.roleIds })
      // 调用自定义方法
      this.$emit('update:showRoleDialog', false)
      // 成功提示消息
      this.$message.success('角色分配成功')
    },
    // 取消
    btnCancal() {
      // 重置多选
      this.roleIds = []
      // 调用父组件方法 隐藏分配列表的弹层
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>

