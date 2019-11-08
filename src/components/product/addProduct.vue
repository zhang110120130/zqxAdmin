<template>
    <div class="addProduct">
        <div class="main">
            <el-form ref="form" :label-position="'top'" :model="form" label-width="80px">
                <div class="info">
                    <el-form-item label="产品备案号" prop="recordnum" :rules="[{ validator: validatePass, trigger: 'blur' }]">
                        <el-input v-model="form.recordnum"  :disabled = 'list.isrecord == 2||disabled?true:false' ></el-input>
                    </el-form-item>
                    <el-form-item label="产品名称" prop="proname" :rules="[{ required: true, message: '请输入产品名称', trigger: 'blur' }]" >
                        <el-input v-model="form.proname"  :disabled = 'list.irecord == 2||disabled?true:false' ></el-input>
                    </el-form-item>
                    <el-form-item label="规格" prop="specname" :rules="[{ required: true, message: '请输入产品规格', trigger: 'blur' }]">
                        <el-input v-model="form.specname" :disabled = 'list.isrecord == 2||disabled?true:false'></el-input>
                    </el-form-item>
                    <el-form-item label="类别" prop="arrcate" :rules="[{ required: true, message: '请输入产品类别', trigger: 'blur' }]">
                        <el-select v-model="form.arrcate" multiple placeholder="请选择">
                            <el-option
                                v-for="item in procatelist"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <el-form-item class="productImg" label="产品图片" prop="thumb" :rules="[{ required: true, message: '请输入产品图片', trigger: 'blur' }]">
                    <el-upload
                        action="http://article.5i71.org/Communal/upload/upload_file"
                        list-type="picture-card"
                        :limit = 3
                        :file-list = 'form.thumb'
                        :on-success="handlePictureCardPreview"
                        :on-remove="handleRemove">
                        <i class="el-icon-plus" v-show="imgmore"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="产品详情" prop="content" :rules="[{ required: true, message: '请输入产品详情', trigger: 'blur' }]">
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
                            <quill-editor  class="editor"  v-model="form.content" ref="customQuillEditor" :options="editorOption" >
                            </quill-editor>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="Preservation(1)" v-if="datas">{{list.isrecord == 1?'保存':'提交'}}</el-button>
                    <el-button type="primary" @click="onSubmit(1)" v-else>添加</el-button>     
                    <el-button @click="onSubmit(0)" v-if = "list.isrecord == '' && !datas ">草稿</el-button>
                    <el-button @click="Preservation(0)" v-if = "list.isrecord == 0 && datas">保存</el-button>
                    <el-button class="cancel" @click="totop">取消</el-button>
                </el-form-item>
            </el-form>
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
export default {
    name: 'manage',
    data:()=>({
        token: '',
        fullPath:'',
        form: {
            recordnum: '',
            proname:'',
            specname: '',
            thumb:[],
            arrcate:[],
            content: '',
        },
        imageUrl: '',
        procatelist: [],
        filelist: [],
        disabled:false,
        imgmore: true,
        user: null,
        id: null,
        datas:'',
        list:{isrecord:''},
        quillUpdateImg:false,
        editorOption:{
                placeholder:'请填写产品详情信息',
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
            'domain': ''
        },
        uploadUrl: 'http://up-z1.qiniup.com'
    }), 
    created() {
        this.user = this.$store.getters.getUser;
        this.getProcatelist();
        let data = this.$route.params;
        
        if(Object.keys(data).length === 0){
            this.datas = false
        }else{
            this.datas = true
            this.list = data.list;
        }
        this.form.arrcate = data.cate;
        let list = data.list;
        this.form.content = list.content;
        this.form.proname = list.name;
        this.form.recordnum = list.recordnum;
        this.form.specname = list.specname;
        this.form.thumb = list.thumb.map((item) =>{
            return {
                name: 'img.png',
                url: item.img_cover
            }
        });
        
    },
    watch:{

    },
    beforeRouteEnter(to, from, next) {
        next(vm=>{          //  这里的vm指的就是vue实例，可以用来当做this使用
            // console.log(to)
            vm.fullPath = from.fullPath
            console.log(vm.fullPath)
        })
    },
    methods: {
        validatePass(rule, value, callback){
            let that = this;
            that.axios.post('/MobileJson/CompanyAdmin/checkrecordnum', that.qs.stringify({
                uid: that.user.id,
                recordnum: value,
            }))
            .then(function (response) {
                that.disabled = response.data.code
                if(response.data.code){
                    that.form.proname = response.data.data.productname;
                    that.form.specname = response.data.data.recordnum;
                    callback();
                }else{
                    callback();
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        },
        onSubmit(isrecord){
            let that = this;
            this.$refs.form.validate((valid) => {
                if (valid) {
               
                    that.form.uid = that.user.id;
                    that.form.isrecord = isrecord;
                    that.form.thumb = that.form.thumb.map((item) => {
                        return {
                            img_cover: item.url
                        }
                    });
                    that.axios.post('/MobileJson/CompanyAdmin/addproduct', that.qs.stringify(that.form))
                    .then(function (response) {
                        if(response.data.code){
                            that.$refs.form.resetFields();
                            that.form = {
                                recordnum: '',
                                proname:'',
                                specname: '',
                                thumb:[],
                                arrcate:[],
                                content:'',
                            };
                            that.$message({
                                type: 'success',
                                message: '添加成功!'
                            });
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        Preservation(isrecord){

            let that = this;

            this.$refs.form.validate((valid) => {
                if (valid) {
                    that.form.proid = that.list.id;
                    that.form.cid = that.list.cid;
                    that.form.uid = that.user.id;
                    that.form.isrecord = isrecord;
                    that.form.thumb = that.form.thumb.map((item) => {
                        return {
                            img_cover: item.url
                        }
                    });
                    that.axios.post('/MobileJson/CompanyAdmin/draftsedit', that.qs.stringify(that.form))
                    .then(function (response) {
                        if(response.data.code){
                            that.$refs.form.resetFields();
                            that.form = {
                                recordnum: '',
                                proname:'',
                                specname: '',
                                thumb:[],
                                arrcate:[],
                                content:'',
                            };
                            that.$message({
                                type: 'success',
                                message: '保存成功!'
                            });
                            that.totop()
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        totop(){
            this.$router.push({
                path:this.fullPath
            })
        },
        handleRemove(file, fileList){
            this.form.thumb = [];
            fileList.forEach((item, index) => {
                let img_cover = {
                    name: 'img.png',
                    url: item.url
                };
                this.form.thumb.push(img_cover);
            });
        },
        handlePictureCardPreview(response, file, fileList){
            console.log(fileList);
            let index = this.form.thumb.length;
            let img_cover = {
                name: 'img.png',
                url: response.url
            };
            this.form.thumb.push(img_cover);
        },
        getProcatelist(){
            let that = this;
            that.axios.post('/MobileJson/CompanyAdmin/procatelist', that.qs.stringify({
                uid: that.user.id,
            }))
            .then(function (response) {
                that.procatelist = response.data.data;
            })
            .catch(function (error) {
                console.log(error);
            });
        },
        handleAvatarSuccess() {

        },
        beforeAvatarUpload() {

        },

        //上传图片之前
        beforeEditorUpload(){
            //显示上传动画
            this.quillUpdateImg = true;
        },
 
        // 上传图片成功
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
        
    },
    mounted () {
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
    components: {
        quillEditor
    }
}
</script>

<style lang="less" scoped>
.el-select{
    width: 600px;
}
.addProduct{
    position: relative;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 35px 30px 30px 30px;
    background: #F5F7FAFF;
}
.main{
    width: 100%;
    height: 100%;
    background: #FFF;
    box-sizing: border-box;
    padding: 30px 41px;
    overflow: auto;
}
.main::-webkit-scrollbar {
    display: none;
}
.info{
    display: flex;
    flex-wrap: wrap;
}
.cancel{
    color: #666666;
    background: none;
}
.el-button{
    width: 143px;
    height: 64px;
}
.el-input{
    width: 365px;
}
.el-form-item{
    margin-right: 100px;
    text-align: left;
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
}
.avatar-uploader {
    width: 178px;
    height: 178px;
    margin-right: 30px;
    display: inline-block;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.editor{
    min-height: 200px;
    margin-bottom: 120px;
    height: 600px;
}
.avatar-uploader{
    display: none;
}
</style>