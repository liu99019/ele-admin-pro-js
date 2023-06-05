<template>
  <div class="container">
  <el-button type="primary" class="add-btn" @click="showDialog">新增</el-button>
  <!--------------------- 搜索 ------------------------------------>
  <div>
      <el-date-picker
      v-model="start"
      type="date"
      style="margin-left: 10px;"
      placeholder="选择开始日期"
      :picker-options="pickerOptions"
    ></el-date-picker>
    
    <el-date-picker
      v-model="end"
      type="date"
      style="margin-left: 10px;"
      placeholder="选择结束日期"
      :picker-options="pickerOptions"
    ></el-date-picker>

    <el-select v-model="stock" style="margin-left: 10px;" placeholder="混凝土型号">
      <el-option
      v-for="item in stocks"
      :key="item.id"
      :label="item.concreteType"
      :value="item.concreteType"
      />
    </el-select>
    <el-button style="margin-left: 10px;" :icon="Search" @click="search()">搜索</el-button>
  </div>
  <!--------------------- 表格展示 ---------------------------------->
  <el-table :data="tableData" style="width: 100%">
  <el-table-column prop="shipmentDate" label="出货日期"></el-table-column>
  <el-table-column prop="shipmentOrderNo" label="出货单号"></el-table-column>
  <el-table-column prop="customer" label="客户"></el-table-column>
  <el-table-column prop="concreteType" label="混凝土型号"></el-table-column>
  <el-table-column prop="quantity" label="数量"></el-table-column>
  <el-table-column prop="price" label="单价"></el-table-column>
  <el-table-column prop="totalPrice" label="总价"></el-table-column>
  <el-table-column label="操作">
  <template #default="{row}">
  <el-button type="text" @click="handleDelete(row)">删除</el-button>
  </template>
  </el-table-column>
  </el-table>
  <!------------------------ 新增出货单 ---------------------------->
  <el-dialog v-model="dialogVisible" title="新增出货单" width="480px">
    <el-form :model="form" :rules="dialogRules">
      <el-form-item label="客户名" prop="customer" :label-width="formLabelWidth">
        <el-input v-model="form.customer" autocomplete="off" />
      </el-form-item>
      <el-form-item label="混凝土型号" prop="concreteType" :label-width="formLabelWidth">
        <el-select v-model="form.concreteType" placeholder="请选择混凝土型号">
          <el-option
            v-for="item in stocks"
            :key="item.id"
            :label="item.concreteType"
            :value="item.concreteType"
            />
         </el-select>
      </el-form-item>
      <el-form-item label="数量" prop="quantity" :label-width="formLabelWidth">
        <el-input placeholder="" v-model="form.quantity" autocomplete="off" />
      </el-form-item>
      <el-form-item label="价格" prop="price" :label-width="formLabelWidth">
        <el-input v-model="form.price" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="formSubmit">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
  <!-------------------------分页条 -------------------------------->
  <div class="example-pagination-block" style="width: 350px;margin: 30px auto;margin-top: 4px;" >
    <el-pagination layout="prev, pager, next" v-model:current-page="pageinfo.pageNum" :total="pageTotal" :page-size="pageinfo.pageSize" @current-change="handleCurrentChange()"/>
  </div>

  </div>
  </template>
  
  <script setup>
  import { ref,reactive,onMounted} from 'vue'
  import { ElMessage, ElMessageBox} from 'element-plus'
  import {MessageBox, Search} from '@element-plus/icons-vue'
  import request from "@/utils/request"
  const tableData = ref([])
  const dialogVisible = ref(false)
  const stocks = ref([])
  const stock = ref()
  const pageTotal=ref(50)
  const pageinfo=reactive({
      pageSize:4,
      pageNum:1
    })

  const form = ref(
    {
  "concreteType": "",
  "customer": "",
  "id": '',
  "price": '',
  "quantity": '',
  "shipmentDate": "",
  "shipmentOrderNo": "",
  "totalPrice": ''
}
  )
  
  onMounted(()=>{
    getShips();
    getStock();
  })
  const showDialog = () => {
    dialogVisible.value = true
  }
  
  const getShips=()=>{
    request.get(`/ship/pages/${pageinfo.pageNum}/${pageinfo.pageSize}`)
      .then(
        res=>{
          tableData.value=res.data.data.list
          pageTotal.value= res.data.data.count
      }
      ).catch(
        err => {
          console.log(err)
        })
  }

  const getStock=()=>{
    request.get(`/stock/getAll`)
      .then(
        res=>{
            stocks.value=res.data.data
      }
      ).catch(
        err => {
          console.log(err)
        })
  }

  const handleCurrentChange=()=>{
    getShips();
  }

  const handleDelete = (row) => {
    ElMessageBox.confirm('确认删除该行数据吗?', '提示', { type: 'warning' }).then(() => {
      request.delete(`/ship/deleteByID/${row.id}`).then(res=>{
        if(res.data.code==0){
          ElMessage.success('删除成功！')
        }else{
          ElMessage.error('删除失败！')
        }
      })
    }).catch(err=>{
      console.log(err)
    })
  }


  const formSubmit = () => {{
    request.post(`ship/save`,form.value).then(res=>{
      if(res.data.code=0){
        ElMessage.success('保存成功！')
        dialogVisible.value=false
      }
      else{
        ElMessage.error({
                        message: res.data.message
                  });
      }
      clearnForm()
    }).catch(rsp=>{
      console(rsp)
    })    
  }}

  const clearnForm=()=>{
    form.value={
  "concreteType": "",
  "customer": "",
  "id": '',
  "price": '',
  "quantity": '',
  "shipmentDate": "",
  "shipmentOrderNo": "",
  "totalPrice": ''
}
  }
  const search = () => {
      const startDate = formatDate(start.value);
      const endDate = formatDate(end.value);
      request.get(`/ship/search?startDate=${startDate}&endDate=${endDate}&concreteType=${stock.value}`)
        .then((response) => {
          console.log(response.data.code)
          if(response.data.code==0){
            tableData.value = response.data.data;
            ElMessage.success("查找成功")
            console.log(response.data.data)
            
          }else{
            ElMessage.error("查找失败")
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

 
    const formatDate = (date) => {
      const YYYY = date.getFullYear();
      const MM = String(date.getMonth() + 1).padStart(2, '0');
      const DD = String(date.getDate()).padStart(2, '0');
      return `${YYYY}-${MM}-${DD}`;
    };

    const start = ref('');
    const end = ref('');

    const pickerOptions = {
      shortcuts: [
        {
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          },
        },
        {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          },
        },
        {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          },
        },
      ],
    };

    
    const dialogRules=reactive(
      { customer: [{ required: true, message: '请填写客户名称', trigger: 'blur' }],
        concreteType: [{ required: true, message: '请选择混凝土型号', trigger: 'blur' }],
        quantity: [{ required: true, message: '请填写数量', trigger: 'blur' }],
        price: [{ required: true, message: '请填写单价', trigger: 'blur' }]}
     )
  
  </script>

<style scoped>
.el-button--text {
  margin-right: 15px;
}
.el-select {
  width: 300px;
}
.el-input {
  width: 300px;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>