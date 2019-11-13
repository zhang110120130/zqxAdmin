<template>
  <el-container>
    <el-aside width="20vw">  
      <div class="logo">
        <img src="../assets/login_logo.png" alt="中清商务">
        <p>中清商务商家版</p>
      </div>
      <el-menu
        class="el-menu-vertical-demo"
        router= router
        @open="handleOpen"
        @close="handleClose"
        background-color="#FFF"
        text-color="#30323FFF"
        active-text-color="#30323FFF">
        <el-menu-item index="/company">
          <i class="icon icon-1"></i>
          <span slot="title">企业</span>
        </el-menu-item>
        <el-submenu index="2">
          <template slot="title">
            <i class="icon icon-2"></i>
            <span>产品</span>
          </template>
          <el-menu-item index="/addProduct">添加产品</el-menu-item>
          <el-menu-item index="/ProductManage">产品管理</el-menu-item>
          <el-menu-item index="/ProductDraft">草稿箱</el-menu-item>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="icon icon-3"></i>
            <span>商务</span>
          </template>
          <el-menu-item index="/sellBusiness">我要出售</el-menu-item>
          <el-menu-item index="/leaseBusiness">我要出租</el-menu-item>
          <el-menu-item index="/groupBusiness">我要开团</el-menu-item>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title">
            <i class="icon icon-4"></i>
            <span>订单管理</span>
          </template>
          <el-menu-item index="/sellOrder">出售订单</el-menu-item>
          <el-menu-item index="/group">出租订单</el-menu-item>
          <el-menu-item index="/lease">开团订单</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <img v-if="$store.state.usernotice == 0" src="../assets/xinxi.png" @click="news()" alt="" style="cursor:pointer;">
        <el-badge v-else :value="$store.state.usernotice" class="item">
          <img src="../assets/xinxi.png" @click="news()" alt="" style="cursor:pointer;">
        </el-badge>
        <p @click="news()" style="cursor:pointer;">消息</p>
        <el-avatar :size="'large'" :src='user.avatar'></el-avatar>
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
           {{user.nickname}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="a">更换头像</el-dropdown-item>
            <el-dropdown-item command="b">修改昵称</el-dropdown-item>
            <el-dropdown-item command="c">修改手机号</el-dropdown-item>
            <el-dropdown-item command="d">修改密码</el-dropdown-item>
            <el-dropdown-item command="e">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-dialog
        :title="title" :visible.sync="dialogVisible" width="53%" :style="selectId==5?{'text-align': 'center'}:{'text-align': 'left'}">
        <!-- 修改头像 -->
        <div id="Modifyavatar" v-if='selectId == 1' >
          <el-upload
            class="avatar-uploader"
            action="http://article.5i71.org/Communal/upload/upload_file"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          
          <div class="beizhu">
              <p>推荐640像素，JPN/PNG,5M以内</p>
          </div>
        </div>
        <!-- 修改昵称  -->
        <div id="Modifynickname" v-else-if='selectId == 2'>
            <p> <span>昵称</span> <input type="text" v-model="nickname"></p>
        </div>
        <!-- 修改手机号 -->
        <div id='Modifymobile' v-else-if='selectId == 3'>
            <div id="oldmobile">
              <p> <span>原手机号</span><input type="number" disabled v-model="user.phone"><button @click="Getvalidation(1)">{{Sendingtime1}}</button></p>
              <p> <span>验证码</span><input type="number" v-model="OldVerificationCode"></p>
            </div>
            <div id="newmobile">
              <p> <span>新手机号</span><input type="number" v-model="newphone"><button @click="Getvalidation(2)">{{Sendingtime2}}</button></p>
              <p> <span>验证码</span><input type="number" v-model="NewVerificationCode"></p>
            </div>
        </div>
        <!-- 修改密码 -->
        <div id="ChangePassword" v-else-if='selectId == 4'>
             <p> <span>手机号</span><input type="number" disabled v-model="user.phone"><button @click="Getvalidation(3)">{{Sendingtime3}}</button></p>
             <p> <span>验证码</span><input type="number" v-model="passwordVerification"></p>
             <p> <span>旧密码</span><input type="text" v-model="oldpassword"></p>
             <p> <span>新密码</span><input type="text" v-model="newpassword" @blur="yanzheng"></p>
        </div>
        <!-- 修改推出登录 -->
        <div id='signout' v-else>
          您确定要退出么？
        </div>
        
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="Determine(selectId)">确 定</el-button>
        </span>
      </el-dialog>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data:()=>({
    active: '',
    router: true,
    title:'更换头像',
    dialogVisible: false,
    selectId:1,
    imageUrl: '',
    nickname:'',
    user: null,
    Sendingtime1:'获取验证码',
    Sendingtime2:'获取验证码',
    Sendingtime3:'获取验证码',
    newphone:'',//新手机号
    NewVerificationCode:'',//新手机验证码
    OldVerificationCode:'',//旧手机验证码
    newpassword:'',//新密码
    oldpassword:'',//旧密码
    passwordVerification:''//修改密码验证码
  }),
  created(){
    this.active = this.$route.path;
    this.user = this.$store.getters.getUser;
    console.log(this.user);
  },
  watch:{
      $route(to,from){
          this.active = this.$route.path;
      }
  },
  methods: {
    yanzheng(){
        let that = this;
        let res = /^\w+$/;
        if(!res.test(that.newpassword)){
          this.$message.error('由数字、26个英文字母或者下划线')
          that.newpassword = ''       
        }
    },
    //跳转消息页面
    news(){
      let that = this
      that.$router.push({name:'news', params:{ time: Date.now()}});
    },
    //上传头像
    handleAvatarSuccess(res, file) {
      this.imageUrl = res.url
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 5;
      if(file.type != 'image/jpeg'&&file.type != 'image/png') {
        this.$message.error('上传头像图片只能是 JPG,PNG格式!');
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 5MB!');
        return false
      }
    },
    Getvalidation(id){ // 获取验证码
      let that = this
      if(id == 1){  // 修改手机号 旧手机号验证码
        if(that.Sendingtime1 != '获取验证码'){
          this.$message.error('请'+that.Sendingtime1+'秒后再试')
          return false
        }
        that.axios.post('/MobileJson/CompanyAdmin/sendCode',that.qs.stringify({phone:that.user.phone,type:'2'}))
        .then(res => {
          if(res.data.code){
            this.$message({
                message: res.data.data,
                type: 'success'
            });
            that.Sendingtime1 = 60
            let interval = setInterval(()=>{
              that.Sendingtime1 -=1;
               if(that.Sendingtime1 == 0){
                  that.Sendingtime1 = '获取验证码'
                  clearInterval(interval)
              } 
            },1000)
          }else{
            this.$message.error(res.data.data)
          }
        })       
      }else if(id == 2){ // 修改手机号 新手机号验证码
        if(that.Sendingtime2 != '获取验证码'){
          this.$message.error('请'+that.Sendingtime2+'秒后再试')
          return false
        }
        that.axios.post('/MobileJson/CompanyAdmin/sendCode',that.qs.stringify({phone:that.newphone,type:'2'}))
        .then(res => {
          if(res.data.code){
            this.$message({
                message: res.data.data,
                type: 'success'
            });
            that.Sendingtime2 = 60
            let interval1 = setInterval(()=>{
              that.Sendingtime2 -=1;
               if(that.Sendingtime2 == 0){
                  that.Sendingtime2 = '获取验证码'
                  clearInterval(interval1)
              } 
            },1000)
          }else{
            this.$message.error(res.data.data)
          }
        }) 
      }else{ // 修改密码 手机号验证
        if(that.Sendingtime3 != '获取验证码'){
          this.$message.error('请'+that.Sendingtime3+'秒后再试')
          return false
        }
        that.axios.post('/MobileJson/CompanyAdmin/sendCode',that.qs.stringify({phone:that.user.phone,type:'1'}))
        .then(res => {
          if(res.data.code){
            this.$message({
                message: res.data.data,
                type: 'success'
            });
            that.Sendingtime3 = 60
            let interval2 = setInterval(()=>{
              that.Sendingtime3 -=1;
               if(that.Sendingtime3 == 0){
                  that.Sendingtime3 = '获取验证码'
                  clearInterval(interval2)
              } 
            },1000)
          }else{
            this.$message.error(res.data.data)
          }
        }) 
      }
    },
    handleOpen(){

    },
    handleClose(){

    },
    handleCommand(command) {
      switch(command){
          case 'a':
              this.title= '修改头像';
              this.selectId=1;
              break;
          case 'b':
              this.title= '修改昵称';
              this.selectId=2
              break;
          case 'c':
              this.title= '修改手机号';
              this.selectId=3
              break;
          case 'd':
              this.title= '修改密码';
              this.selectId=4
              break;
          case 'e':
              this.title= '退出登录';
              this.selectId=5
              break;
      }
      this.dialogVisible = true
    },
    Determine(id){
          let that = this
        switch(id){
          case 1: // 上传头像ajax
            that.axios.post('/MobileJson/CompanyAdmin/editavatar',that.qs.stringify({
            uid: that.user.id,
            avatar: that.imageUrl,
            user:{}
            }))
            .then(res=>{
              this.$message({
                message: '修改成功',
                type: 'success'
              });
              that.user.avatar = that.imageUrl;
              this.imageUrl = ''
              sessionStorage.setItem('user', JSON.stringify(that.user));
            }) 
            that.dialogVisible = false
            break;
          case 2: // 上传昵称
            if(that.nickname == ''){
              this.$message.error('昵称不能为空');
              return false
            }
            that.axios.post('/MobileJson/CompanyAdmin/editnickname',that.qs.stringify({
            uid: that.user.id,
            nickname: that.nickname,
            }))
            .then(res=>{
              if(res.data.code){
                this.$message({
                  message: res.data.data,
                  type: 'success'
                });
                that.user.nickname = that.nickname;
                that.nickname = ''
                sessionStorage.setItem('user', JSON.stringify(that.user));
                that.dialogVisible = false
                return false
              }
              this.$message.error(res.data.data);              
            })
            break;
          case 3: // 修改手机号
              that.axios.post('/MobileJson/CompanyAdmin/editphone',that.qs.stringify({
              uid:that.user.id,
              oldcode:that.OldVerificationCode,
              newcode:that.NewVerificationCode,
              oldphone:that.user.phone,
              newphone:that.newphone
              }))
              .then(res =>{
                if(res.data.code){
                that.$message({
                  message: res.data.data,
                  type: 'success'
                });
                  that.dialogVisible = false
                  this.$store.commit('clearuser');
                  this.$router.push({path:'/login'})
                }else{
                  that.$message.error(res.data.data);  
                }
              })
            break
          case 4: // 修改密码
          that.axios.post('/MobileJson/CompanyAdmin/editpwd',that.qs.stringify({
            uid:that.user.id,
            yancode:that.passwordVerification,
            phone:that.user.phone,
            newpwd:that.newpassword,
            oldpwd:that.oldpassword
          }))
          .then(res => {
            if(res.data.code){
              that.$message({
                message: res.data.data,
                type: 'success'
              });
                that.dialogVisible = false
                this.$store.commit('clearuser');
                this.$router.push({path:'/login'})
              }else{
                that.$message.error(res.data.data);  
              }
          })
            break
          case 5: // 退出登录
            this.$store.commit('clearuser');
            this.$router.push({path:'/login'})
            break
        }
    }
  }
}
</script> 
<style lang="less" scoped>
  .el-header{
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 88px !important;
    background-color: #30323F;
    color: #FFF;
    text-align: center;
    p{
      margin-left: 20px;
    }
    .el-avatar{
      margin-left: 61px;
      margin-right: 20px;
    }
    .el-dropdown{
      color: #FFF;
    }
  }

  .el-aside {
    height: 100vh;
    background-color: #FFF;
    color: #333;
    text-align: center;
  }
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    height: 80vh!important;
    padding: 0 !important;
  }
  body > .el-container {
    margin-bottom: 40px;
  }
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  } 
  .el-menu{
    border: none;
  }
  .el-menu-vertical-demo {
    width: 99%;
    display: inline-block;
    text-align: left;
  } 
  .el-menu-vertical-demo span{
    font-size: 18px;
  }
  .el-menu-vertical-demo li ul li.el-menu-item{
    padding-left: 90px !important;
  }
  .el-menu-item{
    border-left: 7px solid #FFF;
  }
  .el-menu-item.is-active{
    border-left: 7px solid #629EF4;
    background:rgba(247,248,252,1) !important;
  }
  .el-container.is-vertical{
    height: 100vh;
  }
  .el-main::-webkit-scrollbar {
    display: none;
  }
  .logo{
    box-sizing: border-box;
    padding-top: 51px;
    p{
      margin-top: 20px;
      margin-bottom: 63px;
      line-height: normal;
      font-size:28px;
      font-weight: 800;
      font-style:italic;
    }
  }
  .icon{
    display: inline-block;
    margin-right: 25px;
    width: 20px;
    height: 20px;
    text-align: center;
    font-size: 18px;
    vertical-align: text-bottom;
  }
  .icon-1{
    background: url('../assets/icon_1.png') no-repeat;
    background-size: 100% 100%;
  }
  .icon-2{
    background: url('../assets/icon_2.png') no-repeat;
    background-size: 100% 100%;
  }
  .icon-3{
    background: url('../assets/icon_3.png') no-repeat;
    background-size: 100% 100%;
  }
  .icon-4{
    background: url('../assets/icon_4.png') no-repeat;
    background-size: 100% 100%;
  }
