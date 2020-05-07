<template>
  <div class="join-page-container">
    <div class="join-container">
      <el-form label-position="left">
        <div class="join-header">
          <div class="join-title-container"><strong class="join-title">群组邀请</strong></div>
        </div>
        <div class="join-content">
          <div class="channel-info">
            <span class="channel-info-key">群组名称:</span>
            <span class="channel-info-value">{{channelInfo.channelName}}</span>
          </div>
          <div class="channel-info">
            <span class="channel-info-key">群组简介:</span>
            <span class="channel-info-value">{{channelInfo.channelSummary}}</span>
          </div>
          <el-button class="join-button" type="primary" :loading="loadingVisible" @click.native.prevent="doJoinChannel()">加入</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { outputError } from '@/utils/exception'
import {getUserChannel,joinChannel} from '@/api/channel'
export default {
  data() {
    return {
      loadingVisible: false,
      myId: JSON.parse(localStorage.getItem('currentUser')).id,
      channelInfo:{
        channelName:'',
        channelSummary:''
      }
    }
  },
  methods: {
    doJoinChannel(){
      joinChannel(this.myId,this.$route.params.channelId)
      .then(response=>{
        if(response.data.code<0){
          outputError(this, "服务异常")
        }else{
          //执行跳转
          let responseData = response.data.data
          let channelId = responseData.channelId
          let channelType = responseData.channelType
          this.$router.push({ 
            name: 'messageDialog', 
            params: { 
              channelType: channelType,
              channelId: channelId, 
            }
          })
        }
      })
    }
  },
  created(){
    getUserChannel(this.myId,this.$route.params.channelId)
    .then(response=>{
      if(response.data.code<0){
        outputError(this, "服务异常")
      }
      let responseData = response.data.data;
      this.channelInfo.channelName = responseData.channelName
      this.channelInfo.channelSummary = responseData.summary
    })
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.join-page-container {
  padding: 80px 0px 0px 0px;
}

.join-container {
  width: 390px;
  margin: 0px auto;
  padding: 0px;
  background-color: #fff;
}

.join-header {
  padding: 0px 0px 10px 0px;
  margin: 0px 0px 15px 0px;
  position: relative;
  z-index: 10;
  -webkit-transition: padding-bottom 0.4s;
  transition: padding-bottom 0.4s;  
  text-align: center;
  .join-title-container {
    padding-top: 30px;
    .join-title {
      color: #1685C1;
      font-size: 25px;
    }    
  }   
}

.join-content {
  padding:10px 40px 20px;
  -webkit-transition: padding-top 0.4s;
  transition: padding-top 0.4s;
  .channel-info {
    border-top: 1px solid #ddd;
    padding: 15px 0px 15px 0px;
    color: #8F8B86;
    font-size: 1.1em;
    .channel-info-value{
      width:200px;
      // 以下三行 解决字符数量过多 产生越界的问题
      word-wrap: break-word;
      word-break: break-all;
      overflow: hidden;
    }
  }
  .join-button {
    width: 100%;
  }
}

.join-footer {
  font-size: 13px;
  padding: 0px 40px 40px;
  text-align: left;
}
</style>


