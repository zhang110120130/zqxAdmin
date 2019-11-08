<template>
   <div class="news">
       <div v-for="(item,ind) in datalist " :key="ind">
            <div class="each">
                <h4 class="title">系统消息</h4>
                <p class="time">{{item.systime}}</p>
                <p class="neirong">{{item.content}}</p>

            </div>
       </div>   
   </div>
</template>
<script>
export default {
  name: 'system',
  data:()=>({
    text:'',
    password:'',
    user:{},
    datalist:[]
    }),
  created(){
    this.user = this.$store.getters.getUser;
    let that = this
    that.axios.post('/MobileJson/CompanyAdmin/sysnoticelist',that.qs.stringify({uid:that.user.id}))
    .then(res => {
        this.datalist = res.data.data
    })
  },
  mounted(){
        
  },
  methods:{

  }
}
</script> 
<style lang="less" scoped>
.news{
    padding-top: 20px;
    .each{
        width: 830px;
        background: #ffffff;
        margin: auto;
        margin-bottom: 20px;
        text-align:left;
        padding:0px 50px 27px 50px;
        .title{
            padding: 27px 0;
            font-size: 24px;
            border-bottom: 1px solid #DEDEDE; 
        }
        .time{
            font-size: 18px;
            color: #999999;
            margin-top: 30px;
        }
        .neirong{
            font-size: 24px;
            color: #30323F;
            margin: 19px 0;
        }
    }
}

</style>