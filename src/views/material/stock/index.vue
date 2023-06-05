<template>
  <div>
    <el-table :data="stockData"  stripe style="width: 100%">
      <el-table-column prop="concreteType" label="混凝土型号" />
      <el-table-column prop="stockQuantity" label="现有库存数量" />
      <el-table-column prop="lastUpdateTime" label="最后更新时间" />
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted,reactive} from 'vue';
import axios from 'axios';
import ElementPlus from 'element-plus';
import request from "@/utils/request";


    // 使用 ref 创建响应式数据
    const stockData = ref([]);

    const pageTotal=ref(50)
    const pageinfo=reactive({
        pageSize:4,
        pageNum:1
      })

    // 在组件挂载后立即请求数据
    onMounted(() => {
      getStockData();
    });

    // 发送请求获取 m_stock 数据
    const getStockData=()=> {
      request.get(`stock/pages/${pageinfo.pageNum}/${pageinfo.pageSize}`)
        .then(res => {
          console.log(res)
          stockData.value=res.data.data.list
          pageTotal.value= res.data.data.count
        })
        .catch(error => {
          ElementPlus.ElMessage.error('获取库存数据失败');
        });
    }


</script>


