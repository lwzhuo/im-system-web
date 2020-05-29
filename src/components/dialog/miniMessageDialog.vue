<template>
  <div class="container" v-loading="loadingVisible">
    <div class="header">
      <div class="title-container">
        <span>
          <div class="title">
            <strong>用户 {{shareUserName}} 分享群组「{{ userChannel.channelName }}」 的聊天记录</strong>
            <br>
            <span>聊天记录关键词: {{keyword}}</span>
          </div>
        </span>        
      </div>
    </div>
    <div class="body-container" v-if="$store.getters.imClient">
      <div class="body">
        <message-list v-if="loadMessageList" ref="messageList" :channel-id="channelId" :user-channel="userChannel" :member-info="memberInfo" :useShareMsg="true" :shareMsg="shareMsg"></message-list>
      </div>
    </div>
  </div>
</template>

<script>
import { outputError } from '@/utils/exception'
import { getUserChannel, isAdmin, leaveChannel, removeChannel } from '@/api/channel'
import { getShareMessage } from '@/api/message'
import StatusOnlineIcon from '@/components/svg/statusOnlineIcon'
import StatusOfflineIcon from '@/components/svg/statusOfflineIcon'
import StatusAwayIcon from '@/components/svg/statusAwayIcon'
import MessageList from '../message/messageList'
import SendMessage from '../message/sendMessage'

