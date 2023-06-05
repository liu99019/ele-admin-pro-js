<template>
    <div class="purchase">
      <div>
        <div>
          <el-button type="primary" class="add-btn" @click="showDialog" style="margin-left: 10px;margin-right: 15px;" >新增订单</el-button>
          <div   style="display: inline-block;margin-top: 20px;margin-bottom: 20px;" >
            <el-date-picker
            v-model="start"
            type="date"
            placeholder="选择开始日期"
            :picker-options="pickerOptions"
            value-format="YYYY-MM-DD"
          ></el-date-picker>
          
          <el-date-picker
            style="margin-left: 5px;"
            v-model="end"
            type="date"
            placeholder="选择结束日期"
            value-format="YYYY-MM-DD"
            :picker-options="pickerOptions"
          ></el-date-picker>
          </div>
          
          <div style="display: inline-block;">
            <el-select v-model="state" style="margin-left: 10px;" placeholder="请选择订单状态" clearable>
            <el-option label="未发货" value=0></el-option>
            <el-option label="运输中" value=1></el-option>
            <el-option label="已确认收货数量" value=2></el-option>
            <el-option label="已确认收货" value=3></el-option>
            <el-option label="订单已取消" value=4></el-option>
            <el-option label="订单已完成" value=5></el-option>
          </el-select>

          <el-input v-model="supplierCode"  placeholder="请输入供应商编号" style="width: 200px;margin-left: 10px;"></el-input>
          <el-button style="margin-left: 10px;" :icon="Search" @click="search()">搜索</el-button>
          </div>
        </div>
      </div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="purchaseDate" label="进货日期" :formatter="dateFormat" width="150px"></el-table-column>
        <el-table-column prop="purchaseOrderNo" label="进货单号"></el-table-column>
        <el-table-column prop="supplierCode" label="供应商"></el-table-column>
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
              <el-step title="选择材料供应商" />
              <el-step title="需要采购的原材料" />
              <el-step title="确认订单信息" />
            </el-steps>
                  <!-- 选择供应商 -->
        <div v-show="currentStep === 0">
        <div style="margin-top: 30px;">

          <el-autocomplete
            v-model="supplierName"
            :fetch-suggestions="querySupplierAsync"
            placeholder="在此搜索原料供应商"
            @select="handleSelect"
            style="width: 260px;margin-left: 250px;;"
          />
        </div>
          <el-button style="margin-top: 20px; margin-left: 650px;" type="primary" @click="nextStep">下一步</el-button>
      </div>
                  <!-- 选择你需要的原材料  -->
        <div v-show="currentStep === 1">

          <el-row gutter="10" style="margin-top: 30px;">
            <el-col span="6"> <div class="m-4">
        <el-select
          v-model="materialList"
          multiple
          collapse-tags
          collapse-tags-tooltip
          :max-collapse-tags="3"
          value-key="id"
          filterable
          clearable
          placeholder="请选择需要采购的材料"
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
        <div v-for="(item, index) in materialList" :key="index">
          <div style="display: inline-block;width: 100px;">{{ item.materialName}}</div>
          <div style="display: inline-block;">
            <el-button type="text" icon="el-icon-minus" @click="decreaseQuantity(item)"></el-button>
            <el-input-number v-model="item.quantity" :min="1" :max="99" :step="1"></el-input-number>
            <el-button type="text" icon="el-icon-plus" @click="increaseQuantity(item)"></el-button>
          </div>
          <span>吨</span>
        </div>
      </div></el-col>
          
          </el-row>
      <div>
        <el-row gutter="10" style="margin-top: 30px; margin-left: 550px;">
          <el-col span="6"><el-button @click="prevStep" >上一步</el-button></el-col>
          <el-col span="6"><el-button type="primary" @click="nextStep">下一步</el-button></el-col>
        </el-row>
      </div>
      </div>
      <!-- 展示确认 -->
      <div v-show="currentStep === 2">
        <el-table :data="materialList" style="width: 100%">
          <el-table-column prop="materialName" label="原材料名称" width="150" />
          <el-table-column prop="materialCode" label="原材料编码" width="150" />
          <el-table-column label="供应商" width="300" >
           {{supplierName }}  ({{supplierValue}})
          </el-table-column>
          <el-table-column prop="quantity" label="数量(吨)" />
        </el-table>
        <div>
        <el-row gutter="10" style="margin-top: 30px; margin-left: 550px;">
          <el-col span="6"><el-button @click="prevStep" >上一步</el-button></el-col>
          <el-col span="6"><el-button type="success" @click="finish()">下单</el-button></el-col>
        </el-row>
      </div>
      </div>
      <div v-show="currentStep === 3">
        <div>
          <el-result icon="success" title="下单成功" subTitle="请到订单详情页面查看订单详细信息">
          </el-result>
        </div>
      </div>
    </div>
      </el-dialog>
      <!-------------------订单项详情 ------------------------------------------->
      <el-dialog v-model="orderItemVisible" title="订单详情" width="800px">
        <div style="margin-left:35px;margin-bottom:10px;">
          <span><el-icon size="35"><Document/></el-icon></span><span style="font-size:20px;font-weight:700;margin-left:5px;">订单号 </span>&nbsp;&nbsp;&nbsp;<span style="font-size:16px;font-weight:700"> {{ ODitems[0].purchaseOrderNo }}</span>
        </div>
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
        <div style="display:inline-block">
          <el-table :data="ODitems" style="width: 100%;height:280px;margin-bottom:20px;">
            <el-table-column prop="materialName" label="原材料名称" width="150" />
            <el-table-column prop="materialCode" label="原材料编码" width="150" />
            <el-table-column prop="quantity" label="数量(吨)" />
            <el-table-column prop="price" label="单价(元)"/>
            <el-table-column prop="totalPrice" label="总价(元)" />
          </el-table>
        </div>
      </el-dialog>
            <!-- 分页条 -->
   <div class="example-pagination-block" style="width: 350px;margin: 30px auto;margin-top: 4px;" >
     <el-pagination layout="prev, pager, next" v-model:current-page="pageinfo.pageNum" :total="pageTotal" :page-size="pageinfo.pageSize" @current-change="handleCurrentChange()"/>
  </div>
     </div>
  </template>
  
