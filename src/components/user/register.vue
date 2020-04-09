<template>
  <el-dialog :visible.sync="dialogVisible" :before-close="handleClose" width="500px" v-loading="loadingVisible" @open="handleDialogOpen()">
    <div slot="title" class="dialog-header"><h3>注册用户</h3></div>
    <el-form :model="userModel" :rules="formRules" class="el-dialog-form"
      ref="userForm" label-width="80px" label-position="right" size="small">
      <el-form-item label="用户名" prop="name">
        <el-col :span="16"><el-input ref="username" :maxlength="16" v-model="userModel.name"></el-input></el-col>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-col :span="16"><el-input type="password" :maxlength="16" v-model="userModel.password" auto-complete="off"></el-input></el-col>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPassword">
        <el-col :span="16"><el-input type="password" :maxlength="16" v-model="userModel.checkPassword" auto-complete="off"></el-input></el-col>
      </el-form-item>
      <!-- <el-form-item label="验证码" prop="verificationCode">
        <el-col :span="16">
          <el-input class="vc-input" v-model="userModel.verificationCode" placeholder="请输入验证码"></el-input>
          <div class="vc" @click="getVerificationCode()">{{ this.verificationCode }}</div>
        </el-col>
      </el-form-item>  -->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="closeDialog()">取 消</el-button>
      <el-button type="primary" size="small" @click="doRegister()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
// import { getVerificationCode } from '@/api/auth'
import { registerUser } from '@/api/user'
import { outputError } from '@/utils/exception'

export default {
  name: "register-user",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.userModel.checkPassword !== '') {
          this.$refs.userForm.validateField('checkPassword')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.userModel.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    var validateVerificationCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'))
      } else if (value !== this.verificationCode) {
        callback(new Error('验证码不正确!'))
      } else {
        callback()
      }
    }    
    return {
      loadingVisible: false,
      dialogVisible: false,
      userModel: {
        name: '',
        password: '',
        checkPassword: '',
        verificationCode: ''
      },
      verificationCode: '',
      // 格式校验规则
      formRules: {
        name: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 32, message: '长度在 3 到 16 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPassword: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        verificationCode: [
          { validator: validateVerificationCode, trigger: 'blur' }
        ]      
      }      
    }
  },
  methods: {
    // 处理注册框打开逻辑
    // 由于Vue是异步执行dom更新，使用nextTick回调，进行更新后的dom操作
    handleDialogOpen() {
      // this.getVerificationCode()
      this.$nextTick(() => {
        this.$refs['username'].focus()
      })
    },
    // 执行注册逻辑
    doRegister() {
      this.$refs['userForm'].validate((valid) => {
        if (valid) {
          this.loadingVisible = true
          registerUser(this.userModel.name,this.userModel.password)
          .then(response => {
            this.loadingVisible = false
            let responseCode = response.data.code
            // 处理错误逻辑
            if(responseCode===-100){
              this.$message({
                showClose: true,
                message: '注册失败,用户名已经被注册',
                type: 'error'
              })
              return
            }else if(responseCode!=0){
              this.$message({
                showClose: true,
                message: '服务异常',
                type: 'error'
              })
              return
            }

            // 注册成功
            this.dialogVisible = false
            this.$emit('onRegisterSuccessed',// 注册成功 register子组件使用$emit向父组件触发事件
              this.userModel.name,
              this.userModel.password
            )       
          })
          .catch(error => {
            this.loadingVisible = false
            outputError(this, error)        
          })          
        } else {
          return false
        }
      })
    },
    // 获取验证码
    getVerificationCode() {
      this.loadingVisible = true
      getVerificationCode()
      .then(response => {
        this.verificationCode = response.data
        this.loadingVisible = false
      })
      .catch(error => {
        this.loadingVisible = false
        outputError(this, error)        
      })
    },
    // 关闭对话框
    closeDialog(){
      this.dialogVisible = false
      this.userModel.name = ''
      this.userModel.password = ''
      this.userModel.checkPassword = ''
      this.userModel.verificationCode = ''
    },
    handleClose(done) {
      this.closeDialog()
      done()
    }
  },
  // 显示注册框
  mounted: function() {
    this.$nextTick(() => {
      this.$on('openDialog', function(action) {
        this.dialogVisible = true
      })
    })
  }
}
</script>

<style lang="scss" scoped>
.vc-input {
  float: left;
  width: 190px;
}
.vc {
  width: 70px;
  height: 30px;
  line-height: 30px;
  float: right;
  border: solid 1px #CECECE;
  background-color: #F0F0F0;
  text-align: center;
  color: #007ACC;
}
.vc:hover {
  cursor: pointer;
}
</style>

