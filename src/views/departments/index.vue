<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <el-tabs>
          <el-tab-pane label="公司架构" />
        </el-tabs>
        <!-- 用了一个行列布局 -->
        <tree-tools :tree-node="company" :is-root="true" @addDepts="addDepts" />
        <el-tree :data="departs" :default-expand-all="true" :props="defaultProps">
          <!-- 作为对象  对象里面的data -->
          <tree-tools slot-scope="obj" :tree-node="obj.data" @delDepts="getDepartments" @addDepts="addDepts" @editDepts="editDepts" />
        </el-tree>
      </el-card>
    </div>
    <add-dept ref="addDept" :show-dialog.sync="showDialog" :tree-node="node" @addDepts="getDepartments" />
  </div>
</template>

<script>
import TreeTools from './components/tree-tools'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'
import AddDept from './components/add-dept' // 新增部门的弹层
export default {
  components: {
    TreeTools, AddDept
  },
  data() {
    return {
      company: { name: '', manager: '负责人' },
      departs: [],
      defaultProps: {
        label: 'name' // 表示 从这个属性显示内容
      },
      // 控制弹窗的显示与隐藏
      showDialog: false,
      // 记录当前点击的节点
      node: null
    }
  },
  created() {
    // 调用自身的方法
    this.getDepartments()
  },
  methods: {
    // 获取数据
    async getDepartments() {
      // 开启进度条显示
      this.loading = true
      const result = await getDepartments()
      // 保存数据   以及填充数据
      this.company = { name: result.companyName, manager: '负责人', id: '' }
      // 调用封装好多的递归函数、 将数组进行转化
      this.departs = tranListToTreeData(result.depts, '')
      // console.log(result)
      // 关闭进度条
      this.loading = false
    },
    addDepts(node) {
      // 因为node是当前的点击的部门， 此时这个部门应该记录下来,
      this.showDialog = true
      this.node = node
    },
    editDepts(node) {
      // 打开弹出框
      this.showDialog = true
      // 记录节点
      this.node = node
      this.$refs.addDept.getDepartDetail(node.id) // 直接调用子组件中的方法 传入一个id
    }
  }
}
</script>

<style>
.tree-card {
  padding: 30px  140px;
  font-size:14px;
}
</style>
