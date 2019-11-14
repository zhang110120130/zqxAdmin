<template>
  <div class="draft">
    <div class="header">
      <p class="title">产品管理</p>
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
          prop="cates"
          label="分类"
          width="180">
          <template slot-scope="scope">
            {{scope.row.cates.join(' | ')}}
          </template>
        </el-table-column>
        <el-table-column
          prop="specname"
          label="规格"
          width="180">
        </el-table-column>
        <el-table-column
          prop="goodstype"
          label="状态"
          width="180">
          <template>
            未提交
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作">
          <template slot-scope="scope">
            <div class="operation">
              <p @click="deleteBtn(scope.row.id)">删除</p>
              <p class="line"></p>
              <p @click="edit(scope.row.id)">编辑</p>
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
      :page-count="Math.ceil(count / 5)">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'draft',
  data:()=>({
    form: {
      name: '',
    },
    radio: '1',
    dialogTableVisible: false,
    tableData: [],
    user: null,
    page: 1,
    count: 0,
    keywords: ''
  }),
  created(){
    this.user = this.$store.getters.getUser;
    this.getList();
  },
  methods: {
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
    handleCurrentChange(val){
      console.log(val);
      this.page = val;
      this.getList();
    },
    edit(id){
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
    deleteBtn(id){
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
    getList(){
      let that = this;
      that.axios.post('/MobileJson/CompanyAdmin/draftslist', that.qs.stringify({ 
        page: that.page,
        uid: that.user.id,
        isrecord: 1,
        keywords: that.keywords
      }))
      .then(function (response) {
        console.log(response.data);
        that.count = Number(response.data.count)
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
  }

}
</script>
<style lang="less" scoped>
.draft{
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
    margin: 0px 40px;
  }
}
.addBusiness{
  box-sizing: border-box;
  padding: 0px 31px;
  .el-input{
    width: 209px;
    margin-right: 15px;
  }
}

</style>