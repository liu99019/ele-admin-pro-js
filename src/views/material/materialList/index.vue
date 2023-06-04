<template>

      
       <!-- <el-col :span="8"> -->
        <!-- 搜索与添加区域 -->
        <div style="margin-bottom: 10px;margin-top: 10px;">
          <el-input placeholder="请输入原材料名称或编号" style="width: 300px;margin-left: 10px;"
           v-model="searchInput" clearable @clear="getAllMaterials" >
          <template #append>
           <el-button @click="searchMaterial"><el-icon><search /></el-icon></el-button>
          </template>
          </el-input>
       <!-- </el-col> -->
       <el-button style="display: inline-block;margin-left: 30px;" type="primary" @click="handleAdd">
        新增物料<el-icon class="el-icon--right"><CirclePlus/></el-icon>
      </el-button>
        </div>
      <el-table :data="materials"  style="width: 100%;">
        <el-table-column prop="materialCode" label="材料编码"></el-table-column>
        <el-table-column prop="materialName" label="名称"></el-table-column>
        <el-table-column prop="specification" label="规格"></el-table-column>
        <el-table-column prop="unit" label="单位">
          <template #default="scope">
            <el-tag v-if="scope.row.unit =='千克'" class="ml-2" >{{ scope.row.unit }}</el-tag>
            <el-tag v-if="scope.row.unit =='吨'" class="ml-2" type="info">{{ scope.row.unit }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="unitPrice" label="单价(元)"></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" type="primary" @click="handleEdit(scope.row)">
              编辑
            <el-icon class="el-icon--right"><Edit/></el-icon>
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">
              删除
            <el-icon class="el-icon--right"><Delete/></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>      
<!-- 修改 -->
      <el-dialog v-model="dialogFormVisible" title="修改信息" width="350px">
        <el-form :model="dialogForm" :rules="dialogRules">
          <el-form-item label="编码" prop="materialCode">
            <el-input v-model="dialogForm.materialCode"  style="width:200px;" placeholder="请输入产品编码"></el-input>
          </el-form-item>
          <el-form-item label="名称" prop="materialName">
            <el-input v-model="dialogForm.materialName" style="width:200px;"  placeholder="请输入产品名称"></el-input>
          </el-form-item>
          <el-form-item label="规格" prop="specification">
            <el-input v-model="dialogForm.specification" style="width:200px;" placeholder="请输入产品规格"></el-input>
          </el-form-item>
          <el-form-item label="单位" prop="unit">
            <el-select v-model="dialogForm.unit" class="m-2" placeholder="请选择单位">
              <el-option
                v-for="item in dialogForm.materialUnitOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="单价" prop="unitPrice">
            <el-input v-model="dialogForm.unitPrice" style="width:100px;"></el-input>
          </el-form-item>
        </el-form>

        <template #footer>
         <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormSubmit">确 定</el-button>
         </span>
        </template>
      </el-dialog>
<!-- 添加 -->
      <el-dialog v-model="dialogFormAddVisible" title="添加物料信息" width="350px">
        <el-form :model="dialogAddForm" :rules="dialogRules">
          <el-form-item label="编码" prop="materialCode">
            <el-input v-model="dialogAddForm.materialCode" style="width:200px;" placeholder="请输入产品编码"></el-input>
          </el-form-item>
          <el-form-item label="名称" prop="materialName">
            <el-input v-model="dialogAddForm.materialName" style="width:200px;"  placeholder="请输入产品名称"></el-input>
          </el-form-item>
          <el-form-item label="规格" prop="specification">
            <el-input v-model="dialogAddForm.specification" style="width:200px;" placeholder="请输入产品规格"></el-input>
          </el-form-item>
          <el-form-item label="单位" prop="unit">
            <el-select v-model="dialogAddForm.unit" class="m-2" placeholder="请选择单位">
              <el-option
                v-for="item in dialogAddForm.materialUnitOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <!-- <el-input v-model="dialogAddForm.unit"></el-input> -->
          </el-form-item>
          <el-form-item label="单价" prop="unitPrice" >
            <el-input v-model="dialogAddForm.unitPrice" style="width:100px;"></el-input>
          </el-form-item>
        </el-form>

        <template #footer>
         <span class="dialog-footer">
          <el-button @click="dialogFormAddVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormAddSubmit">确 定</el-button>
         </span>
        </template>
      </el-dialog>

      <!-- 分页条 -->
  <div class="example-pagination-block" style="width: 350px;margin-left:550px;margin-top: 20px;" >
    <el-pagination layout="prev, pager, next" v-model:current-page="pageinfo.pageNum" :total="pageTotal" :page-size="pageinfo.pageSize" @current-change="handleCurrentChange()"/>
  </div>

  </template>

  <script setup lang="ts">
    import {reactive,ref,onMounted,onActivated} from "vue";
    import request from "@/utils/request"
    import {
    Check,
    Delete,
    Edit,
    Message,
    Search,
    Star,
    CirclePlus
    } from '@element-plus/icons-vue'
    import { load } from "@amap/amap-jsapi-loader";
    import { number } from "echarts/core";
    import { fa } from "element-plus/es/locale";
    import create from "@ant-design/icons-vue/lib/components/IconFont"; 
    import { truncate } from "lodash-es";
    import { ElMessageBox,ElMessage } from 'element-plus'
      
     const materials=ref([])

     const pageTotal=ref(50)
     const searchInput = ref('')

     const pageinfo=reactive({
      pageSize:10,
      pageNum:1
    })

    const handleCurrentChange=()=>{
      getAllMaterials()
    }

    
     const dialogWidth = ref('30%');
     const searchMaterial=()=>{ 
        getAllMaterials()
     }
     const dialogForm=reactive({
      id:'',
      materialCode:'',
      materialName:'',
      specification:'',
      unit:'',
      unitPrice:'',
      materialUnitOptions: [{value: '千克',label: '千克 (kg)'},{value: '吨',label: '吨 (T)'}]
     })

     const dialogAddForm=reactive({
      materialCode:'',
      materialName:'',
      specification:'',
      unit:{value: '千克',label: '千克 (kg)'},
      unitPrice:'',
      materialUnitOptions: [{value: '千克',label: '千克 (kg)'},{value: '吨',label: '吨 (T)'}]
     })
     const dialogFormVisible=ref(false)
     const dialogFormAddVisible=ref(false)

      onMounted(()=>{
            console.log('onMounted');
            getAllMaterials();
      })
      
   
     const getAllMaterials=()=>{
      request.get(`/material/pages/${pageinfo.pageNum}/${pageinfo.pageSize}`,
        {
          params : {'name' : searchInput.value}
        }
      )
      .then(
        res=>{
        materials.value=res.data.data.list
        pageTotal.value= res.data.data.count
      }
      ).catch(
        err => {
          console.log(err)
        })
     }


     const handleEdit=(param)=>{
      //将当前行的数据赋值给dialogForm
      dialogForm.id=param.id;
      dialogForm.materialCode=param.materialCode;
      dialogForm.materialName=param.materialName;
      dialogForm.specification=param.specification;
      dialogForm.unit=param.unit;
      dialogForm.unitPrice=param.unitPrice;
      dialogFormVisible.value=true
    }

    const handleDelete=(index:number)=>{
      ElMessageBox.confirm('确认删除该原材料?', '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
          }).then(() => {
            //这里写删除请求
            request.delete(`/material/remove/${index}`,)
            .then(
                res => {
                    if(res.data.code == 0){
                      ElMessage.success({
                        message: res.data.message
                      });
                    }else{
                      ElMessage.error({
                        message: res.data.message
                      });
                    }
                    getAllMaterials()               
                }
              )
            .catch(
                err=>{ 
                  console.log(err) 
                }
              )
          }).catch((err) => {
              console.log(err);
              
          });
    }

    const dialogFormSubmit=()=>{
      request.post(`/material/update`,dialogForm)
      .then(
        res=>{
            if(res.data.code == 0){
              ElMessage.success({
                        message: res.data.message
                      });
              dialogFormVisible.value=false
              getAllMaterials();
            }else {
              ElMessage.error({
                        message: res.data.message
                  });
            }
          }
        )
      .catch(
         err => {
             console.log(err)
          } 
        )

    }

    const clearAddDialong = () => {
      dialogAddForm.materialCode = '',
      dialogAddForm.materialName = '',
      dialogAddForm.specification = '',
      dialogAddForm.unit = {value: '千克',label: '千克 (kg)'},
      dialogAddForm.unitPrice = '',
      dialogAddForm.materialUnitOptions = [{value: '千克',label: '千克 (kg)'},{value: '吨',label: '吨 (T)'}]
    }

    const dialogFormAddSubmit=()=>{
      request.post(`/material/save`,dialogAddForm)
      .then(res => {
            if(res.data.code == 0){
              ElMessage.success({
                        message: res.data.message
                      });
              dialogFormAddVisible.value=false
              clearAddDialong()
              getAllMaterials();
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
    
    const handleAdd=()=>{
      dialogFormAddVisible.value = true
    }
    const tableRowClassName = ({
          rowIndex,
        }: {
          rowIndex: number
        }) => {
          if (rowIndex === 1) {
            return 'warning-row'
          } else if (rowIndex === 3) {
            return 'success-row'
          }
          return ''
     }

     const dialogRules=reactive(
      { materialCode: [{ required: true, message: '请填写编码', trigger: 'blur' }],
        materialName: [{ required: true, message: '请填写名称', trigger: 'blur' }],
        specification: [{ required: true, message: '请填写规格', trigger: 'blur' }],
        unit: [{ required: true, message: '请填写单位', trigger: 'blur' }],
        unitPrice: [{ required: true, message: '请填写单价', trigger: 'blur' }]}
     )
  </script>


<style>
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}

</style>