export default {
  data() {
    return {
      loadMessageList:false,
      loadingVisible: false,
      memberCount:0,
      userChannel: {},  // 维护channel的信息
      memberInfo:{},    // 维护channel的用户列表 使用uid作为key进行访问
      sentMessage: null,
      isAdmin: false,
      shareMsg: {},
      shareUserName:"",
      keyword:"",
      channelId:'',
      channelType:'',
      myId: JSON.parse(localStorage.getItem('currentUser')).id,
      myName: JSON.parse(localStorage.getItem('currentUser')).username
    }
  },
  methods: {
    showSentMessage(message) {
      this.$refs.messageList.showSentMessage(message)
    },
    // 初始化页面
    initPage() {
      this.loadMessageList = false
      if(this.$route.params.shareId=== undefined) {
        return
      }
      // 拉取分享的消息
      getShareMessage(this.$route.params.shareId)
      .then(response=>{
        if(response.data.code<0){
          outputError(this, "服务异常")
        }
        let responseData = response.data.data
        for(let i=0;i<responseData.messages.length;i++){
          let msgType = responseData.messages[i].msgType;
          if(msgType==3||msgType==4){
            responseData.messages[i].msg = JSON.parse(responseData.messages[i].msg)
          }
        }
        this.shareMsg = responseData.messages
        this.channelId = responseData.channelId
        this.shareUserName = responseData.shareUserName
        this.keyword = responseData.keyword.split(";").join(" ")
        this.loadingVisible = true
        this.$store.dispatch('setCurrentChannelId', this.channelId)
        this.initIMClient()
        getUserChannel(this.myId, this.channelId) // 获取当前channel信息
        .then(response => {   
          if(response.data.code<0){
            outputError(this, "服务异常")
          }
          this.userChannel = response.data.data
          // 群聊逻辑处理
          if (this.userChannel.channelType === 2) {
            isAdmin(this.channelId)
            .then(response => {
              this.isAdmin = response.data.data
              this.loadingVisible = false
            })
            .catch(error => {
              this.loadingVisible = false
              outputError(this, error)
            })          
          } 
          for(let i=0;i<this.userChannel.channelUserList.length;i++){
            let item = this.userChannel.channelUserList[i]
            let uid = item.uid;
            if(item.status==1)
              this.memberCount++
            this.memberInfo[uid] = {
              uid:uid,
              username:item.userName,
              avatarUrl:item.avatarUrl,
              joinTime:item.joinTime,
              leftTime:item.leftTime,
              userType:item.userType,
              status:item.status
            }
          }
          this.loadingVisible = false
          this.loadMessageList = true
        })
        .catch(error => {
          this.loadingVisible = false
          outputError(this, error)
        })
      }).catch(error => {
        this.loadingVisible = false
        outputError(this, error)
      })  
    },
    onMembersCountChanged(message) {
      if(this.$route.params.channelId === message.channelId) {
        this.userChannel.memberCount += message.count
      }
    },
    initIMClient() {
      let st = setTimeout(() =>  {
        let imClient = this.$store.getters.imClient // 从vuex中获取已经初始化好的client
        if(imClient != null) {
          imClient.bindMembersCountChanged(this.onMembersCountChanged)
          clearTimeout(st)
        }
      }, 500)
    },
    handleCommand(command) {
      switch(command) {
        case 'addMember':
          this.$refs.addChannelMemberDlg.$emit('openDialog', this.userChannel)    
          break;        
        case 'editTitle':
          this.$refs.editChannelTitleDlg.$emit('openDialog', this.userChannel)          
          break;
        case 'editName':
          this.$refs.editChannelNameDlg.$emit('openDialog', this.userChannel)          
          break;
        case 'manageMember':
          this.$refs.memberManagementDlg.$emit('openDialog', this.userChannel)          
          break
        case 'leave':
          this.doLeaveChannel(this.userChannel)
          break
        case 'remove':
          this.doRemoveChannel(this.userChannel.channelId)
          break
      }
    },
  },
  created() {
    this.initPage() // 初始化页面
  },
  watch: {
    '$route': 'initPage' // $route发生变化时，加载页面
  },
  components: { StatusOnlineIcon, StatusOfflineIcon, StatusAwayIcon, MessageList, SendMessage,
    EditChannelTitle: resolve => require(['@/components/userChannel/editChannelTitle'], resolve),
    EditChannelName: resolve => require(['@/components/channel/editChannelName'], resolve),
    AddMember: resolve => require(['@/components/channel/addMember'], resolve),
    MemberList: resolve => require(['@/components/channel/memberList'], resolve),
    MemberManagement: resolve => require(['@/components/channel/manageMember'], resolve),
    ShareList: resolve => require(['@/components/channel/shareList'],resolve),
    ShareSubmit: resolve => require(['@/components/channel/shareSubmit'],resolve),
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: -webkit-flex;
  display: flex;
  -webkit-flex-direction: column;
  flex-direction: column;
  background: #fff;
  height: 100%;
  width: 100%;
  position: relative;

  .header {
    -webkit-flex: 0 0 69px;
    flex: 0 0 69px;
    border-bottom: 1px solid;
    font-size: 14px;
    position: relative;
    width: 100%;
    z-index: 9;
    border-bottom: solid 1px #DBD9D6;

    .title-container {
      min-width: 0px;
      flex: 1 1 0%;
      margin-top: 14px;
      padding-left: 8px;
      vertical-align: middle;
      span {
        background: transparent;
        border: none;
        padding: 0;
        text-align: left;
        cursor: pointer;
      }
      .title {
        font-size: 17px;
        flex: 1;
        min-width: 0;
        padding: 0 0 0 10px;
        float: left;
        strong {
          font-size: 17px;
        }
        svg {
          margin: 0 0 0 3px;
          width: 13px;
          height: 13px;
        }
        #dropdown-icon-selected {
          display: none;
        }
        .channel-title:hover {
          color: #418FD6;
          #dropdown-icon {
            display: none;
          }
          #dropdown-icon-selected {
            display: inline;
          }
        }
      }
      .display-name {
        margin-top: 3px;
        font-size: 14px;
      }
      .members-container {
        float: right;
        padding: 0 50px 0 0;
        .members {
          border-radius: 20px;
          margin-top: 5px;
          padding: 6px 23px;
          border: 1px solid #dcdfe6;
          vertical-align: middle;
          div {
            float: left;
            margin-right: 6px;
            font-weight: bold;
            color: #B7B3AD;
          }
          svg {
            width: 16px;
            height: 16px;
            margin-top: 1px;
            fill: #B7B3AD;
          }
        }
        .members:hover {
          cursor: pointer;
          border: 1px solid #319EDD;
          div {
            color: #319EDD;
          }
          svg {
            fill: rgb(35, 137, 215);
          }
        }        
      }
    }     
  }

  .body-container {
    -webkit-flex: 1 1 auto;
    flex: 1 1 auto;
    height: 100%;
    width: 100%;
    overflow: hidden;
    position: relative;
    .body {
      -webkit-overflow-scrolling: touch;
      height: 100%;
      width: 100%;
      overflow-y: hidden;
      overflow-x: hidden;
      position: absolute;   
    }
  }

  .footer {
    -webkit-flex: 0 0 auto;
    flex: 0 0 auto;
    height: 18%;
    width: 100%;
    z-index: 5;
    .ul{
      list-style:none;
      margin: 0px;
      padding: 0px;
      height: 100%;
      .sharesubmit{
        height: 20%;
      }
      .sendmessage{
        height: 80%;
      }
    }
  }
}
</style>

