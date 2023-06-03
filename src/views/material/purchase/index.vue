<template>
    <div class="purchase">
      <div>
        <div>
          <el-button type="primary" class="add-btn" @click="showDialog" style="margin-left: 10px;" >新增订单</el-button>
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
          </div>
          
          <div style="margin-top: 15px;">
            <el-select v-model="state" style="margin-left: 10px;" placeholder="请选择状态">
            <el-option label="运输中" value=0></el-option>
            <el-option label="已到货" value=1></el-option>
            <el-option label="订单完成" value=2></el-option>
            <el-option label="取消订单" value=3></el-option>
          </el-select>

          <el-input v-model="supplierCode"  placeholder="请输入供应商编号" style="width: 200px;margin-left: 10px;"></el-input>
          <el-button style="margin-left: 10px;" :icon="Search" @click="search()">搜索</el-button>
          </div>
        </div>
      </div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="purchaseDate" label="进货日期"></el-table-column>
        <el-table-column prop="purchaseOrderNo" label="进货单号"></el-table-column>
        <el-table-column prop="supplierCode" label="供应商"></el-table-column>
        <el-table-column prop="orderItemCode" label="订单项编号"></el-table-column>
        <el-table-column prop="state" label="订单状态">
          <template #default="{ row }">
        {{ getStateText(row.state) }}
      </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{row}">
            <el-button type="text" @click="handleEdit(row)">订单详情</el-button>
            <el-button type="text" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!---------------------新增订单------------------------------------------->
      <el-dialog v-model="dialogVisible" title="新增订单">
          <div>
            <el-steps :active="currentStep" finish-status="success">
              <el-step title="Step 1" />
              <el-step title="Step 2" />
              <el-step title="Step 3" />
            </el-steps>
                  <!-- 选择供应商 -->
        <div v-show="currentStep === 0">
        <div style="margin-top: 30px;">
          <h5 style="margin-left: 20px;">请选择供应商</h5>
          <el-select style="margin-left: 35px;"  v-model="supplierValue" clearable filterable  placeholder="Select">
            <el-option
              v-for="item in supplierList"
              :key="item.supplierName"
              :label="item.supplierName"
              :value="item.supplierCode"
            />
          </el-select>
        </div>
          <el-button style="margin-top: 20px; margin-left: 650px;" type="primary" @click="nextStep">Next</el-button>
      </div>
                  <!-- 选择你需要的原材料  -->
        <div v-show="currentStep === 1">

          <el-row gutter="10" style="margin-top: 30px;">
            <el-col span="6"> <div class="m-4">
        <h5 style="margin-left: 20px;">请选择需要采购的原材料</h5>
        <el-select
          v-model="materialList"
          multiple
          collapse-tags
          collapse-tags-tooltip
          :max-collapse-tags="3"
          value-key="id"
          filterable
          clearable
          placeholder="Select"
          style="width: 240px;margin-left: 35px;"
        >
          <el-option
            v-for="item in materials"
            :key="item.materialCode"
            :label="item.materialName"
            :value="item"
          />
        </el-select>
       
      </div></el-col>
            <el-col span="6" style="margin-left: 50px;">      
              <div>
        <h5 style="margin-left:20px ;">请选择原材料的数量</h5>
        <div v-for="(item, index) in materialList" :key="index">
          <div>{{ item.materialName}}</div>
          <div>
            <el-button type="text" icon="el-icon-minus" @click="decreaseQuantity(item)"></el-button>
            <el-input-number v-model="item.quantity" :min="1" :max="10" :step="1"></el-input-number>
            <el-button type="text" icon="el-icon-plus" @click="increaseQuantity(item)"></el-button>
          </div>
        </div>
      </div></el-col>
          
          </el-row>
      <div>
        <el-row gutter="10" style="margin-top: 30px; margin-left: 550px;">
          <el-col span="6"><el-button @click="prevStep" >Previous</el-button></el-col>
          <el-col span="6"><el-button type="primary" @click="nextStep">Next</el-button></el-col>
        </el-row>
      </div>
      </div>
      <!-- 展示确认 -->
      <div v-show="currentStep === 2">
        <el-table :data="materialList" style="width: 100%">
          <el-table-column prop="materialName" label="原材料名称" width="180" />
          <el-table-column prop="materialCode" label="原材料编码" width="180" />
          <el-table-column label="供应商" width="180" >
            {{ supplierValue}}
          </el-table-column>
          <el-table-column prop="quantity" label="数量" />
        </el-table>
        <div>
        <el-row gutter="10" style="margin-top: 30px; margin-left: 550px;">
          <el-col span="6"><el-button @click="prevStep" >Previous</el-button></el-col>
          <el-col span="6"><el-button type="primary" @click="nextStep">Next</el-button></el-col>
        </el-row>
      </div>
      </div>
      <div v-show="currentStep === 3">
        <h2>你确定要保存数据吗</h2>
        <div>
        <el-row gutter="10" style="margin-top: 30px; margin-left: 550px;">
          <el-col span="6"><el-button @click="prevStep" >Previous</el-button></el-col>
          <el-col span="6"><el-button type="primary" @click="finish()">Save</el-button></el-col>
        </el-row>
      </div>
      </div>
    </div>
      </el-dialog>
      <!-------------------订单项详情 ------------------------------------------->
      <el-dialog v-model="orderItemVisible" title="订单项详情">
        <div class="card-container" style="position: relative;">
          <el-row :gutter="12">
            <el-col span="8" v-for="(item, index) in ODitems" :key="index">
              <el-card class="card" style="width: 220px;">
                <template v-slot:header>{{ item.materialCode }}</template>
                <p>物料名称: {{ item.materialName }}</p>
                <p>数量: {{ item.quantity }}</p>
                <p>价格: {{ item.price}}</p>
                <p>总价: {{ item.totalPrice }}</p>
              </el-card>
            </el-col>
          </el-row>
      </div>
      </el-dialog>
                            <!-- 分页条 -->
   <div class="example-pagination-block" style="width: 350px;margin: 30px auto;margin-top: 4px;" >
     <el-pagination layout="prev, pager, next" v-model:current-page="pageinfo.pageNum" :total="pageTotal" :page-size="pageinfo.pageSize" @current-change="handleCurrentChange()"/>
  </div>
     </div>
  </template>
  