// 上传头像
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 60px;
    color: #E5E5E5;
    width: 153px;
    background: #F3F3F3;
    height: 153px;
    line-height: 153px;
    text-align: center;
  }
  .avatar {
    width: 153px;
    height: 153px;
    display: block;
  }
  // 修改信息弹窗
  //头像
  #Modifyavatar{
    position: relative;
    .beizhu{
      left: 180px;
      position: absolute;
      bottom: 0;
    }
  }
  //昵称
  #Modifynickname{
    display: flex;
    padding-left: 30px;
    span{
      line-height: 32px;
      font-size: 18px;
    }
    input{
      height: 32px;
      line-height: 32px;
      font-size: 18px;
      box-sizing: border-box;
      outline: none;
      margin-left:20px;
      padding-left: 16px; 
    }
  } 
  //修改手机号
  #Modifymobile{
    width: 70%;
    div{
      p{
        display: flex;
        margin-bottom: 20px;
        span{
            width: 20%;
            line-height: 32px;
            text-align: center;
            font-size: 18px;
        }
        input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{
            -webkit-appearance: none;
            margin: 0; 
        }
        input[type="number"]{
          -moz-appearance:textfield;
        }
      }
      p:first-child{
        input{
          width: 50%;
          height: 32px;
        }
        button{
          margin-left: 10%;
          width: 20%;
          height: 32px;
          border:1px solid rgba(98,158,244,1);
          border-radius:4px;
          background: #ffffff;
          color: #629EF4;
          outline: none;
          cursor:pointer;
        }
      }
      p{
        input{
          width: 80%
        }
      }
    }
  }
  //修改密码
  #ChangePassword{
    width: 70%;
    p{
      display: flex;
      line-height: 32px;
      margin-bottom: 20px;
      span{
        width: 20%;
        text-align: center;
      }
      input{
        height: 32px;
        width: 80%;
      }
       input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{
            -webkit-appearance: none;
            margin: 0; 
      }
      input[type="number"]{
        -moz-appearance:textfield;
      }
    }
    p:first-child{
      input{
        width: 50%;
      }
      button{
        margin-left: 10%;
        width: 20%;
        height: 32px;
        border:1px solid rgba(98,158,244,1);
        border-radius:4px;
        background: #ffffff;
        color: #629EF4;
        outline: none;
        cursor:pointer;
      }
    }
  }
</style>