<script setup>
    import { MoreFilled } from '@element-plus/icons-vue'
    import { ElNotification } from 'element-plus'
    import {
      Search,
      Document
    } from '@element-plus/icons-vue'
    import { ref,onMounted,reactive} from 'vue';
    import { ElMessageBox, ElMessage } from 'element-plus';
    import request from "@/utils/request"
    import moment from "moment"
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
      console.log('onMounted');
       getPurchaseList(purchaseOrderSearchParams);
    });

    const dialogVisible = ref(false);
    const orderItemVisible=ref(false)

    const pageinfo=reactive({
      pageSize:10,
      pageNum:1
    })

    const pageTotal=ref()
    const handleCurrentChange=()=>{
      getPurchaseList(purchaseOrderSearchParams);
    }
    const getPurchaseList=(purchaseOrderSearchParams) => {
      request.post(`/purchase/pages/${pageinfo.pageNum}/${pageinfo.pageSize}`,
      purchaseOrderSearchParams).
         then( res => {
            tableData.value=res.data.data.list
            pageTotal.value=res.data.data.count
      }).
      catch(err=>{
        console.log(err)
      })
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
      // dialogVisible.value=false
      // currentStep.value=0
      request.post(`/purchase/save/${supplierValue.value}`,).then(res=> {
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
      request.post(`/orderItem/save`,orderItems.value)
      .then(res => {
          if(res.data.code == 0){
            currentStep.value ++
            orderItems.value=[]
            getPurchaseList(purchaseOrderSearchParams);
            supplierValue.value = null
            supplierName.value = null
            materialList.value = []
          }else {
              ElNotification({
                title: 'Erorr',
                message: res.data.message,
                type: 'error',
              })
          }
        }).catch(err=>{
            console.log(err)
          })
        })
    .catch(err=>{
      console.log(err)
    })

    }
    

    const prevStep=()=>{
      currentStep.value=currentStep.value-1
    }


    const getAllSupplierList = () => {
      request.get(`/suppliers/getAll`,).then(res => {
            supplierList.value=res.data.data
      })
      .catch(err=>{
        console.log(err)
      })
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
        request.get(`/orderItem/getOrderItems/${row.orderItemCode}`,).then(res=>{  
                  ODitems.value= res.data.data
                  orderItemVisible.value=true
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
      // getAllSupplierList();
      getAllMaterials();
      currentStep.value = 0
      dialogVisible.value = true
    }

    const getStateText=(state)=>{
      switch (state) {
          case 0:
            return '未发货';
          case 1:
            return '运输中';
          case 2:
            return '已确认收货数量';
          case 3:
            return '已确认收货';
          case 4:
            return '订单已取消'
          case 5:
            return '订单完成'
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

    const purchaseOrderSearchParams = {
      startDate:null,
      endDate:null,
      supplierCode: null
    }

    const search = () => {
        purchaseOrderSearchParams.startDate = start.value;
        purchaseOrderSearchParams.endDate = end.value;
        purchaseOrderSearchParams.state = state.value;
        purchaseOrderSearchParams.supplierCode = supplierCode.value;
        getPurchaseList(purchaseOrderSearchParams);
    };

 
   const dateFormat = (row,column) => {
    var date = row[column.property];
      if(date === undefined){
        return ''
      }
      return moment(date).format("YYYY-MM-DD")

   }

   const timer = null;

   const querySupplierAsync = (queryString, callBack) => {
      clearTimeout(timer);
      timer = setTimeout(() => {  //防抖
        request.get(`/suppliers/list/${queryString}`)
       .then(res => {
          if(res.data.code == 0) {
             res.data.data.forEach((e) => {
                 e.value = e.supplierName
             })
          }
          callBack(res.data.data)
       })
         console.log(this.input);
      }, 500); 
   }

   const supplierName = ref([])
   const handleSelect = (item) => {
      supplierName.value = item.supplierName
      supplierValue.value = item.supplierCode
  }

  const activities = [
  {
    content: '未发货',
    timestamp: '2018-04-12 20:46',
    type: 'primary',
    // hollow: true,

    // icon: MoreFilled,
  },
  {
    content: '运输中',
    timestamp: '2018-04-03 20:46',
    // color: '#0bbd87',
    type: 'primary',
  },
  {
    content: '已确认收货数量',
    timestamp: '2018-04-03 20:46',
    type: 'primary',
  },
  {
    content: '确认收货',
    timestamp: '2018-04-03 20:46',
    type: 'primary',
    // hollow: true,
    // type: 'primary',
    type: 'info'

  },
  {
    content: '订单完成',
    timestamp: '2018-04-03 20:46',
    // type: 'success',
    type: 'info'

  },
]

</script>
