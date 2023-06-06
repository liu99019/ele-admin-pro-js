<template>
        <!-- 搜索与添加区域 -->
  <div style="margin-bottom: 10px;margin-top: 10px;">
    <el-input placeholder="混凝土型号" style="width: 300px;margin-left: 10px;"
      v-model="searchInput" clearable @clear="getStockData" >
    <template #append>
      <el-button @click="getStockData"><el-icon><search /></el-icon></el-button>
    </template>
    </el-input>
    <!-- </el-col> -->
    <el-button style="display: inline-block;margin-left: 30px;width:90px;" type="primary " @click="openDailog()">
    新增库存<el-icon class="el-icon--right"><CirclePlus/></el-icon>
  </el-button>
  </div>
  <div>
    <el-table :data="stockData"  stripe style="width: 100%">
      <el-table-column prop="concreteType" label="混凝土型号" />
      <el-table-column prop="stockQuantity" label="现有库存数量" />
      <el-table-column prop="lastUpdateTime" label="最后更新时间" />
    </el-table>
  </div>

  <!-- 新增页面 -->
  <el-dialog v-model="dialogFormVisible" title="新增" width="400px">
    <el-form :model="form" :rules="dialogRules">
      <el-form-item label="混凝土型号" prop="concreteType" :label-width="formLabelWidth">
        <el-input v-model="form.concreteType" autocomplete="off" />
      </el-form-item>
      <el-form-item label="数量" prop="stockQuantity" :label-width="formLabelWidth">
        <el-input v-model="form.stockQuantity" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleAdd()">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
   <!-- 分页条 -->
   <div class="example-pagination-block" style="width: 350px;margin-left:550px;margin-top: 20px;" >
    <el-pagination layout="prev, pager, next" v-model:current-page="pageinfo.pageNum" :total="pageTotal" :page-size="pageinfo.pageSize" @current-change="handleCurrentChange()"/>
  </div>
</template>

<script setup>
import { ref, onMounted,reactive} from 'vue';
import ElementPlus from 'element-plus';
import request from "@/utils/request";
import {
  Search,
} from '@element-plus/icons-vue'
import { ElMessageBox,ElMessage } from 'element-plus'

    // 使用 ref 创建响应式数据
    const stockData = ref([]);

    const pageTotal=ref(50)
    const pageinfo=reactive({
        pageSize:8,
        pageNum:1
      })

    const form=ref({
      concreteType:'',
      stockQuantity:0
    })

    const dialogFormVisible=ref(false)
    // 在组件挂载后立即请求数据
    onMounted(() => {
      getStockData();
    });

    const handleCurrentChange=()=>{
      getStockData()
    }
    const searchInput=ref('')
    // 发送请求获取 m_stock 数据
    const getStockData=()=> {
      request.get(`stock/pages/${pageinfo.pageNum}/${pageinfo.pageSize}`,
        {
          params : {'name' : searchInput.value}
        }
      )
        .then(res => {
          console.log(res)
          stockData.value=res.data.data.list
          pageTotal.value= res.data.data.count
        })
        .catch(error => {
          ElementPlus.ElMessage.error('获取库存数据失败');
        });
    }
  
    const dialogRules=reactive(
      { concreteType: [{ required: true, message: '请填写编码', trigger: 'blur' }],
        stockQuantity: [{ required: true, message: '请填写名称', trigger: 'blur' }],
      }
     )

     const openDailog=()=>{
      dialogFormVisible.value=true
     }

     const clearAddDialong=()=>{
      form.value={
        concreteType:'',
        stockQuantity:0
      }
     }
    const handleAdd=()=>{
      request.post(`/stock/save/${form.value.concreteType}/${form.value.stockQuantity}`,)
      .then(res => {
            if(res.data.code == 0){
              ElMessage.success({
                        message: res.data.message
                      });
              dialogFormVisible.value=false
              clearAddDialong()
              getStockData();
            }else{
              ElMessage.error({
                        message: res.data.message
                      });
            }
        } 
      ).catch(
          err => { console.log(err) }
      )

    }
</script>


