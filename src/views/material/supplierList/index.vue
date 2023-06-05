<template>
  <div class="supplier-list">
    <el-row>
        <el-button type="primary" @click="dialogFormVisible = true" style="margin-top: 15px;margin-left:5px;margin-bottom: 10px;">
          新增供应商
          <el-icon class="el-icon--right"><CirclePlus/></el-icon>
        </el-button>     
    </el-row>
    <el-table :data="supplierList" >
      <el-table-column label="供应商编号" prop="supplierCode" width="120px"></el-table-column>
      <el-table-column label="供应商名称" prop="supplierName" width="250px"></el-table-column>
      <el-table-column label="联系人" prop="contact"  width="120px"></el-table-column>
      <el-table-column label="联系电话" prop="phone" width="200px"></el-table-column>
      <el-table-column label="地址" prop="address" width="300px"></el-table-column>
      <el-table-column label="操作" width="200">
        <template v-slot="{ row }">
          <el-button type="primary" @click="handleEdit(row)">
            编辑
            <el-icon class="el-icon--right"><Edit/></el-icon>
          </el-button>
          <el-button type="danger" @click="handleDelete(row)">
            删除
            <el-icon class="el-icon--right"><Delete/></el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
<!-- 新增供应商 -->
<el-dialog v-model="dialogFormVisible" title="新增供应商" width="500px">
    <el-form :model="dialogForm" :rules="dialogRules"> 
      <el-form-item label="供应商编号" label-width="140px" prop="supplierCode" >
        <el-input v-model="dialogForm.supplierCode" autocomplete="off" style="width: 250px;"/>
      </el-form-item>
      <el-form-item label="供应商名称" label-width="140px" prop="supplierName">
        <el-input v-model="dialogForm.supplierName" autocomplete="off" style="width: 250px;"/>
      </el-form-item>
      <el-form-item label="联系人" label-width="140px" prop="contact">
        <el-input v-model="dialogForm.contact" autocomplete="off" style="width: 250px;"/>
      </el-form-item>
      <el-form-item label="联系电话" label-width="140px" prop="phone">
        <el-input v-model="dialogForm.phone" autocomplete="off" style="width: 250px;"/>
      </el-form-item>
      <el-form-item label="地址" label-width="140px" prop="address">
        <el-input v-model="dialogForm.address" autocomplete="off" style="width: 250px;"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAdd">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 编辑供应商 -->
<el-dialog v-model="dialogFormVisibleforEdit" title="编辑供应商信息" width="500px">
    <el-form :model="dialogFormForEdit" :rules="dialogRules"> 
      <el-form-item label="供应商编号" label-width="140px" prop="supplierCode">
        <el-input v-model="dialogFormForEdit.supplierCode" autocomplete="off" style="width: 250px;"/>
      </el-form-item>
      <el-form-item label="供应商名称" label-width="140px" prop="supplierName">
        <el-input v-model="dialogFormForEdit.supplierName" autocomplete="off" style="width: 250px;"/>
      </el-form-item>
      <el-form-item label="联系人" label-width="140px" prop="contact">
        <el-input v-model="dialogFormForEdit.contact" autocomplete="off" style="width: 250px;"/>
      </el-form-item>
      <el-form-item label="联系电话" label-width="140px" prop="phone">
        <el-input v-model="dialogFormForEdit.phone" autocomplete="off" style="width: 250px;"/>
      </el-form-item>
      <el-form-item label="地址" label-width="140px" prop="address">
        <el-input v-model="dialogFormForEdit.address" autocomplete="off" style="width: 250px;"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisibleforEdit = false">取消</el-button>
        <el-button type="primary" @click="handleEditconfirm">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
  
     <!-- 分页条 -->
  <div class="example-pagination-block" style="width: 350px;margin-left: 530px;margin-top: 10px;" >
    <el-pagination layout="prev, pager, next" v-model:current-page="pageinfo.pageNum" :total="pageTotal" :page-size="pageinfo.pageSize" @current-change="handleCurrentChange()"/>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref,onMounted,reactive} from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import {
    Check,
    Delete,
    Edit,
    Message,
    Search,
    Star,
    CirclePlus
    } from '@element-plus/icons-vue'
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
      pageSize:9,
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
        if(res.data.code == 0){
          ElMessage({
            showClose: true,
            message: res.data.message,
            type: 'success',
          })
          getSupplierList();
          dialogFormVisibleforEdit.value = false;
        }else {
          ElMessage({
            showClose: true,
            message: res.data.message,
            type: 'error',
          }) 
        }
      }).catch(err=>{
        console.log(err)
      })
    };

    const clearAddForm = () => {
       dialogForm.supplierCode = '',
       dialogForm.supplierName = '',
       dialogForm.contact = '',
       dialogForm.phone = '',
       dialogForm.address = ''
    }
    
    //处理添加供应商
    const handleAdd=()=>{
      request.post(`/suppliers/save`,dialogForm).then(res=>{
        if(res.data.code == 0){
          ElMessage({
            showClose: true,
            message: res.data.message,
            type: 'success',
          })
          getSupplierList();
          clearAddForm();
          dialogFormVisible.value=false
        } else{
          ElMessage({
            showClose: true,
            message: res.data.message,
            type: 'error',
          })
        }
      }).catch(err=>{
        console.log(err)
      })
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
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        request.delete(`suppliers/remove/${row.id}`).then((res) => {
          if(res.data.code == 0) {
            ElMessage.success(res.data.message);
            getSupplierList(); 
          }else{
            ElMessage.error(res.data.message)
          }
        });
      });
    };

    getSupplierList();


</script>
