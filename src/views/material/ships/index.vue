<template>
  <div class="container">
  <el-button type="primary" class="add-btn" @click="showDialog" style="margin-left: 10px;margin-top: 10px;margin-bottom: 10px;">新增</el-button>
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
  <el-table-column prop="customer" label="客户" width="80px"></el-table-column>
  <el-table-column prop="concreteType" label="混凝土型号"></el-table-column>
  <el-table-column prop="state" label="订单状态">
      <template #default="scope">
        <el-tag v-if="scope.row.state == 0" class="ml-2" type="info">{{ getStateText(scope.row.state)}}</el-tag>
        <el-tag v-if="scope.row.state == 1" class="ml-2" >{{ getStateText(scope.row.state)}}</el-tag>
        <el-tag v-if="scope.row.state == 2" class="ml-2" >{{ getStateText(scope.row.state)}}</el-tag>
        <el-tag v-if="scope.row.state == 3" class="ml-2" >{{ getStateText(scope.row.state)}}</el-tag>
        <el-tag v-if="scope.row.state == 4" class="ml-2" type="danger">{{ getStateText(scope.row.state)}}</el-tag>
        <el-tag v-if="scope.row.state == 5" class="ml-2" type="success">{{ getStateText(scope.row.state)}}</el-tag>
      </template>
  </el-table-column>
  <el-table-column prop="quantity" label="数量"></el-table-column>
  <el-table-column prop="price" label="单价"></el-table-column>
  <el-table-column prop="totalPrice" label="总价"></el-table-column>
  <el-table-column label="操作">
  <template #default="{row}">
    <el-button type="text" @click="orderDetails(row)">订单详情</el-button>

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

  <!------------------------ 订单详情页单 ---------------------------->
  <el-dialog
    v-model="orderDetailDialogVisible"
    title="订单详情"
    width="30%"
    :before-close="handleClose"
  >
  <div style="display:inline-block;margin-right:20px;"> 
          <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :icon="activity.icon"
            :type="activity.type"
            :color="activity.color"
            :size="activity.size"
            :hollow="activity.hollow"
            :timestamp="activity.timestamp"
          >
            {{ activity.content }}
          </el-timeline-item>
        </el-timeline>
        </div>
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
  import request from "@/utils/request"
  const tableData = ref([])
  const dialogVisible = ref(false)
  const orderDetailDialogVisible = ref(false)
  const stocks = ref([])
  const stock = ref()
  const pageTotal=ref(50)
  const pageinfo=reactive({
      pageSize:7,
      pageNum:1
    })

  
  const shipsOrderParam = {
      startDate:null,
      endDate:null,
      concreteType: null
    }
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
    getShips(shipsOrderParam);
    getStock();
  })
  
  const showDialog = () => {
    dialogVisible.value = true
  }

  
  const getShips=(shipsOrderParam)=>{

    request.post(`/ship/getShips/${pageinfo.pageNum}/${pageinfo.pageSize}`,shipsOrderParam)
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
    getShips(shipsOrderParam);
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
        shipsOrderParam.startDate = start.value;
        shipsOrderParam.endDate = end.value;
        shipsOrderParam.concreteType=stock.value ;
        getShips(shipsOrderParam);
    };

    const activities = ref([])
    const orderDetails = (row) => {
        activities.value = []
        request.get(`/operateRecord/list/${row.shipmentOrderNo}`)
        .then(res => {
           if(res.data.code == 0) {
              activities.value = res.data.data
           }
           orderDetailDialogVisible.value=true
           
        })
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


     const getStateText=(state)=>{
      switch (state) {
          case 0:
            return '未出货';
          case 1:
            return '运输中';
          case 2:
            return '客户已确认数量';
          case 3:
            return '客户确认收货';
          case 4:
            return '出货订单取消'
          case 5:
            return '出货订单完成'
          default:
            return '';
        }
    }

  
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