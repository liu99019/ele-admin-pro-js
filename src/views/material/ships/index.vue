<template>
    <div class="container">
      <el-button type="primary" class="add-btn" @click="showDialog">新增</el-button>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="shipmentDate" label="出货日期"></el-table-column>
        <el-table-column prop="shipmentOrderNo" label="出货单号"></el-table-column>
        <el-table-column prop="customer" label="客户"></el-table-column>
        <el-table-column prop="material" label="原材料名称"></el-table-column>
        <el-table-column prop="quantity" label="数量"></el-table-column>
        <el-table-column prop="price" label="单价"></el-table-column>
        <el-table-column prop="totalPrice" label="总价"></el-table-column>
        <el-table-column label="操作">
          <template #default="{row}">
            <el-button type="text" @click="handleEdit(row)">编辑</el-button>
            <el-button type="text" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <el-dialog v-model="dialogVisible" title="出货单据信息">
        <el-form :model="form" :rules="rules" ref="form" label-width="80px" style="padding: 20px">
          <el-form-item label="出货日期" prop="shipmentDate">
            <el-date-picker v-model="form.shipmentDate" type="date" placeholder="请选择出货日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="出货单号" prop="shipmentOrderNo">
            <el-input v-model="form.shipmentOrderNo" placeholder="请输入出货单号"></el-input>
          </el-form-item>
          <el-form-item label="客户" prop="customer">
            <el-input v-model="form.customer" placeholder="请输入客户名称"></el-input>
          </el-form-item>
          <el-form-item label="原材料名称" prop="material">
            <el-input v-model="form.material" placeholder="请输入原材料名称"></el-input>
          </el-form-item>
          <el-form-item label="数量" prop="quantity">
            <el-input v-model.number="form.quantity" placeholder="请输入数量"></el-input>
          </el-form-item>
          <el-form-item label="单价" prop="price">
            <el-input v-model.number="form.price" placeholder="请输入单价"></el-input>
          </el-form-item>
          <el-form-item label="总价" prop="totalPrice">
            <el-input v-model.number="form.totalPrice" placeholder="请输入总价"></el-input>
          </el-form-item>
        </el-form>
  
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="formSubmit">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </template>

<script>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'ShipmentTable',
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      form: {
        shipmentDate: '',
        shipmentOrderNo: '',
        customer: '',
        material: '',
        quantity: 0,
        price: 0,
        totalPrice: 0
      },
      rules: {
        shipmentDate: [{ required: true, message: '请选择出货日期', trigger: 'change' }],
        shipmentOrderNo: [{ required: true, message: '请输入出货单号', trigger: 'blur' }],
        customer: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
        material: [{ required: true, message: '请输入原材料名称', trigger: 'blur' }],
        quantity: [{ required: true, message: '请输入数量', trigger: 'blur' }, { type: 'number', message: '请输入数字值' }],
        price: [{ required: true, message: '请输入单价', trigger: 'blur' }, { type: 'number', message: '请输入数字值' }],
        totalPrice: [{ required: true, message: '请输入总价', trigger: 'blur' }, { type: 'number', message: '请输入数字值' }]
      }
    }
  },
  created() {
    // 从后端获取数据，赋值给tableData
    this.tableData = [{ shipmentDate: '2022-01-01', shipmentOrderNo: 'SO001', customer: '客户A', material: '原材料A', quantity: 10, price: 100, totalPrice: 1000 }]
  },
  methods: {
    showDialog() {
      // 弹出新增对话框，重置form
      this.dialogVisible = true
      this.$refs.form.resetFields()
    },
    handleEdit(row) {
      // 弹出编辑对话框，填充表单数据
      this.dialogVisible = true
      this.form = Object.assign({}, row)
    },
    handleDelete(row) {
      // 弹出确认删除对话框，确认后删除该行数据
      ElMessageBox.confirm('确认删除该行数据吗?', '提示', { type: 'warning' }).then(() => {
        const index = this.tableData.indexOf(row)
        this.tableData.splice(index, 1)
        ElMessage.success('删除成功！')
      })
    },
    formSubmit() {
      // 校验表单，确认无误后新增或编辑数据
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.hasOwnProperty('id')) {
            // 编辑数据
            const index = this.tableData.findIndex(item => item.id === this.form.id)
            this.tableData.splice(index, 1, Object.assign({}, this.form))
            ElMessage.success('编辑成功！')
          } else {
            // 新增数据
            const id = this.tableData.length + 1
            this.tableData.push(Object.assign({}, this.form, { id }))
            ElMessage.success('新增成功！')
          }
          this.dialogVisible = false
        }
      })
    }
  }
}
</script>