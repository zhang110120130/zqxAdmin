<template>
  <div class="sellOrder">
    <div class="header" >
      <el-input
        placeholder="搜索关键词"
        v-model="search"
        clearable>
      </el-input>
      <el-button type="primary" icon="el-icon-search" @click="searchs">搜索</el-button>
      <el-button type="info" @click="clear">重置</el-button>
    </div>
    <div class="tablist">
      <div class="tab" >
        <p :class="tabIndex == '' ? 'active' : ''" @click="tabBtn('')">全部</p>
        <p :class="tabIndex == 1 ? 'active' : ''" @click="tabBtn(1)">待发货</p>
        <p :class="tabIndex == 2 ? 'active' : ''" @click="tabBtn(2)">待收货</p>
        <p :class="tabIndex == 3 ? 'active' : ''" @click="tabBtn(3)">已完成</p>
      </div>
    </div>
    <div class="list">
      <div class="tab-main" v-if="tableData.length != 0">
        <div class="tab-info" v-for="item in tableData" :key="item.id" @click="see(item.orderno)">
          <div class="tab-header">
            <p><span>订单编号：</span>{{item.orderno}}</p>
            <p><span>下单时间：</span>{{item.created_at}}</p>
          </div>
          <div class="tab-list">
            <img src="../../assets/login-bg.jpg" alt="">
            <div class="right">
              <p class="name">{{item.goodsname}}</p>
              <div class="info">
                <p>规格：{{item.specname}}</p>
                <p>数量：{{item.number}}</p>
                <p>单价：￥ {{item.price}}</p>
                <p>订单状态：<span class="status">{{item.statename}}</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="nothing" v-else>
        <img src="../../assets/zanwudingdan.png" alt="">
        <p>
          暂时还没有订单
        </p>
      </div>
    <el-dialog title="订单信息" :visible.sync="hide" width="50%">
      <div class="tab-details">
          <div class="title">订单信息</div>
          <div class="content">
            <div class="pic">
              <img :src="information.thumb" alt="">
            </div>
            <div class="name">
             <span>产品名称</span>{{information.goodsname}}
            </div>
            <div class="information">
              <div>
                <span>规格</span>{{information.specname}}
              </div>
              <div>
                <span>订单状态</span><b>{{information.statename}}</b>  
              </div>
            </div>
            <div class="information">
              <div>
                <span>数量</span>{{information.number}}
              </div>
              <div>
                <span>单价</span>{{information.price}}
              </div>
            </div>
        
            <div class="number">
              <span>订单编号</span>{{information.orderno}}
            </div>
            <div class="timedata">
              <span>下单时间</span>{{information.created_at}}
            </div>
            <div class="phone">
              <span>电话号码</span>{{information.receipt_phone}}
            </div>
            <div class="address">
              <span>预留地址</span> {{information.receipt_address}}
            </div>
            
            <div class="express" v-if="information.statename == '已付款'">
              <span>快递单号</span><input type="text" placeholder="请填写快递单号" v-model="information.courier">
            </div>
            <div class="address" v-else>
              <span>快递单号</span> {{information.courier}}
            </div>
            <div class="remarks" v-if="information.statename == '已收货'">
              <span>备注</span> <input type="text" placeholder="请填写备注" v-model="information.beizhu">
            </div>
            <div class="function">
              <button @click="hide = !hide">返回</button>
              <button v-if="information.statename == '已付款'" @click="deliver">发货</button>
              <button v-if="information.statename == '已收货'&&information.beizhu==''" @click="complete">完成</button>
            </div>
          </div>
      </div>
    </el-dialog>
      
    </div>
    <el-pagination
      background
      layout="prev, pager, next"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-count="Math.ceil(pages / 5)">
    </el-pagination>
    <el-dialog :visible.sync="dialogTableVisible" :show-close = false width="406px">
      <span slot="title" class="dialog-title">
        <el-radio-group v-model="radio">
          <el-radio :label="3">备选项</el-radio>
          <el-radio :label="6">备选项</el-radio>
          <el-radio :label="9">备选项</el-radio>
        </el-radio-group>
      </span>
      <div class="addBusiness">
        <div class="sell">
          <el-form ref="form" :model="form" label-width="50px">
            <el-form-item label="价格">
              <el-input v-model="form.name"></el-input>
              <span>元</span>
            </el-form-item>
            <el-form-item label="库存">
              <el-input v-model="form.name"></el-input>
              <span>元</span>
            </el-form-item>
            <el-form-item label="运费">
              <el-input v-model="form.name"></el-input>
              <span>元</span>
            </el-form-item>
            <el-form-item label="保险">
              <el-input v-model="form.name"></el-input>
              <span>元</span>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogTableVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'sellOrder',
  data:()=>({
    form: {
      name: '',
    },
    tabIndex: '',
    radio: '1',
    dialogTableVisible: false,
    search: '',
    tableData: [],
    user: null,
    page: 1,
    pages: 0,
    information:{},
    hide:false
  }),
  created(){
    this.user = this.$store.getters.getUser;
    this.getList();
  },
  methods: {
    handleCurrentChange: function(currentPage){
      this.page = currentPage;
      this.getList();
    },
    getList(){
      let that = this;
      this.axios.post('/MobileJson/CompanyAdmin/orderlist', this.qs.stringify({ 
        uid: that.user.id,
        type: 2,
        keyword:that.search,
        state: that.tabIndex,
        page: that.page
      }))
      .then(function (response) {
        if(response.data.code == true){
          that.tableData = response.data.data;
          that.pages = response.data.count;
        }
      })
      .catch(function (error) {
      });
    },
    tabBtn(index){
      this.page = 1
      this.tabIndex = index;
      this.getList();
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
    },
    see(item){
      let that = this
      that.axios.post('/MobileJson/CompanyAdmin/orderdetail',that.qs.stringify({
        orderno:item,
        uid:that.user.id
      }))
      .then(res => {
        that.information = res.data.data 
        that.hide = !that.hide
      })
        
    },
    deliver(){
      let that = this
      if(that.information.courie == ''){
        this.$message.error('请填写快递单号'); 
      }
      that.axios.post('/MobileJson/CompanyAdmin/delivery',that.qs.stringify({
        orderno:that.information.orderno,
        courier:that.information.courier,
        uid:that.user.id
      }))
      .then( res => {
         if(res.data.code){  
          this.$message({
            message: res.data.data,
            type: 'success'
          });
          this.getList()
          that.hide = !that.hide
        }else{
          this.$message.error(res.data.data); 
        }

       
      })
    },
    complete(){
      let that = this
      that.axios.post('/MobileJson/CompanyAdmin/addbeizhu',that.qs.stringify({
        orderno:that.information.orderno,
        beizhu:that.information.beizhu,
        uid:that.user.id
      }))
      .then( res => {
        
        if(res.data.code){  
          this.$message({
            message: res.data.data,
            type: 'success'
          });
          this.getList()
          that.hide = !that.hide
        }else{
          this.$message.error(res.data.data); 
        }

      })
    },
    clear(){
      let that = this
      that.search = ''
      that.tabIndex =''
      that.page = 1
      that.getList()
    },
    searchs(){
      this.getList()
    }
  }

}
</script>
<style lang="less" scoped>
    .sellOrder{
      position: relative;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      padding: 90px 26px 100px 26px;
    }
    .header{
      position: fixed;
      top: 88px;
      left:420px;
      display: flex;
      align-items: center;
      width: 100%;
      height: 103px;
      .el-input{
        width: 382px;
      }
    }
    .tablist{
      padding: 0 27px;
      height: 15%;
      .tab{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-around;
        align-items:  flex-end ;
        background: #FFF;
        p{
          font-size: 30px;
          font-weight: 500;
          height: 70%;
          box-sizing: border-box;
          padding:0 20px;
          border-bottom: #FFF solid 3px;
          cursor:pointer;
        }
        .active{
          color: #629EF4FF;
          border-color: #629EF4FF;
        }
      }
    }
    .list{
      width: 100%;
      height: 83%;
      margin-top:2%; 
      box-sizing: border-box;
      padding: 0px 27px 10px 27px;
      overflow: auto;
      
      .tab-info{
        width: 100%;
        height: 183px;
        background: #FFF;
        box-sizing: border-box;
        padding: 0px 15px;
        margin-bottom: 10px;
      }
      .tab-header{
        width: 100%;
        height: 55px;
        border-bottom: 1px solid #E5E5E5FF;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 0px 244px 0px 13px;
        span{
          color: #1C2E32FF;
          font-weight: bold;
          font-size: 18px;
        }
      }
      .tab-main{
        width: 100%;
        height:100%;
        .tab-list{
             width: 100%;
            display: flex;
            justify-content: flex-start;
          .right{
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            .name{
              margin-bottom: 19px;
            }
            .info{
              width: 100%;
              display: flex;
              justify-content: space-around;
              p{
                width: 25%;
                text-align: left;
              }
            }
          }
          img{
            width: 160px;
            height: 90px;
          }
        }
        
      }
      .nothing{
        text-align: center;
        background: #ffffff;
        padding: 40px;
        img{
          width:200px;
        }
        p{
          line-height: 50px;
          font-size: 20px;
          color: #999999;
        }
      }
      .tab-details{
        padding: 0 30px;
        box-sizing: border-box;
        width: 100%;
        background: #ffffff;
        text-align: left;
        height:600px;
        overflow: auto;
        .title{
          font-size: 18px;
          line-height: 50px;
          color: #1C2E32;
          font-weight: 600;
          border-bottom: 1px solid #E5E5E5;
        }
        .pic{
          margin-top: 27px;
          width: 100%;
          text-align: center;
        }
        .name{
          margin: 27px 0 2px;
          height: 73px;
          line-height: 73px;
          background: #EDEFF1;
          height: 100%;
          font-size: 18px;
          color: #666666;
          padding-left:15px; 
          display: flex;
          span{
            color: #333333;
            width: 73px;
            display: block;
            padding-right:30px; 
          }
        }
        .information{
          height: 73px;
          margin-bottom: 2px;
          line-height: 73px; 
          height: 100%;
          font-size: 18px;
          color: #666666;
          display: flex;
          justify-content:space-between;
          div{
            width: 49.9%;
            background: #EDEFF1;
            padding-left:15px; 
            display: flex;
            box-sizing: border-box;
            span{
              color: #333333;
              width: 73px;
              display: block;
              padding-right:30px; 
            }
            b{
              font-weight: 100;
              color: #FF3F3F;
            }
          }
        }
        .number,.address,.timedata,.phone{
          height: 73px;
          margin-bottom: 2px;
          line-height: 73px;
          background: #EDEFF1;
          height: 100%;
          font-size: 18px;
          color: #666666;
          padding-left:15px; 
          display: flex;
          span{
            color: #333333;
            width: 73px;
            display: block;
            padding-right:30px; 
          }
        }
        .express{
          height: 73px;
          margin-bottom: 2px;
          line-height: 73px;
          background: #EDEFF1;
          height: 100%;
          font-size: 18px;
          color:  #629EF4;
          padding-left:15px; 
          display: flex;
          input{
            background: #EDEFF1;
            border: 0;
            outline: none;
          }
          span{
              width: 73px;
              display: block;
              padding-right:30px; 
            }
        }
        .remarks{
          height: 73px;
          margin-bottom: 2px;
          line-height: 73px;
          background: #EDEFF1;
          height: 100%;
          font-size: 18px;
          color:  #629EF4;
          padding-left:15px; 
          display: flex;
          span{
            width: 73px;
            display: block;
            padding-right:30px; 
          }
          input{
            background: #EDEFF1;
            border: 0;
            outline: none;
          }
        }
        .function{
          display: flex;
          padding: 26px;
          justify-content:center;
          button{
            margin: 0 20px;
            border: 0;
            width:168px;
            height:56px;
            background:rgba(226,228,231,1);
            border-radius:4px;
            outline: none;
            color: #666666;
            font-size: 20px;
            cursor:pointer;
          }
          button:nth-child(2){
            color: #ffffff;
            background:linear-gradient(90deg,rgba(60,141,255,1),rgba(98,189,250,1));
          }
        }
      }
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