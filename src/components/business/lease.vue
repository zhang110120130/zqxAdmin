<template>
  <div class="manage">
    <div class="header">
      <p class="title">我要租赁</p>
      <el-input
        placeholder="搜索关键词"
        v-model="keywords"
        clearable>
      </el-input>
      <el-button type="primary" icon="el-icon-search" @click="searchBtn">搜索</el-button>
      <el-button type="info" @click="resetBtn">重置</el-button>
    </div>
    <div class="list">
      <el-table
        :data="tableData"
        border
        :row-style="tableRowStyle"
        :header-cell-style="tableHeaderColor"
        style="width: 100%;height: 100%;">
        <el-table-column
          prop="thumb"
          label="产品图片"
          width="180">
          <template slot-scope="scope">
            <el-image
              style="width: 150px; height: 100px"
              :src="scope.row.thumb"
              :fit="'scale-down'">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="产品名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="specname"
          label="规格"
          width="100">
        </el-table-column>
        <el-table-column
          prop="catename"
          label="分类"
          width="180">
          <template slot-scope="scope">
            {{scope.row.catename.join(' | ')}}
          </template>
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格/天"
          width="100">
        </el-table-column>
        <el-table-column
          prop="stock"
          label="库存"
          width="60">
        </el-table-column>
        <el-table-column
          prop="freight"
          label="运费"
          width="60">
        </el-table-column>
        <el-table-column
          prop="insurance"
          label="保险"
          width="60">
        </el-table-column>
        <el-table-column
          prop="state"
          label="状态"
          width="100">
          <template slot-scope="scope">
            {{scope.row.state == 0 ? '下架' : '上架'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作">
          <template slot-scope="scope">
            <div class="operation">
              <p @click="editBtn(scope.row)">修改价格</p>
              <p v-if="scope.row.state == 0" class="line"></p>
              <p v-if="scope.row.state == 0" @click="deleteBtn(scope.row.id)">删除</p>
              <p v-if="scope.row.state == 0" class="line"></p>
              <p v-if="scope.row.state == 0" @click="putaway(scope.row.id)">上架</p>
              <p v-if="scope.row.state == 1" class="line"></p>
              <p v-if="scope.row.state == 1" @click="soldout(scope.row.id)">下架</p>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      background
      layout="prev, pager, next"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-count="Math.ceil(pages / 5)">
    </el-pagination>
    <el-dialog :visible.sync="dialogTableVisible" :show-close = false width="450px">
      <el-form ref="form" :model="form" label-width="70px">
        <el-form-item label="价格" prop="price" :rules="[{ required: true, message: '请输入价格', trigger: 'blur' }]">
          <el-input v-model="form.price">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="库存" prop="stock" :rules="[{ required: true, message: '请输入价格', trigger: 'blur' }]">
          <el-input v-model="form.stock">
            <template slot="append">件</template>
          </el-input>
        </el-form-item>
        <el-form-item label="运费" prop="freight" :rules="[{ required: true, message: '请输入价格', trigger: 'blur' }]">
          <el-input v-model="form.freight">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="保险" prop="insurance" :rules="[{ required: true, message: '请输入价格', trigger: 'blur' }]">
          <el-input v-model="form.insurance">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="押金" prop="insurance" :rules="[{ required: true, message: '请输入保险', trigger: 'blur' }]">
              <el-input v-model="form.deposit">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
        <el-form-item label="服务" prop="services" :rules="[{ required: true, message: '请选择服务', trigger: 'blur' }]">
          <el-select v-model="form.services" multiple placeholder="请选择">
            <el-option
              v-for="item in allservices"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'manage',
  data:()=>({
    proid: null,
    radio: 0,
    radiolist: [],
    dialogTableVisible: false,
    keywords: '',
    tableData: [],
    user: null,
    allservices: [],
    page: 1,
    pages: 0,
    form:{
      freight: '',
      price: '',
      stock: '',
      deposit:'',
      type:3,
      insurance: '',
      services: []
    },
    id: null
  }),
  created(){
    this.user = this.$store.getters.getUser;
    this.getList();
    this.getallservices();
  },
  methods: {
    getallservices(){
      let that = this;
      this.axios.post('/MobileJson/CompanyAdmin/allservices', this.qs.stringify({ 
        uid: this.user.id
      }))
      .then(function (response) {
        if(response.data.code == true){
          that.allservices = response.data.data;
        }
      })
      .catch(function (error) {
      });
    },
    searchBtn(){
      this.getList();
    },
    resetBtn(){
      this.keywords = '';
      this.getList();
    },
    editBtn(data){
      console.log(data);
      this.id = data.id;
      this.form.freight = parseFloat(data.freight);
      this.form.price = parseFloat(data.price);
      this.form.stock = parseFloat(data.stock);
      this.form.insurance = parseFloat(data.insurance);
      this.form.deposit = parseFloat(data.deposit);
      this.form.services = data.services;
      this.dialogTableVisible = true;
    },
    submitForm(){
      let that = this;
      that.$refs.form.validate((valid) => {
        if (valid) {
          that.form.id = that.id;
          that.form.uid = that.user.id;
          console.log(that.form);
          that.axios.post('/MobileJson/CompanyAdmin/editprice', that.qs.stringify(that.form))
          .then(function (response) {
            if(response.data.code == true){
              that.getList();
              that.dialogTableVisible = false;
              that.form = {
                freight: '',
                price: '',
                stock: '',
                type:3,
                insurance: '',
                deposit:'',
                services: []
              };
              that.$message({
                type: 'success',
                message: '修改成功!'
              });
            }
          })
          .catch(function (error) {
          }); 
        } else {
          
          return false;
        }
      });
    },
    soldout(id){
      let that = this;
      this.$confirm('此操作将下架商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.post('/MobileJson/CompanyAdmin/goodsdown', this.qs.stringify({ 
          uid: this.user.id,
          id: id
        }))
        .then(function (response) {
          if(response.data.code == true){
            that.getList();
            that.$message({
              type: 'success',
              message: '下架成功!'
            });
          }else{
            that.$message({
              type: 'info',
              message: '下架失败'
            }); 
          }
        })
        .catch(function (error) {
          that.$message({
              type: 'info',
              message: '下架失败'
            }); 
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消下架'
        });          
      });
    },
    putaway(id){
      let that = this;
      this.$confirm('此操作将上架商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.post('/MobileJson/CompanyAdmin/goodsup', this.qs.stringify({ 
          uid: this.user.id,
          id: id
        }))
        .then(function (response) {
          if(response.data.code == true){
            that.getList();
            that.$message({
              type: 'success',
              message: '上架成功!'
            });
          }else{
            that.$message({
              type: 'info',
              message: '上架失败'
            }); 
          }
        })
        .catch(function (error) {
          that.$message({
              type: 'info',
              message: '上架失败'
            }); 
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消上架'
        });          
      });
    },
    deleteBtn(id){
      let that = this;
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.post('/MobileJson/CompanyAdmin/goodsdel', this.qs.stringify({ 
          uid: this.user.id,
          id: id
        }))
        .then(function (response) {
          if(response.data.code == true){
            that.getList();
            that.$message({
              type: 'success',
              message: '删除成功!'
            });
          }else{
            that.$message({
              type: 'info',
              message: '删除失败'
            }); 
          }
        })
        .catch(function (error) {
          that.$message({
              type: 'info',
              message: '删除失败'
            }); 
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    handleCurrentChange: function(currentPage){
      this.page = currentPage;
      this.getList();
    },
    getList(){
      let that = this;
      that.axios.post('/MobileJson/CompanyAdmin/goodslist', that.qs.stringify({ 
        page: that.page,
        uid: that.user.id,
        type: 3,
        keywords: that.keywords
      }))
      .then(function (response) {
        that.pages = parseInt(response.data.count);
        that.tableData = response.data.data;
      })
      .catch(function (error) {
        console.log(error);
      });

    },
    handleClose() {
      console.log(3);
      
    },
    tableRowStyle() {
      return 'text-align: center;'
    },
    tableHeaderColor({ rowIndex }) {
      if (rowIndex === 0) {
        return 'background-color: #EDEFF1FF;text-align: center;'
      }
    }
  },
  filters: {
    radioFilter: function (value, radiolist) {
      return radiolist.indexOf(value) == -1 ? false : true;
    }
  }
}
</script>
<style lang="less" scoped>
.manage{
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 129px 26px 100px 26px;
}
.header{
  position: fixed;
  top: 88px;
  left: 20.1vw;
  display: flex;
  align-items: center;
  width: 100%;
  height: 103px;
  background: #FFF;
  .title{
    margin-left: 19px;
  }
  .el-input{
    width: 382px;
    margin-left: 25px;
    margin-right: 14px;
  }
}
.list{
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 23px 27px 10px 27px;
  background: #FFF;
}
.el-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 28px;
}
.operation{
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  p{
    cursor: pointer;
  }
  .line{
    width: 1px;
    height: 18px;
    background: #666666FF;
    margin: 0px 20px;
  }
}
.addBusiness{
  box-sizing: border-box;
  padding: 0px 31px;
}

</style>