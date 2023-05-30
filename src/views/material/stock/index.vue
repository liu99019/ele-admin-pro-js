<template>
    <div class="container">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="material" label="原材料名称"></el-table-column>
        <el-table-column prop="inventory" label="库存数量"></el-table-column>
      </el-table>
    </div>
</template>

<script setup lang="ts">
import{ref,reactive} from 'vue';
  const tableData=ref(
    [{material:'原材料A',inventory:'10'},{material:'原材料B',inventory:'20'}]
  )
</script>
