<template>
  <div class="manage">
    <div class="header">
      <p class="title">产品管理</p>
      <el-input
        placeholder="搜索关键词"
        v-model="keywords"
        clearable>
      </el-input>
      <el-button type="primary" icon="el-icon-search" @click="searchBtn">搜索</el-button>
      <el-button type="info" @click="resetBtn">重置</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="goto('addProduct')">添加</el-button>
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
          width="180">
        </el-table-column>
        <el-table-column
          prop="cates"
          label="分类"
          width="180">
          <template slot-scope="scope">
            {{scope.row.cates.join(' | ')}}
          </template>
        </el-table-column>
        <el-table-column
          prop="recordstatus"
          label="备案状态"
          width="180">
          <template slot-scope="scope">
            {{scope.row.isrecord == 1 ? '未备案' : scope.row.isrecord == 2 ? '已备案' : '备案中'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="goodstype"
          label="销售类型"
          width="180">
          <template slot-scope="scope">
            {{scope.row.goodstype.join('/')}}
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作">
          <template slot-scope="scope">
            <div class="operation">
              <p v-if="scope.row.goodstype.length == 1 && scope.row.goodstype[0] == '未处理'" @click="deleteBtn(scope.row.id)">删除</p>
              <p v-if="scope.row.goodstype.length == 1 && scope.row.goodstype[0] == '未处理' && scope.row.isrecord == 1" class="line"></p>
              <p v-if="scope.row.goodstype.length == 1 && scope.row.goodstype[0] == '未处理' && scope.row.isrecord == 1" @click="edit(scope.row.id)">编辑</p>
              <p v-if="scope.row.goodstype.length != 3 && scope.row.isrecord == 2 && scope.row.goodstype[0] == '未处理'" class="line"></p>
              <p v-if="scope.row.goodstype.length != 3 && scope.row.isrecord == 2" @click="addBusiness(scope.row.goodstype, scope.row.id)">添加到商务</p>
              <p v-if="scope.row.isrecord == 1" class="line"></p>
              <p v-if="scope.row.isrecord == 1" @click="beian(scope.row.id)">去备案</p>
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
      <span slot="title" class="dialog-title">
        <el-radio-group v-model="radio">
          <el-radio :disabled="'出售' | radioFilter(radiolist)" :label="1" @change="resetForm('sell1', 1)">出售</el-radio>
          <el-radio :disabled="'团购' | radioFilter(radiolist)" :label="2" @change="resetForm('sell2', 2)">团购</el-radio>
          <el-radio :disabled="'出租' | radioFilter(radiolist)" :label="3" @change="resetForm('sell3', 3)">租赁</el-radio>
        </el-radio-group>
      </span>
      <div class="addBusiness">
        <div class="sell">
          <el-form v-if="radio == 1" ref="sell1" :model="sell[1]" label-width="70px">
            <el-form-item label="价格" prop="price" :rules="[{ required: true, message: '请输入价格', trigger: 'blur' },{ type: 'number', message: '必须为数字值'}]">
              <el-input v-model.number="sell[1].price">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="库存" prop="stock" :rules="[{ required: true, message: '请输入库存', trigger: 'blur' },{ type: 'number', message: '必须为数字值'}]">
              <el-input v-model.number="sell[1].stock">
                <template slot="append">件</template>
              </el-input>
            </el-form-item>
            <el-form-item label="运费" prop="freight" :rules="[{ required: true, message: '请输入运费', trigger: 'blur' },{ type: 'number', message: '必须为数字值'}]">
              <el-input v-model.number="sell[1].freight">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="保险" prop="insurance" :rules="[{ required: true, message: '请输入保险', trigger: 'blur' },{ type: 'number', message: '必须为数字值'}]">
              <el-input v-model.number="sell[1].insurance">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="服务" prop="services" :rules="[{ required: true, message: '请选择服务', trigger: 'blur' }]">
              <el-select v-model="sell[1].services" multiple placeholder="请选择">
                <el-option
                  v-for="item in allservices"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-form v-if="radio == 2" ref="sell2" :model="sell[2]" label-width="80px">
            <el-form-item label="价格" prop="price" :rules="[{ required: true, message: '请输入价格', trigger: 'blur' },{ type: 'number', message: '必须为数字值'}]">
              <el-input v-model.number="sell[2].price">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="库存" prop="stock" :rules="[{ required: true, message: '请输入库存', trigger: 'blur' },{ type: 'number', message: '必须为数字值'}]">
              <el-input v-model.number="sell[2].stock">
                <template slot="append">件</template>
              </el-input>
            </el-form-item>
            <el-form-item label="运费" prop="freight" :rules="[{ required: true, message: '请输入运费', trigger: 'blur' },{ type: 'number', message: '必须为数字值'}]">
              <el-input v-model.number="sell[2].freight">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="保险" prop="insurance" :rules="[{ required: true, message: '请输入保险', trigger: 'blur' },{ type: 'number', message: '必须为数字值'}]">
              <el-input v-model.number="sell[2].insurance">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="结束时间" prop="end_at" :rules="[{ required: true, message: '请输入结束时间', trigger: 'blur' }]">
              <el-date-picker type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :picker-options="pickerOptions" v-model="sell[2].end_at" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="服务" prop="services" :rules="[{ required: true, message: '请选择服务', trigger: 'blur' }]">
              <el-select v-model="sell[2].services" multiple placeholder="请选择">
                <el-option
                  v-for="item in allservices"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-form v-if="radio == 3" ref="sell3" :model="sell[3]" label-width="70px">
            <el-form-item label="价格" prop="price" :rules="[{ required: true, message: '请输入价格', trigger: 'blur' },{ type: 'number', message: '必须为数字值'}]">
              <el-input v-model.number="sell[3].price">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="库存" prop="stock" :rules="[{ required: true, message: '请输入库存', trigger: 'blur' },{ type: 'number', message: '必须为数字值'}]">
              <el-input v-model.number="sell[3].stock">
                <template slot="append">件</template>
              </el-input>
            </el-form-item>
            <el-form-item label="运费" prop="freight" :rules="[{ required: true, message: '请输入运费', trigger: 'blur' },{ type: 'number', message: '必须为数字值'}]">
              <el-input v-model.number="sell[3].freight">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="保险" prop="insurance" :rules="[{ required: true, message: '请输入保险', trigger: 'blur' },{ type: 'number', message: '必须为数字值'}]">
              <el-input v-model.number="sell[3].insurance">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="押金" prop="deposit" :rules="[{ required: true, message: '请输入押金', trigger: 'blur' },{ type: 'number', message: '必须为数字值'}]">
              <el-input v-model.number="sell[3].deposit"></el-input>
              <span style="color: #FFF">元</span>
            </el-form-item>
            <el-form-item label="服务" prop="services" :rules="[{ required: true, message: '请选择服务', trigger: 'blur' }]">
              <el-select v-model="sell[3].services" multiple placeholder="请选择">
                <el-option
                  v-for="item in allservices"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
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
    tableData: [],
    user: null,
    page: 1,
    pages: 0,
    allservices: [],
    pickerOptions: {
      disabledDate(time) {
        return time.getTime() < Date.now();
      },
    },
    sell: [{},
      {
        price: '',
        stock: '',
        freight: '',
        insurance: '',
        services: []
      },
      {
        price: '',
        stock: '',
        freight: '',
        insurance: '',
        end_at: '',
        services: []
      },
      {
        price: '',
        stock: '',
        freight: '',
        insurance: '',
        deposit: '',
        services: []
      }
    ],
    keywords: ''
  }),
  created(){
    this.user = this.$store.getters.getUser;
    this.getList();
    this.getallservices();
  },
  methods: {
    cancel(){
      let str = 'sell' + this.radio;
      this.$refs[str].resetFields();
      this.dialogTableVisible = false;
    },
    resetForm(sell, index){ 
      this.$refs[sell].resetFields();
      this.sell[index].services = [];
    },
    beian(id){
      let that = this;
      this.$confirm('此操作将备案, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.post('/MobileJson/CompanyAdmin/applyRecord', this.qs.stringify({ 
          uid: this.user.id,
          pid: id
        }))
        .then(function (response) {
          if(response.data.code == true){
            that.getList();
            that.$message({
              type: 'success',
              message: '备案成功!'
            });
          }else{
            that.$message({
              type: 'info',
              message: '备案失败'
            }); 
          }
        })
        .catch(function (error) {
          that.$message({
              type: 'info',
              message: '备案失败'
            }); 
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消备案'
        });          
      });
    },
    edit(id){ // 编辑
      let that = this;
      that.axios.post('/MobileJson/CompanyAdmin/draftsinfo', that.qs.stringify({
          uid: that.user.id,
          proid: id
      }))
      .then(function (response) {
        if(response.data.code){
          that.$router.push({ name: 'addProduct', params: response.data.data})
        }
      })
      .catch(function (error) {
          console.log(error);
      });
    },
    goto(name){
      this.$router.push({name});
    },
    searchBtn(){
      this.getList();
    },
    resetBtn(){
      this.keywords = '';
      this.getList();
    },
    submitForm(){
      let name = 'sell' + this.radio;
      let type = this.radio;
      let i = parseInt(this.radio);
      let from = this.sell[i];
      from.proid = this.proid;
      from.uid = this.user.id;
      from.type = type;
      let that = this;
      this.$refs[name].validate((valid) => {
          if (valid) {
            this.axios.post('/MobileJson/CompanyAdmin/addgoods', this.qs.stringify(from))
            .then(function (response) {
              if(response.data.code == true){
                that.getList();
                that.$refs[name].resetFields();
                that.dialogTableVisible = false;
                that.$message({
                  type: 'success',
                  message: '添加成功!'
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
    addBusiness(goodstype, id){
      this.proid = id;
      this.radiolist = goodstype;
      this.dialogTableVisible = true;
    },
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
    deleteBtn(id){
      console.log(id);
      let that = this;
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.post('/MobileJson/CompanyAdmin/delproduct', this.qs.stringify({ 
          uid: this.user.id,
          proid: id
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
      that.axios.post('/MobileJson/CompanyAdmin/productlist', that.qs.stringify({ 
        page: that.page,
        uid: that.user.id,
        isrecord: 1,
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
    margin: 0px 3%;
  }
}
.addBusiness{
  box-sizing: border-box;
  padding: 0px 31px;
}

</style>