<script setup>
    import {
      Search
    } from '@element-plus/icons-vue'
    import { ref,onMounted,reactive} from 'vue';
    import { ElMessageBox, ElMessage } from 'element-plus';
    import request from "@/utils/request"

    const tableData = ref([
    ]);
    const orderItems = ref([
    ]);
    const ODitems=ref([

    ]);
    const purchaseNoTemp=ref()
    const orderItemCodeTemp=ref()
    const materials = ref([
    ]);
    const materialList=ref([])
    const supplierValue = ref('')
    const currentStep=ref(0)

    const state= ref();
    const supplierCode = ref('');
    onMounted(() => {
      getPurchaseList();
     });
    const dialogVisible = ref(false);
    const orderItemVisible=ref(false)

    const pageinfo=reactive({
      pageSize:7,
      pageNum:1
    })

    const pageTotal=ref()
    const handleCurrentChange=()=>{
      getPurchaseList();
    }
    const getPurchaseList=()=>{
      request.get(`/purchase/pages/${pageinfo.pageNum}/${pageinfo.pageSize}`,).then(res=>{
        tableData.value=res.data.data.list
        pageTotal.value=res.data.data.count
      }).catch(err=>{console.log(err)})
    }

    const form = ref({
      purchaseDate: '',
      purchaseOrderNo: '',
      supplier: '',
      state:'',
      itemCode:''
    });

    const supplierList=ref([])

    const nextStep=()=>{
      currentStep.value=currentStep.value+1
    }

    const finish=()=>{     
      dialogVisible.value=false
      currentStep.value=0
      request.post(`/purchase/save/${supplierValue.value}`,).then(res=>{
        console.log(res)
        purchaseNoTemp.value=res.data.data.purchaseOrderNo
        orderItemCodeTemp.value=res.data.data.orderItemCode
        materialList.value.forEach(item=>{
        const materialCode=item.materialCode
        const materialName=item.materialName
        const quantity=item.quantity
        const price=item.unitPrice
        const purchaseOrderNo=purchaseNoTemp.value
        const orderItemCode=orderItemCodeTemp.value
        orderItems.value.push({purchaseOrderNo,orderItemCode,materialCode,materialName,quantity,price})
      })
      console.log(orderItems)
      request.post(`/orderItem/save`,orderItems.value).then(res=>{
        console.log(res)
        orderItems.value=[]
      }).catch(err=>{
        console.log(err)
      })
        getPurchaseList();
        supplierValue.value=null
        materialList.value=[]
        
      }).catch(err=>{console.log(err)})

    }
    

    const prevStep=()=>{
      currentStep.value=currentStep.value-1
    }


    const getAllSupplierList = () => {
      request.get(`/suppliers/getAll`,).then(res=>{
        supplierList.value=res.data.data
      }).catch(err=>{console.log(err)})

    };


    const getAllMaterials = () => {
      request.get(`/material/findAll`,).then(res=>{
        materials.value=res.data.data
      }).catch(err=>{console.log(err)})
    };

    const decreaseQuantity = (item) => {
      if (!('quantity' in item)) {
        // 如果不存在 quantity 属性，则初始化为 1
        item.quantity = 1;
      } else if (item.quantity > 1) {
        item.quantity--;
      }
    };

    const increaseQuantity = (item) => {
      if (!('quantity' in item)) {
        // 如果不存在 quantity 属性，则初始化为 1
        item.quantity = 1;
      } else if (item.quantity < 10) {
        item.quantity++;
      }
    };

    const handleEdit = (row) => {
     orderItemVisible.value=true
     request.get(`/orderItem/getOrderItems/${row.orderItemCode}`,).then(res=>{  
      ODitems.value= res.data.data
     }).catch(rep=>{
      console.log(rep)
     })
    };

    // 点击删除按钮
    const handleDelete = (row) => {
      ElMessageBox.confirm('确认删除该供应商吗?', '提示', {
        type: 'warning',
      }).then(() => {
        request.delete(`purchase/removeByNo/${row.purchaseOrderNo}`).then(() => {
          ElMessage.success('删除成功');
          getPurchaseList();
        });
      });
    };

    const showDialog=()=>{
      getAllSupplierList();
      getAllMaterials();
      dialogVisible.value=true
    }

    const getStateText=(state)=>{
      switch (state) {
          case 0:
            return '运输中';
          case 1:
            return '已到货';
          case 2:
            return '订单完成';
          case 3:
            return '订单取消';
          default:
            return '';
        }
    }

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

    const search = () => {
      const startDate = formatDate(start.value);
      const endDate = formatDate(end.value);
      request.get(`/purchase/search?startDate=${startDate}&endDate=${endDate}&state=${state.value}&supplierCode=${supplierCode.value}`)
        .then((response) => {
          tableData.value = response.data.data;
        })
        .catch((error) => {
          console.error(error);
        });
    };

 
    const formatDate = (date) => {
      const YYYY = date.getFullYear();
      const MM = String(date.getMonth() + 1).padStart(2, '0');
      const DD = String(date.getDate()).padStart(2, '0');
      return `${YYYY}-${MM}-${DD}`;
    };

</script>
