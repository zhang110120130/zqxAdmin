<template>
   <div class="news">
       <div v-for="(item,ind) in datalist " :key="ind">
            <div class="each"  v-if="item.type == 2" >
                <h4 class="title">审核消息</h4>
                <p class="time">{{item.systime}}</p>
                <p class="neirong"><span>您的{{item.content.productname}}{{item.content.status == 1?'通过审核':'没有通过'}}，</span><span v-if="item.content.status == 0">未通过原因:{{item.content.reason}}</span><span v-else>恭喜你可以上架你的产品了</span></p>
                <p class="jindu"><span v-if="item.content.status == 1">未通过原因:{{item.content.reason}}</span></p>
            </div>
            <div class="each" v-else>
                <h4 class="title">订单消息</h4>
                <p class="time">{{item.systime}}</p>
                <p class="neirong"><span v-if="item.content.type == 1">出售</span><span v-if="item.content.type == 2">团购</span><span v-if="item.content.type == 3">租赁</span></p>
                <p class="jindu"><span>订单号：{{item.content.orderno}}</span><span>{{item.content.status}}</span></p>
            </div>
       </div>
      
   </div>
</template>
<script>
export default {
  name: 'news',
  data:()=>({
    text:'',
    password:'',
    user:{},
    datalist:[]
    }),
  created(){
    this.user = this.$store.getters.getUser;
    let that = this
    that.axios.post('/MobileJson/CompanyAdmin/usernotice',that.qs.stringify({uid:that.user.id}))
    .then(res => {
        this.datalist = res.data.data
        for(let i=0 ;i<res.data.data.length;i++){
            this.datalist[i].content = JSON.parse( res.data.data[i].content )
        }
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
        padding:0px 50px;
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
        .jindu{
            display: flex;
            justify-content: space-between;
            color: #629EF4;
            font-size: 24px;
            padding-bottom: 30px;
        }
    }
}

</style>