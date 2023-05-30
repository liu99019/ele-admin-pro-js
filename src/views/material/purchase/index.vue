<template>
    <div class="purchase">
      <el-button type="primary" class="add-btn" @click="showDialog">新增订单</el-button>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="purchaseDate" label="进货日期"></el-table-column>
        <el-table-column prop="purchaseNo" label="进货单号"></el-table-column>
        <el-table-column prop="supplierCode" label="供应商"></el-table-column>
        <el-table-column prop="orderItemCode" label="订单项编号"></el-table-column>
        <el-table-column prop="state" label="订单状态"></el-table-column>
        <el-table-column label="操作">
          <template #default="{row}">
            <el-button type="text" @click="handleEdit(row)">订单详情</el-button>
            <el-button type="text" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
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

      <div class="m-4">
        <p>请选择需要采购的原材料</p>
        <el-select
          v-model="materialList"
          multiple
          collapse-tags
          collapse-tags-tooltip
          :max-collapse-tags="3"
          filterable
          clearable
          placeholder="Select"
          style="width: 240px"
        >
          <el-option
            v-for="item in materials"
            :key="item.materialName"
            :label="item.materialName"
            :value="item"
          />
        </el-select>
       
      </div>
      <div>
        <el-row gutter="10" style="margin-top: 30px; margin-left: 550px;">
          <el-col span="6"><el-button @click="prevStep" >Previous</el-button></el-col>
          <el-col span="6"><el-button type="primary" @click="nextStep">Next</el-button></el-col>
        </el-row>
      </div>
      </div>
      <div v-show="currentStep === 2">
        <!-- 第三步的内容 -->
        <h2>Step 3 Content</h2>
        <el-button @click="prevStep">Previous</el-button>
        <el-button type="primary" @click="nextStep">Next</el-button>
      </div>

      <div v-show="currentStep === 3">
        <h2>Step 3 Content</h2>
        <el-button @click="prevStep">Previous</el-button>
        <el-button type="primary" @click="finish">Finish</el-button>
      </div>
    </div>
      </el-dialog>
                      <!-- 分页条 -->
   <div class="example-pagination-block" style="width: 350px;margin: 30px auto;margin-top: 4px;" >
     <el-pagination layout="prev, pager, next" v-model:current-page="pageinfo.pageNum" :total="pageTotal" :page-size="pageinfo.pageSize" @current-change="handleCurrentChange()"/>
  </div>
     </div>
  </template>
  
<script setup>
    import { ref,onMounted,reactive} from 'vue';
    import request from "@/utils/request"

    const tableData = ref([
    ]);


    const materials = ref([
    ]);
    const materialList=ref([])
    const supplierValue = ref('')
    const currentStep=ref(1)
    onMounted(() => {
      getPurchaseList();
      getAllSupplierList();
      getAllMaterials();
     });
    const dialogVisible = ref(false);
    const formRef = ref(null);

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







    // ------------------------------------

    const rules = {
      purchaseDate: [{ required: true, message: '请选择进货日期', trigger: 'blur' }],
    };

    const showDialog = () => {
      dialogVisible.value = true;
      formRef.value.resetFields();
    };

    const formSubmit = () => {
      formRef.value.validate((valid) => {
        if (valid) {
          tableData.value.push(form.value);
          dialogVisible.value = false;
        } else {
          console.log('表单验证失败');
          return false;
        }
      });
    };

    const handleEdit = (row) => {
      console.log('编辑记录', row);
    };

    const handleDelete = (row) => {
      console.log('删除记录', row);
      const index = tableData.value.indexOf(row);
      if (index !== -1) {
        tableData.value.splice(index, 1);
      }
    };
    
</script>
