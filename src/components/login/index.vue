<template>
  <div class="login">
    <div class="sign">
      <img src="../../assets/login_logo.png" alt="">
      <p>中清商务商家版</p>
      <div class="input">
        <span>用户名</span>
        <input placeholder="请输入用户名" v-model="text">
      </div>
      <div class="input">
        <span>密码</span>
        <input placeholder="请输入密码" v-model="password" type="password">
      </div>
      <div class="btn">
        <button @click="login()">登录</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data:()=>({
    text:'',
    password:''
  }),
  created(){
    let that = this;
    document.onkeypress = function(e) {
      var keycode = document.all ? event.keyCode : e.which;
      if (keycode == 13) {
        that.login();// 登录方法名
         return false;
      }
    };
  },
  methods:{
    login(){
      let that = this;
      that.axios.post('/MobileJson/CompanyAdmin/login', that.qs.stringify({
        phone: that.text,
        password: that.password
      }))
      .then(function (response) {
        if(response.data.code){
            let user =  response.data.data.user;
            user.logintime = response.data.data.logintime
            user.token = response.data.data.token;
            that.$store.state.usernotice = response.data.data.usernotice;
            that.axios.defaults.headers.TOKEN = user.token;
            sessionStorage.setItem("user", JSON.stringify(user));
            that.$store.commit('setuser', user);
            that.$router.push('/');
            that.$message({
              message: '登录成功',
              type: 'success'
            });
        }else{
          that.$message.error(response.data.data); 
        }
       
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }
}
</script> 
<style scoped>
.el-input__inner{
  height: 100px!important;
}
</style>
<style lang="less" scoped>

.login{
  height: 100vh;
  background: url('../../assets/login-bg.jpg') 100% 100%;
  background-size:100% 100%; 
  position: relative;
  .sign{
    position: absolute;
    width: 500px;
    right: 15%;
    text-align: center;
    bottom: 25%;
    img{
      width: 95px;
      height: 95px;
    }
    p{
      font-size: 40px;
    }
    .input{
      font-size: 24px;
      display: flex;
      margin:20px 0;
      span{
        display: inline-block;
        width:20%;
        min-width: 90px;
        margin-right: 25px;
        line-height: 73px;
        text-align: justify;
        text-align-last: justify;
      }
      input{
        font-size: 22px;
        width: 80%;
        padding-left: 16px;
        border-radius: 10px;
        border:1px solid #DCDCDC;
        outline: none;
      }
    }
    .btn{
      padding-top: 20px;
      button{
        width:500px;
        height:75px;
        background:rgba(98,158,244,1);
        border-radius:38px;
        border: 0;
        font-size: 30px;
        color: #FFFFFF;
        outline: none;
        cursor:pointer;
      }
    }
  }
}

</style>