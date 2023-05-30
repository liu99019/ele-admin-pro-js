<template>
  <div class="supplier-list">
    <el-row>
        <el-button type="primary" @click="dialogFormVisible = true">新增供应商</el-button>     
    </el-row>
    <el-table :data="supplierList" >
      <el-table-column label="供应商编号" prop="supplierCode"></el-table-column>
      <el-table-column label="供应商名称" prop="supplierName"></el-table-column>
      <el-table-column label="联系人" prop="contact"></el-table-column>
      <el-table-column label="联系电话" prop="phone"></el-table-column>
      <el-table-column label="地址" prop="address"></el-table-column>
      <el-table-column label="操作" width="160">
        <template v-slot="{ row }">
          <el-button type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
<!-- 新增供应商 -->
<el-dialog v-model="dialogFormVisible" title="新增供应商">
    <el-form :model="dialogForm" :rules="dialogRules"> 
      <el-form-item label="供应商编号" label-width="140px" prop="supplierCode">
        <el-input v-model="dialogForm.supplierCode" autocomplete="off" />
      </el-form-item>
      <el-form-item label="供应商名称" label-width="140px" prop="supplierName">
        <el-input v-model="dialogForm.supplierName" autocomplete="off" />
      </el-form-item>
      <el-form-item label="联系人" label-width="140px" prop="contact">
        <el-input v-model="dialogForm.contact" autocomplete="off" />
      </el-form-item>
      <el-form-item label="联系电话" label-width="140px" prop="phone">
        <el-input v-model="dialogForm.phone" autocomplete="off" />
      </el-form-item>
      <el-form-item label="地址" label-width="140px" prop="address">
        <el-input v-model="dialogForm.address" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleAdd">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 编辑供应商 -->
<el-dialog v-model="dialogFormVisibleforEdit" title="编辑供应商信息">
    <el-form :model="dialogFormForEdit" :rules="dialogRules"> 
      <el-form-item label="供应商编号" label-width="140px" prop="supplierCode">
        <el-input v-model="dialogFormForEdit.supplierCode" autocomplete="off" />
      </el-form-item>
      <el-form-item label="供应商名称" label-width="140px" prop="supplierName">
        <el-input v-model="dialogFormForEdit.supplierName" autocomplete="off" />
      </el-form-item>
      <el-form-item label="联系人" label-width="140px" prop="contact">
        <el-input v-model="dialogFormForEdit.contact" autocomplete="off" />
      </el-form-item>
      <el-form-item label="联系电话" label-width="140px" prop="phone">
        <el-input v-model="dialogFormForEdit.phone" autocomplete="off" />
      </el-form-item>
      <el-form-item label="地址" label-width="140px" prop="address">
        <el-input v-model="dialogFormForEdit.address" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisibleforEdit = false">Cancel</el-button>
        <el-button type="primary" @click="handleEditconfirm">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
  
     <!-- 分页条 -->
  <div class="example-pagination-block" style="width: 350px;margin: 30px auto;margin-top: 4px;" >
    <el-pagination layout="prev, pager, next" v-model:current-page="pageinfo.pageNum" :total="pageTotal" :page-size="pageinfo.pageSize" @current-change="handleCurrentChange()"/>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref,onMounted,reactive} from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import request from "@/utils/request"


    const supplierList = ref([]); // 表格数据
    const dialogFormVisible = ref(false); // 新增弹窗可见性
    const dialogFormVisibleforEdit = ref(false); // 编辑弹窗可见性


    const dialogForm = reactive({
      supplierCode:'',
      supplierName:'',
      contact:'',
      phone:'',
      address:''
    });
  
  
    const dialogFormForEdit = reactive({
      id:'',
      supplierCode:'',
      supplierName:'',
      contact:'',
      phone:'',
      address:''
    });
    
    const pageinfo=reactive({
      pageSize:8,
      pageNum:1
    })
    // 编辑弹窗表单数据
    const dialogRules = reactive({ // 编辑弹窗表单验证规则
      supplierCode: [{ required: true, message: '请输入供应商编码', trigger: 'blur' }],
      supplierName: [{ required: true, message: '请输入供应商名称', trigger: 'blur' }],
      address: [{ required: true, message: '请输入供应商地址', trigger: 'blur' }],
      phone: [{ required: true, message: '请输入供应商电话', trigger: 'blur' }],
      contact: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
    });

    const pageTotal=ref(50)
    onMounted(() => {
      getSupplierList();
     });
    // 获取供应商列表
    const getSupplierList = () => {
      request.get(`/suppliers/pages/${pageinfo.pageNum}/${pageinfo.pageSize}`,).then(res=>{
        supplierList.value=res.data.data.list
        pageTotal.value=res.data.data.count
      }).catch(err=>{console.log(err)})


    };

    const handleCurrentChange=()=>{
      getSupplierList();
    }

    // 打开编辑弹窗
    const handleEdit =raw=>{
      dialogFormVisibleforEdit.value=true
      dialogFormForEdit.address=raw.address;
      dialogFormForEdit.contact=raw.contact;
      dialogFormForEdit.phone=raw.phone;
      dialogFormForEdit.supplierCode=raw.supplierCode;
      dialogFormForEdit.supplierName=raw.supplierName;
      dialogFormForEdit.id=raw.id
    };
    
    const handleEditconfirm =()=>{
      request.post(`/suppliers/update`,dialogFormForEdit).then(res=>{
        console.log(res)

        getSupplierList();
          ElMessage({
        showClose: true,
        message: '修改成功',
        type: 'success',
      })
      }).catch(err=>{console.log(err)
            ElMessage({
        showClose: true,
        message: '修改失败',
        type: 'error',
      })
      })

      dialogFormVisibleforEdit.value=false
    };
    
    //处理添加供应商
    const handleAdd=()=>{
      request.post(`/suppliers/save`,dialogForm).then(res=>{
        console.log(res)
        getSupplierList();
          ElMessage({
        showClose: true,
        message: '保存成功',
        type: 'success',
      })
      }).catch(err=>{console.log(err)
            ElMessage({
        showClose: true,
        message: '保存失败',
        type: 'error',
      })
      })
      dialogFormVisible.value=false
    }
    // 点击编辑弹窗的确认按钮
    const dialogFormSubmit = () => {
      // 表单验证
      request.post(`/suppliers/save`,dialogForm).then(res=>{
        getSupplierList();
      }).catch(err=>{console.log(err)})

    };

    // 点击删除按钮
    const handleDelete = row => {
      ElMessageBox.confirm('确认删除该供应商吗?', '提示', {
        type: 'warning',
      }).then(() => {
        request.delete(`suppliers/remove/${row.id}`).then(() => {
          ElMessage.success('删除成功');
          getSupplierList();
        });
      });
    };

    getSupplierList();


</script>
