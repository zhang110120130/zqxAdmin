<template>
  <div class="company">
      <div class='company-left'>
          <!-- 企业信息 -->
          <div class="company-left-one">
              <div class="title"><span>企业信息</span><span @click="edit(1)">编辑</span></div>
              <div class="contant">
                <el-avatar shape="circle" :size="113" fit="cover" :src="company.thumb"></el-avatar>
                <div>
                  <h4>{{company.title}}</h4>
                  <p>企业地址:<span>{{company.province}} - {{company.city}}</span></p>
                  <p>上次登录时间：{{user.logintime}}</p>
                </div>
              </div>
          </div>
          <!-- 企业详情 -->
          <div class="company-left-two">
              <div class="title"><span>企业详情</span><span @click="edit(2)">编辑</span></div>
              <div v-html="company.description" class="content">123456</div>
          </div>
          <div class="company-left-three">
              <div class="title"><span>企业类型</span><span @click="edit(3)">编辑</span></div>
              <div class="contant">
                  <div v-for="item in datalist.companies_type" :key="item.id">{{item.title}}</div>
              </div>
          </div>
          <!-- 经营范围 -->
          <div class="company-left-four">
              <div class="title"><span>经营范围</span><span @click="edit(3)">编辑</span></div>
              <div class="contant">
                  <div v-for="item in datalist.companies_tags" :key="item.id">{{item.title}}</div>
              </div>
          </div>
          <!-- 企业项目 -->
          <div class="company-left-five">
              <div class="title"><span>企业项目</span><span  @click="edit(4)">编辑</span></div>
              <div class="project" v-for="(item,index) in company.com_pro" :key="index">
                <div class="name">
                  <p>项目名称</p>
                  <p>{{item.namepro}}</p>
                </div> 
                <div class='time'>
                  <p>项目日期</p>
                  <p><span>{{item.stopdate}}</span></p>
                </div>
                <div class="pics">
                  <p>项目展示照片</p>
                  <div>
                    <el-image style="width: 117px; height: 90px;margin-right:24px;" :src="item.imgi" fit="cover"></el-image>

                  </div>
                </div>
              </div>
          </div>
          <!-- 企业荣誉 -->
          <div class="company-left-six">
              <div class="title"><span>企业荣誉</span><span  @click="edit(4)">编辑</span></div>
              <div>
                <el-image style="width: 22%; height: 240px;margin-right:4%;" v-for="(item,index) in  company.img_buf" :key="index" :src="item.img_cover" fit="cover"></el-image>
              </div>
          </div>
      </div>
      <div class="company-right">
          <div class="company-right-one">
              <img src="../../assets/xiaoxi.png" alt="">
              <div>
                <p>系统公告</p>
                <p>共有<span>{{datalist.sysnum}}</span>条公告</p>
                <p @click="gosystem()">点击查看</p>
              </div>
          </div>
          <div class="company-right-two">
            <img src="../../assets/dingdan.png" alt="">
              <div>
                <p>今日订单</p>
                <p>{{datalist.todayorder}}</p>
                <p>总订单量：{{datalist.allorder}}</p>
              </div>
          </div>
          <div class="company-right-three">
            <img src="../../assets/liulan.png" alt="">
              <div>
                <p>总浏览量</p>
                <p>{{datalist.look}}</p>
                <p></p>
              </div>
          </div>

      </div>
      <div class='alert'>
        <el-dialog :title="title" :visible.sync="dialogVisible" width="60%">
          <!-- 编辑企业资料 -->
          <div class="one" v-if="editid == 1">
            <div class='top'>
              <span>企业logo：</span>
              <el-upload
                class="avatar-uploader"
                action="http://article.5i71.org/Communal/upload/upload_file"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <span>图片大小<br>500*500像素</span>
            </div>
            <div class="bottom">
              <div class="one-bottom-left"><span>企业名称：</span><input type="text" v-model="company.title" disabled ></div>
              <div class="one-bottom-right"><span>企业地址：</span>
              <el-cascader
              :placeholder="address==''?请选择企业地区:address"
              :options="option"
              :props= "props"     
              filterable
              @change='getCheckedNodes'></el-cascader>
              </div>
            </div>
          </div>
          <!-- 编辑企业详情 -->
          
          <div class="two" v-else-if="editid == 2">
          <!-- 编辑器 -->
              <div id='quillEditorQiniu'>
                        <!-- 基于elementUi的上传组件 el-upload begin-->
                        <el-upload
                                class="avatar-uploader"
                                :action="uploadUrl"
                                :accept="'image/*'"
                                :data="qiniuForm"
                                :show-file-list="false"
                                :on-success="uploadEditorSuccess"
                                :on-error="uploadEditorError"
                                :before-upload="beforeEditorUpload">
                            </el-upload>
                            <!-- 基于elementUi的上传组件 el-upload end-->
                            <quill-editor  class="editor"  v-model="company.description" ref="customQuillEditor" :options="editorOption" >
                            </quill-editor>
              </div>
          </div>
          <!-- 企业类型修改 -->
          <div class="three" v-else-if="editid == 3">
            <div class="top">
              <div class="title">企业类型</div>
              <div class="content">
                <div :class="item.flag == 1?'selected':''" selected v-for="item in enterprisesType.list_type" :key="item.id" @click="comparytype(item)">
                    {{item.title}}
                </div>
              </div>
            </div>
            <div class="bottom" >
              <div class="title">经营范围</div>
              <div class="content">
                <div :class="item.flag == 1?'selected':''" v-for="item in enterprisesType.list_tag" :key="item.id"  @click="serviceScope(item)">
                    {{item.title}}
                </div>  
              </div>
            </div>
          </div>
          <!-- 企业项目修改 -->
          <div class="four" v-else>
            <div class="title">
              企业项目
            </div>
            <div class="project">
                <div class="project-only" v-for="(item,index) in project" :key="index" @click="clickfun(index)">
                    <p style="margin-bottom:20px;"><span>项目名称</span> <span><el-button type="danger" icon="el-icon-delete" circle @click="deleteitem(index)"></el-button></span> </p>
                    <p><input type="text" v-model="item.namepro" placeholder="填写您项目的名称"></p>
                    <p>项目日期</p>
                    <p>
                     <el-date-picker v-model="item.stopdate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" ></el-date-picker>
                    </p>
                    <p>项目展示图片</p>
                    <p>
                      <el-upload class="avatar-uploader" action="http://article.5i71.org/Communal/upload/upload_file" :show-file-list="false"   :on-success="handleAvatarSuccesss" :before-upload="beforeAvatarUploads">
                        <img v-if="item.imgi" :src="item.imgi" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                      </el-upload>
                    </p>
                </div>
                <div class="add-project" v-if='project.length<3'>
                    <button @click="addproject">添加项目+</button>
                </div>
            </div>
            <div class="title">
              企业荣誉  <span>（上传图片大小不超过10M）</span>
            </div>
            <div class="Honor">
              <el-upload
                action="http://article.5i71.org/Communal/upload/upload_file"
                list-type="picture-card"
                :limit='3'
                :file-list='imglist'
                :before-upload="handleChange"
                :on-success="success"
                :on-remove="handleRemove">
                <i class="el-icon-plus"></i>
              </el-upload>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="determine">确 定</el-button>
          </span>
        </el-dialog>

      </div>
  
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
//自定义编辑器的工作条
const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],

        [{'header': 1}, {'header': 2}],               // custom button values
        [{'list': 'ordered'}, {'list': 'bullet'}],
        [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
        [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
        [{'direction': 'rtl'}],                         // text direction

        [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
        [{'header': [1, 2, 3, 4, 5, 6, false]}],

        [{'color': []}, {'background': []}],          // dropdown with defaults from theme
        [{'font': []}],
        [{'align': []}],
        ['link', 'image', 'video'],
        ['clean']                                         // remove formatting button
];
import city from './city.json'
export default {
  data:()=>({
    circleUrl: "http://hbimg.b0.upaiyun.com/0c974e6d6380c52ee42b1c112a932f191dc10e72e49b-iI90LW_fw658",
    url: 'http://hbimg.b0.upaiyun.com/0c974e6d6380c52ee42b1c112a932f191dc10e72e49b-iI90LW_fw658',
    dialogVisible: false,
    imageUrl: '',//企业logo
    title:'',
    value1:'',
    projectid:0,
    project:[{namepro:'',stopdate:'',imgi:''}],
    dialogImageUrl: '',
    disabled: false,
    editid:null,
    address:'', //地址
    // 编辑器
    domain: 'http://imgs.5i71.org/',
    form: {  
      name: '',
      details: ''
    },
    props: { // elementui 联动配置
      value: 'name',
      children: 'cities',
      label: 'name'
    },
    option:[],//地区表
    datalist:{},
    user:{},
    imglist:[],//渲染荣耀图
    imageslist:[],//发送荣誉图
    company:{},
    enterprisesType:{},
    arr_tag:[],//上传经营范围
    arr_type:[],//上传企业类型
    province:'',//地区省
    city:'',//地区市
    quillUpdateImg:false,
    editorOption:{
            placeholder:'请填写企业详情信息',
            modules: {
                toolbar: {
                    container: toolbarOptions,  // 工具栏
                    handlers: {
                        'image': function (value) {
                            if (value) {
                                document.querySelector('#quillEditorQiniu .avatar-uploader input').click()
                            } else {
                                this.quill.format('image', false);
                            }
                        }
                    }
                }
            }
    },
    qiniuForm:{
        'key': '',
        'token': '',
        'domain':''
    },
    uploadUrl: 'http://up-z1.qiniup.com'
  }),
  computed: {

  },
  created(){
    this.option = city
    let that = this
    that.user = that.$store.getters.getUser;
    // 获取首页数据
    that.rendering()
  },
  mounted() {
        let that = this;
        that.axios.post('/MobileJson/Api/getQiniutoken', that.qs.stringify({
        }))
        .then(function (response) {
            
            that.qiniuForm.token = response.data.uptoken;
        })
        .catch(function (error) {
            console.log(error);
        });
        this.qiniuForm.key =  new Date().getTime()+""+Math.floor(Math.random()*1000);
        this.qiniuForm.domain = 'http://imgs.5i71.org/';
  },
  methods:{
      rendering(){// 获取首页数据
        let that = this
        that.axios.post('/MobileJson/CompanyAdmin/companychief',that.qs.stringify({
          uid:that.user.id
        }))
        .then(res => {
          that.imglist = [];
          that.datalist = res.data.data;
          that.company = res.data.data.company;
          that.imageUrl = res.data.data.company.thumb;
          that.address = that.company.province +'/'+ that.company.city;
          that.province = that.company.province;
          that.city = that.company.city;
          if(that.company.com_pro!=""){
              that.project = that.company.com_pro;
          }
          if(that.company.img_buf!=""){
            for(let i=0;i<that.company.img_buf.length;i++){
              let obj = {name:'1.jpg',url:that.company.img_buf[i].img_cover}
              that.imglist.push(obj)
              that.imageslist.push({img_cover:that.company.img_buf[i].img_cover})
            }
          }
          
        })
        that.axios.post('/MobileJson/CompanyAdmin/comtypeinfo',that.qs.stringify({
          uid:that.user.id
        }))
        .then(res => {
          that.arr_type = []
          that.enterprisesType = res.data
          for(let i=0;i<res.data.list_type.length;i++){
            if(res.data.list_type[i].flag == 1){
              that.arr_type.push(res.data.list_type[i].id)
            }
          }
          that.arr_tag = [];
          for(let j=0;j<res.data.list_tag.length;j++){
            if(res.data.list_tag[j].flag == 1){
              that.arr_tag.push(res.data.list_tag[j].id)
            }
          }
        })
      },
      getCheckedNodes(eafOnly){
        this.province = eafOnly[0]
        this.city = eafOnly[1]
      },
     
      //上传头像
      handleAvatarSuccess(res, file) {
        this.imageUrl = res.url;     
        this.$message({
          message: '上传成功',
          type: 'success'
        });
      },
      beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 10;
        if(file.type != 'image/jpeg'&&file.type != 'image/png'&&file.type != 'image/bmp') {
          this.$message.error('上传头像图片只能是 JPG,JPEG,PNG,BMP 格式!');
          return
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 10MB!');
          return
        }
      },
      // 上传企业项目图片
       beforeAvatarUploads(file) {
        const isLt2M = file.size / 1024 / 1024 < 10;
        if(file.type != 'image/jpeg'&&file.type != 'image/png'&&file.type != 'image/bmp') {
          this.$message.error('上传头像图片只能是 JPG,JPEG,PNG,BMP 格式!');
          return false;
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 10MB!');
          return false;
        }
      },
      handleAvatarSuccesss(res, file){

        this.project[this.projectid].imgi = res.url
        this.$message({
          message: '上传成功',
          type: 'success'
        });
      },
      clickfun(ind){
        this.projectid = ind
      },
      //添加项目
      addproject(){
        this.project.push({namepro:'',stopdate:'',imgi:''})
      },
      deleteitem(ind){ //删除项目
        console.log(ind)
        this.project.splice(ind,1,)
      },
      handleRemove(file,fileList) { //删除荣誉图
      console.log(file.url)
        if(file.url.indexOf('blob:') == 0){
          let j = this.imageslist.indexOf({img_cover:file.response.url})
          // console.log(j)
          this.imageslist.splice(j,1,)
        }
        else{
        let i = this.imageslist.indexOf({img_cover:file.url})
        this.imageslist.splice(i,1,)
        }
      },
      success(response, file, fileList){
  
       this.imageslist.push({img_cover:response.url})
      },
      handleChange(file){
        const isLt2M = file.size / 1024 / 1024 < 10;
        if(file.type != 'image/jpeg'&&file.type != 'image/png'&&file.type != 'image/bmp') {
          this.$message.error('上传头像图片只能是 JPG,JPEG,PNG,BMP 格式!');
          return false;
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 10MB!');
          return false;
        }
      },
      edit(id){ // 编辑选择
        switch (id) {
            case 1 :
                this.title = '企业信息'
                this.editid = id
                break
            case 2 :
                this.title = '企业详情'
                this.editid = id
                break
            case 3 :
                this.title = ''
                this.editid = id
                break
            case 4 :
                this.title = ''
                this.editid = id
                break
        }
        this.dialogVisible = true
      },
      comparytype(item){ // 企业类型选择
        let that = this
        if( item.flag == 0){
          item.flag = 1
          that.arr_type.push(item.id)
        }else{
          if(that.arr_type.indexOf(item.id) >= 0){
            that.arr_type.splice(that.arr_type.indexOf(item.id),1,)
            item.flag = 0
          }
        }  
      },
      serviceScope(item){ //经营范围
        let that = this
        if( item.flag == 0){
          item.flag = 1
          that.arr_tag.push(item.id)
        }else{
          item.flag = 0
          if(that.arr_tag.indexOf(item.id) >= 0){
            that.arr_tag.splice(that.arr_tag.indexOf(item.id),1,)
          }
        }  
      },
      determine(){ // 修改信息 确定
        let that = this
          switch (that.editid) {
              case 1 :
                that.axios.post('/MobileJson/CompanyAdmin/comeditinfo',that.qs.stringify({
                  thumb:that.imageUrl,
                  province:that.province,
                  city:that.city,
                  uid:that.user.id
                }))
                .then(res =>{
                  if(res.data.code){  
                    this.$message({
                      message: res.data.data,
                      type: 'success'
                    });
                    that.rendering()
                  }else{
                    this.$message.error(res.data.data); 
                  }
                  
                })
                  break
              case 2 :
                  that.axios.post('/MobileJson/CompanyAdmin/comeditdetail',that.qs.stringify({
                    uid:that.user.id,
                    description:that.company.description
                  }))
                  .then(res =>{
                    if(res.data.code){  
                      this.$message({
                        message: res.data.data,
                        type: 'success'
                      });
                      that.rendering()
                    }else{
                      this.$message.error(res.data.data); 
                    }
                    
                  })
                  break
              case 3 :
                that.axios.post('/MobileJson/CompanyAdmin/comedittype',that.qs.stringify({
                  arr_tag:that.arr_tag,
                  arr_type:that.arr_type,
                  uid:that.user.id
                }))
                .then(res => {
                  if(res.data.code){  
                    this.$message({
                      message: res.data.data,
                      type: 'success'
                    });

                    that.rendering()
                  }else{
                    this.$message.error(res.data.data); 
                  }
                })
                  break
              case 4 :
              that.axios.post('/MobileJson/CompanyAdmin/comeditpro',that.qs.stringify({
                uid:that.user.id,
                com_pro:that.project,
                img_buf:that.imageslist
              }))
              .then( res => {
                if(res.data.code){  
                    this.$message({
                      message: res.data.data,
                      type: 'success'
                    });

                    that.rendering()
                  }else{
                    this.$message.error(res.data.data); 
                  }
              })

                  break
          }
          that.dialogVisible = false
      },
      gosystem(){
        this.$router.push({
          path:'/system'
        })
      },
      uploadEditorSuccess(res) {
  
              //拼接出上传的图片在服务器的完整地址
              let imgUrl = this.qiniuForm.domain+ res.key;
  
              //重置上传文件key，为下次上传做好准备
              this.qiniuForm.key =  new Date().getTime()+""+Math.floor(Math.random()*1000);
  
              // 获取富文本组件实例
              let quill = this.$refs.customQuillEditor.quill;
  
            // 获取光标所在位置
              let length = quill.getSelection().index;
  
              // 插入图片  res.info为服务器返回的图片地址
              quill.insertEmbed(length, 'image', imgUrl)
  
              // 调整光标到最后
              quill.setSelection(length + 1)
  
              //取消上传动画
              this.quillUpdateImg = false;
  
      },
            // 上传图片失败
      uploadEditorError(res) {
          console.log(res);
          //页面提示
          Notification.error({
                  message: '上传图片失败'
          });

          //取消上传动画
          this.quillUpdateImg = false;
      },
      beforeEditorUpload(){
      //显示上传动画
       this.quillUpdateImg = true;
      },
  },
  components: {
        quillEditor
  }
}
</script>
<style lang="less" scoped>
.company{
  padding: 30px 20px 0px 30px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  display: flex;
  text-align: left;
  line-height:100%;
  justify-content:space-between;
  // 页面显示
  .company-left{
      width: 65%;
      padding:0 47px;
      padding-bottom: 20px;
      background: #ffffff;
      box-sizing: border-box;
      overflow: auto;
      //  统一title
      .title{
        display: flex;
        justify-content:space-between;
        margin:35px 0; 
        span:first-child{
          color: #30323F;
          font-size: 24px;
          line-height: 24px;
        }
        span:last-child{
          background: url('../../assets/xiugai.png')no-repeat left;
          background-size: 12px;
          font-size: 16px;
          color: #4093FE;
          padding-left: 16px;
          line-height: 24px;
          cursor:pointer;
        }
      }
      //企业信息
      .company-left-one{
        padding-bottom: 49px;
        border-bottom:1px solid rgba(236,239,242,1);
        .contant{
          display: flex;
          div{
            margin-left: 20px;
            h4{
              width: 400px;
              font-size: 24px;
              font-weight: 400;
              color: #30323F;
              line-height: 30px;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              word-break: break-all;
            }
            p{
              color: #999999;
              font-size: 16px;
              line-height: 16px;
              span{
                color:#30323F;
              }
            }
            p:nth-child(2){
              margin: 18px 0;
            }
          }
        }
      }
      //企业详情
      .company-left-two{
        padding-bottom: 49px;
        border-bottom:1px solid rgba(236,239,242,1);
        p{
          width: 100%;
          font-size: 18px;
          line-height: 36px;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          line-clamp: 3;
          -webkit-box-orient: vertical;
        }
        .content{
          width:100%;
          line-height: 25px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
        }
      }
      //企业类型
      .company-left-three{
        padding-bottom: 49px;
        border-bottom:1px solid rgba(236,239,242,1);
        .contant{
          display: flex;
          flex-wrap:wrap;
          div{
            width:115px;
            height:34px;
            line-height: 34px;
            text-align: center;
            font-size:16px;
            color: #629EF4;
            border:1px solid rgba(98, 158, 244, 1);
            border-radius:17px;
            margin: 10px 8px;
          }
        }
      }
      //经营范围
      .company-left-four{
        padding-bottom: 49px;
        border-bottom:1px solid rgba(236,239,242,1);
        .contant{
          display: flex;
          flex-wrap:wrap;
          div{
            width: 181px;
            height:34px;
            line-height: 34px;
            text-align: center;
            font-size:16px;
            color: #629EF4;
            border:1px solid rgba(98, 158, 244, 1);
            border-radius:17px;
            margin: 10px 10px;
          }
        }
      }
      //企业项目
      .company-left-five{
        border-bottom:1px solid rgba(236,239,242,1);
        .project{
          padding-bottom: 49px;
          border-bottom: 1px solid rgba(236,239,242,1);
          .name{
            p{
              font-size: 16px;
              line-height: 52px;
              color: #666666;
            }
            p:last-child{
              color: #666666;
              height:52px;
              padding-left: 16px;
              background:rgba(0,118,255,0.2);
            }
          }
          .time{
            p{
              font-size: 16px;
              line-height: 52px;
              color: #666666;
            }
            p:last-child{
              color: #666666;
              height:52px;
              padding-left: 16px;
              background:rgba(0,118,255,0.2);
              span{
                background: url('../../assets/riqi.png')no-repeat left;
                padding-left: 29px;
              }
            }
          }
          .pics{
            p{
              font-size: 16px;
              line-height: 52px;
              color: #666666;
            }
          }
        }
        .project:last-child{
          border: 0;
        }
      }
  }
    // 右侧
  .company-right{
    width: 33%;
    img{
      width: 30%;
      height: 30%;
    }
    .company-right-one{
      padding: 10% 0px;
      padding-left: 10%;
      width: 90%;
      background: #ffffff;
      display: flex;
      img{
        margin-right:10%;
      }
      p{
        font-size:23px;
        line-height: 23px;
        color: #999999;
        cursor:pointer;
      }
      p:nth-child(2){
        font-size: 38px;
        line-height: 38px;
        color: #30323F;
        font-weight: bold;
        margin: 18px 0;
        span{
          color: #629EF4;
        }
      }
    }
    .company-right-two{
      padding:  10% 0px;
      padding-left: 10%;
      width: 90%;
      background: #ffffff;
      margin:20px 0; 
      display: flex;
      img{
        margin-right: 10%;
      }
      p{
        font-size:23px;
        line-height: 23px;
        color: #999999;
        cursor:pointer;
      }
      p:nth-child(2){
        font-size: 38px;
        line-height: 28px;
        color: #30323F;
        font-weight: bold;
        margin: 18px 0;
        span{
          color: #629EF4;
        }
      }
    }
    .company-right-three{
      padding:  10% 0px;
      display: flex;
      background: #ffffff;
      padding-left: 10%;
      width: 90%;
      img{
        margin-right: 10%;
      }
      p{
        font-size:23px;
        line-height: 23px;
        color: #999999;
        cursor:pointer;
      }
      p:nth-child(2){
        font-size: 38px;
        line-height: 28px;
        color: #30323F;
        font-weight: bold;
        margin: 18px 0;
        span{
          color: #629EF4;
        }
      }
    }
  }
  //修改信息
  .alert{
    //修改企业logo
    .one{
      .top{
        display: flex;
        span:first-child{
          line-height: 94px;
          font-size: 18px;
          color: #333333;
          margin-right: 16px;
        }
        span:last-child{
          margin:24px 0; 
          line-height: 23px;
          margin-left: 20px;
        }
      }
      .bottom{
        margin-top: 26px;
        display: flex;
        font-size: 18px;
        color: #333333;
        display: flex;
        .one-bottom-right{
          margin-left: 20px;
        }
        div{
          display: flex;
          justify-content:space-between;
          span{
            width:100px;
            line-height:40px;
          }
          input{
            width:300px;
            padding-left:15px;
            height: 40px;
            line-height:40px;
            border:1px solid #DCDFE6;
            box-sizing: border-box;
            border-radius:4px;
          }
        }
      }
      .avatar-uploader .el-upload {
        cursor: pointer;
        position: relative;
        border-radius:50%;
        overflow: hidden;
      }
      .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        background:rgba(245,247,250,1);
        width: 94px;
        height: 94px;
        line-height: 94px;
        text-align: center;
        border-radius:50%;
        overflow: hidden;
      }
      .avatar {
        width: 94px;
        height: 94px;
        border-radius:50%;
        display: block;
      }
    }
    //修改企业类型
    .three{
      .top{
        margin-bottom:50px; 
        .title{
          color: #30323F;
          font-size: 24px;
          line-height: 24px;
        }
        .content{
          margin-top: 35px;
          display: flex;
          flex-wrap:wrap;
          div{
            height: 40px;
            width: 170px;
            font-size: 18px;
            border: #F2F2F2 1px solid;
            text-align: center;
            line-height: 40px;
            border-radius: 20px;
            margin-right: 30px;
            box-sizing: border-box;
            cursor:pointer;
            margin-bottom: 20px;
          }
          .selected{
            background: #629EF4;
            border: #629EF4;
            color: #ffffff;
          }
        }
        
      }
      .bottom{
        .title{
          color: #30323F;
          font-size: 24px;
          line-height: 24px;
        }
        .content{
          margin-top: 35px;
          display: flex;
          flex-wrap:wrap;
          div{
            height: 40px;
            width: 170px;
            font-size: 18px;
            border: #F2F2F2 1px solid;
            text-align: center;
            line-height: 40px;
            border-radius: 20px;
            margin-right: 30px;
            box-sizing: border-box;
            cursor:pointer;
            margin-bottom: 20px;            
          }
          .selected{
            background: #629EF4;
            border: #629EF4;
            color: #ffffff;
          }
        }
      }
    }
    .four{
      .title{
        color: #30323F;
        font-size: 24px;
        line-height: 24px;
        span{
          color:#999999;
          font-size: 14px;
        }
      }
      .project{
        margin: 20px 0;
        width: 100%;
        display: flex;
        justify-content:flex-start;
        .project-only{
          width: 32%;
          border: 1px solid #DDDDDD;
          padding: 12px;
          p{
            display: flex;
            justify-content:space-between;
            font-size: 16px;
            input{
              width:100%;
              border: 1px solid #DCDFE6;
              box-sizing: border-box;
              color: #606266;
              border-radius: 4px;              
              height: 40px;
              line-height: 40px;
              outline: 0;
              padding: 0 15px;
            }
            // 添加图片css
            .avatar-uploader .el-upload {
              border: 1px dashed #E5E5E5;
              border-radius: 6px;
              cursor: pointer;
              position: relative;
              overflow: hidden;
            }
            .avatar-uploader .el-upload:hover {   
              border-color: #409EFF;
            }
            .avatar-uploader-icon {
              font-size: 28px;
              color: #8c939d;
              width: 178px;
              height: 178px;
              line-height: 178px;
              text-align: center;
              border: 1px dashed #E5E5E5;
            }
            .avatar {
              width: 178px;
              height: 178px;
              display: block;
            }


          }
          p:nth-child(1),p:nth-child(3),p:nth-child(5){
            line-height: 40px;
          }
        }
        .project-only:nth-child(2){
          margin: 0 2%;
        }
        .add-project{
          margin-left: 20px;
          button{
            cursor:pointer;
            outline:none;
            width:132px;
            height:46px;
            background: #ffffff;
            line-height: 46px;
            border:1px solid rgba(34,144,255,1);
            border-radius:6px;
            color: #248EF9;
            font-size: 18px;
            text-align: center;
          }
        }
      }
      .Honor{
        margin: 20px 0;
        padding: 20px ;
        border: 1px solid #DDDDDD;
      }
    }
  }
}


// 上传头像 
</style>