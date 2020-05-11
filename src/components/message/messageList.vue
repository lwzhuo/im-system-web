<template>
  <div class="container" id="messageList" v-loading="loadingVisible">
    <image-viewer ref="imageViewer" :image-url="image.url" :image-width="image.width" :image-height="image.height"></image-viewer>
    <div v-if="hasMoreMessage" class="load-more-message"><span @click="getMessageList(true)">加载更多消息</span></div>
    <div :id="'message_' + item.messageId" v-for="(item, index) in this.messageList" :key="item.messageId">
      <el-checkbox-group v-model="shareMessageList">
      <div class="message-container">
        <div class="message">
          <el-checkbox v-if="shareMessageCheckbox" :label="item.messageId"></el-checkbox> 
          <div class="status-wrapper" :class="{'sysuser-status-wrapper': item.fromUid === '00000000000000000000000000000000'}">
            <!-- 用户头像显示 -->
            <div v-if="memberInfo[item.fromUid].avatarUrl!=null&&memberInfo[item.fromUid].avatarUrl!==''" style="width: 32px; height:32px;"><img class="status-wrapper-image" :src="getAvatarUrl(item)" /></div>
            <!-- <template v-else>{{ item.senderFirstLetterOfName.toUpperCase() }}</template> -->
            <template v-else style="width: 32px; height:32px;"><img class="status-wrapper-image" src="../../assets/images/avatar.png" /></template>
            <!-- 用户在线状态显示 -->
            <div v-if="item.fromUid != '00000000000000000000000000000000'" class="online-status-container">
              <!-- 状态暂时写死离线 -->
              <!-- <status-offline-avatar></status-offline-avatar> -->
              <!-- <status-online-avatar v-if="item.senderOnlineStatus === 'online'"></status-online-avatar>
              <status-away-avatar v-else-if="item.senderOnlineStatus === 'away'"></status-away-avatar>
              <status-offline-avatar v-else-if="item.senderOnlineStatus === 'offline'"></status-offline-avatar>
              <status-dnd-avatar v-else="item.senderOnlineStatus === 'dnd'"></status-dnd-avatar> -->
            </div>
          </div>
          <div class="message-content" :class="{ 'message-content-myself': myId == item.fromUid }">
            <span class="sender">{{ item.fromUserName ? item.fromUserName :memberInfo[item.fromUid].username }}</span>
            <span class="createAt">{{ getCreateDateTime(item) }}</span>
            <!-- <span v-if="myId == item.fromUid" class="delete-message" @click="removeMessage(item.id, index)">删除</span> -->
            <!-- 处理不同的消息类型 文本 图片 文件 -->
            <div v-if="item.msgType === 1" :class="[{'content-select': myId == item.fromUid, 'content': myId !== item.fromUid}, {'system-content': item.channelType==3}]" v-text="item.msg"></div>
            <template v-else>
              <div v-if="isImage(item.msg.fileExtension)"><img class="image-file" @click="viewImage(getFileUrl(item.msg.filePath, item.msg.newFileName,item.msg.origionFileName, item.msg.fileMimeType), item.imageWidth, item.imageHeight)" :width="item.imageThumbWidth" :height="item.imageThumbHeight" :src="getFileUrl(item.msg.filePath, item.msg.newFileName+'_small',item.msg.origionFileName, item.msg.fileMimeType)"></div>
              <div v-else-if="isGif(item.msg.fileExtension)"><img class="image-file" @click="viewImage(getFileUrl(item.msg.filePath, item.msg.newFileName,item.msg.origionFileName, item.msg.fileMimeType), item.imageWidth, item.imageHeight)" :width="item.imageWidth" :height="item.imageHeight" :src="getFileUrl(item.msg.filePath, item.msg.newFileName+'_small',item.msg.origionFileName, item.msg.fileMimeType)"></div>
              <div v-else class="attach-file">
                <a :href="getFileUrl(item.msg.filePath, item.msg.newFileName,item.msg.origionFileName, item.msg.fileMimeType)" target="_blank">
                  <svg t="1528947448190" viewBox="0 0 1024 1024" version="1.1" width="64" height="64"><path d="M842.72 259.904a159.04 159.04 0 0 0-113.056-46.912h-0.16a158.592 158.592 0 0 0-112.768 46.656l-0.096 0.064-294.528 294.528a95.968 95.968 0 0 0 68.128 163.712c24.512 0 49.024-9.28 67.648-27.968l294.496-294.496a31.968 31.968 0 1 0-45.248-45.248l-294.496 294.496a31.872 31.872 0 0 1-45.088-0.16 31.552 31.552 0 0 1-0.192-45.088l294.496-294.496a95.04 95.04 0 0 1 67.648-28h0.096a95.52 95.52 0 0 1 67.872 28.16c18.112 18.112 28.096 42.24 28.128 67.84a95.136 95.136 0 0 1-27.968 67.776l-79.52 79.52-0.512 0.48-220.416 220.48a160.32 160.32 0 0 1-226.432 0.096A158.912 158.912 0 0 1 224 628.224c0-42.816 16.672-83.04 46.912-113.28l300.288-300.32a31.968 31.968 0 1 0-45.248-45.248l-300.288 300.288A222.848 222.848 0 0 0 160 628.224c0 59.872 23.264 116.16 65.504 158.4a223.168 223.168 0 0 0 158.336 65.44 223.68 223.68 0 0 0 158.592-65.6l311.456-311.424a31.68 31.68 0 0 0 7.104-11.072c18.496-26.56 28.64-57.92 28.608-91.04a159.104 159.104 0 0 0-46.88-113.024" p-id="2313" fill="#616C6A"></path></svg>
                  <div class="attach-desc">
                    <div>{{ item.msg.origionFileName.length > 26 ? item.msg.origionFileName.substr(0, 26) + '...' : item.msg.origionFileName }}</div>
                    <div><i class="el-icon-download"></i>&nbsp;&nbsp;<span>{{ item.msg.fileExtension ? item.msg.fileExtension.toUpperCase() : '' }}</span>&nbsp;&nbsp;<span>{{ parseInt(item.msg.size/1024) }}KB</span></div>
                  </div>
                </a>
              </div>
            </template>
          </div>
          <div class="clear-float"></div>
        </div>
      </div>
      </el-checkbox-group>
    </div>
    <share-submit v-if="shareMessageCheckbox" class="share-submit" @onCloseShareMessageCheckbox="closeShareMessageCheckbox" @onShowShareMsgDialog="showShareMsgDialog" :channelId="channelId" :shareMessageList="shareMessageList"></share-submit>
    <share-msg-dialog ref="shareMsgDlg" :shareData="shareData" :userChannel="userChannel"></share-msg-dialog>
  </div>
</template>

<script>
import { outputError } from '@/utils/exception'
import { listMessage, readMessage, removeMessage } from '@/api/message'
import StatusOnlineAvatar from '@/components/svg/statusOnlineAvatar'
import StatusOfflineAvatar from '@/components/svg/statusOfflineAvatar'
import StatusDndAvatar from '@/components/svg/statusDndAvatar'
import StatusAwayAvatar from '@/components/svg/statusAwayAvatar'

export default {
  name: "message-list",
  props: ['channelId', 'userChannel','memberInfo','shareMessageCheckbox','useShareMsg','shareMsg'],
  data() {
    return {
      myId: JSON.parse(localStorage.getItem('currentUser')).id,
      maxCreateAt: new Date().getTime() ,
      loadingVisible: false,
      messageList: [],//message列表
      shareMessageList:[],// 分享messageid列表
      shareMsgDialog:false,
      shareData:{},
      hasMoreMessage: true,
      isLoadMore: false,
      messageRemoved: false,
      image: {
        url: '',
        width: 0,
        height: 0
      }
    }
  },
  methods: {
    getMessageList(isLoadMore) {
      this.isLoadMore = isLoadMore
      const limit = 20 // 每次加载20条
      this.loadingVisible = true
      listMessage(this.channelId, this.maxCreateAt, limit)
      .then(response => {       
        let responseData = response.data.data 
        this.hasMoreMessage = responseData.length === 20
        for(let i=0;i<responseData.length;i++){
          let msgType = responseData[i].msgType;
          if(msgType==3||msgType==4){
            responseData[i].msg = JSON.parse(responseData[i].msg)
          }
        }
        if(responseData.length > 0) {
          this.messageList = [...responseData.reverse(), ...this.messageList]
          this.maxCreateAt = this.messageList[0].ts
          // readMessage(this.channelId, responseData.length) // 将消息设为已读 todo
          // .then(response => {
          //   this.loadingVisible = false
          // })
          // .catch(error => {
          //   this.loadingVisible = false
          //   outputError(this, error)
          // })      
          this.loadingVisible = false      
        } else {
          this.loadingVisible = false
        }
      })
      .catch(error => {
        this.loadingVisible = false
        outputError(this, error)
      })
    },
    getAvatarUrl(message) {
      // if('http://'.startsWith(message.senderRealAvatarUrl.toLowerCase()) || 'https://'.startsWith(message.senderRealAvatarUrl.toLowerCase())) {
      //   return message.senderRealAvatarUrl
      // }
      let uid = message.fromUid
      return process.env.BASE_API + '/user/avatar/get/' + uid + '/'+ this.memberInfo[uid].avatarUrl
    },
    getCreateDateTime(message) {
      return new Date(message.ts).toLocaleString()
    },  
    showSentMessage(message) {
      this.isLoadMore = false
      if(message.msgType==3||message.msgType==4){
        // 消息类型为图文时 需要单独处理
        message.msg = JSON.parse(message.msg)
        // // 处理后缀名
        // let res = message.data.msg.origionFileName.split(".")
        // if(res.length>1)
        //   message.data.msg.fileExtension = res[1]
        // else
        //   message.data.msg.fileExtension = ""
      }
      this.messageList.push(message)
    },
    removeMessage(messageId, index) {
      this.$confirm('确定删除消息吗？删除后不可恢复！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
         type: 'warning'
      }).then(_ => {
        this.loadingVisible = true
        removeMessage(messageId, this.channelId, this.getToUserId())
        .then(response => {
          if(response.data !== 0) {
            this.messageRemoved = true
            this.messageList.splice(index, 1)
          }
          this.loadingVisible = false
        })
        .catch(error => {
          this.loadingVisible = false
          outputError(this, error)        
        })
      }).catch(_ => {
      })
    },
    getToUserId() {
      if(this.userChannel.channelType === 2) {
        return null
      }
      return this.userChannel.toUserId
    },
    onNewMessage(message) {
      this.isLoadMore = false
      if(this.channelId === message.channelId && this.myId !== message.fromUid) { // 排除自己的消息 (自己的消息在发送时显示)
        if(message.msgType==3||message.msgType==4){
          // 文件类型特殊处理
          message.msg = JSON.parse(message.msg)
        }
        this.messageList.push(message)
      }
    },
    onReconnected() {
      console.log('重连成功！！！')
    },
    onConnectionClosed() {
      console.log('连接被断开')
    },
    onUserOnlineStatusChanged(receiveMessage) {
      for(let message of this.messageList) {
        if(message.fromUid === receiveMessage.userId) {
          message.senderOnlineStatus = receiveMessage.onlineStatus
        }
      }
    },
    onMessageRemoved(receiveMessage) {
      if(this.messageList != null && this.messageList.length > 0) {
        let messageId = receiveMessage.messageId
        let fromUid = receiveMessage.fromUid
        if(fromUid === this.myId) {
          return
        }
        let index = 0
        for(let message of this.messageList) {
          if(message.id === messageId) {
            this.messageList.splice(index, 1)
            return
          }
          index++
        }
      }
    },
    // 初始化页面
    initPage(newVal, oldVal) {
      if(newVal == null || newVal === '') {
        return
      }
      this.maxCreateAt = new Date().getTime()
      this.messageList = []      
      // 直接使用分享的消息
      if(this.useShareMsg){
        this.hasMoreMessage = false
        this.messageList = this.shareMsg
      }else{
        // 正常拉取消息
        this.getMessageList(false)
      }
    },
    isImage(fileExtension) {
      let extension = fileExtension.toLowerCase()
      return extension === 'png' || extension === 'jpeg' || extension === 'jpg'
    },
    isGif(fileExtension) {
      let extension = fileExtension.toLowerCase()
      return extension === 'gif'
    },
    getFileUrl(filePath, fileName, originFileName,mimetype) {
      const fullPath = filePath + '/' + fileName
      return process.env.BASE_API + '/message/file/get/'+this.channelId+'/' + fileName + '?originFileName=' + 
        encodeURIComponent(originFileName) + '&mimetype=' + encodeURIComponent(mimetype)
    },
    viewImage(url, width, height) {
      this.image.url = url
      this.image.width = width
      this.image.height = height
      this.$refs.imageViewer.$emit('openDialog')
    },
    closeShareMessageCheckbox(){
      this.shareMessageList = []
      this.$emit("onCloseShareMessageCheckbox")
    },
    showShareMsgDialog(data){
      this.shareData = data
      this.$refs.shareMsgDlg.$emit('openDialog')
    }
  },
  created() {
    // 直接使用分享的消息
    if(this.useShareMsg){
      this.hasMoreMessage = false
      this.messageList = this.shareMsg
    }else{
      // 正常拉取消息
      this.getMessageList(false)
    }
    let imClient = this.$store.getters.imClient
    imClient.bindNewMessage(this.onNewMessage)
    imClient.bindReconnectSuccessed(this.onReconnected)
    imClient.bindConnectionClosed(this.onConnectionClosed)
    imClient.unbindUserOnlineStatusChanged()
    imClient.bindUserOnlineStatusChanged(this.onUserOnlineStatusChanged)
    imClient.bindMessageRemoved(this.onMessageRemoved)
  },
  watch: {
    channelId: 'initPage',
    messageList: function(newVal, oldVal) {
      this.$nextTick(() => {
        const msgList = document.getElementById('messageList')
        if(!msgList) {
          return
        }
        if(this.messageRemoved) {
          this.messageRemoved = false
          return
        }
        if(this.isLoadMore) {
          const msgContainer = document.getElementById('message_' + oldVal[0].id)
          msgList.scrollTop = msgContainer.offsetTop
          this.isLoadMore = false
        } else {
          msgList.scrollTop = msgList.scrollHeight
        }
      })
    }
  },
  components: { StatusOnlineAvatar, StatusOfflineAvatar, StatusAwayAvatar, StatusDndAvatar,
    ImageViewer: resolve => require(['@/components/message/imageViewer'], resolve),
    ShareSubmit: resolve => require(['@/components/channel/shareSubmit'],resolve),
    ShareMsgDialog: resolve => require(['@/components/channel/ShareMsgDialog'],resolve),
  }
}
</script>

<style lang="scss" scoped>
.container {
  overflow-y: auto;
  overflow-x: hidden;
  div {
    font-size: 15px;
  }
  .load-more-message {
    text-align: center;
    font-size: 14px;
    margin: 6px 0 3px 0;
    span {
      color: #1A6CDE;
      cursor: pointer;
    }
  }
  .message-container {
    max-width: 100%;
    width: 100%;
    word-wrap: break-word;
    .message {
      margin: 0 auto;
      padding: 10px 20px 5px 20px;
      width: 100%;
    }
  }
  .message-container:hover {
    background-color: #F6F5F4;
  }
  .status-wrapper {
    width: 32px; 
    height: 32px;
    line-height: 32px;
    background-color: #DF016E;
    border-radius: 32px;
    text-align: center;
    color: #fff;
    font-weight: bold;
    float: left;
    margin-right: 6px;
    cursor: pointer;
    .status-wrapper-image {
      border-radius: 100%;
      width: 100%;
      height: 100%;
      background-color: #BCB2A6;
    }
    .online-status-container {
      width: 12px;
      height: 12px;
      line-height: 12px;
      margin: -10px 0 0 21px;
    }     
  }
  .sysuser-status-wrapper {
    background-color: #04549C;
  }
  .message-content {
    padding: 0 0 0 35px;
    .sender {
      text-overflow: ellipsis;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
      display: inline-block;   
    }
    .createAt {
      font-size: 12px;
      color: #8F8B86;
      padding: 0 0 0 10px;
      margin-top: -2px;
    }
    .content {
      padding: 6px 26px 6px 3px;
      line-height: 25px;
    }
    .system-content {
      font-size: 14px;
      color: #908C87;      
    }
    .content-select {
      padding: 6px 36px 6px 3px;
      line-height: 25px;
      background-color: #F6F5F4;
    }
    .image-file {
      margin-top: 3px;
      cursor: pointer;      
    }
    .attach-file {
      margin-top: 3px;
      margin-left: 2px;
      width: 280px;
      height: 64px;
      line-height: 64px;
      vertical-align: middle;
      border: solid 1px #DCDAD6;
      svg {
        float: left;
        border-right: solid 1px #DCDAD6;
      }
      .attach-desc {
        padding-left: 5px;
        width: 205px;
        line-height: 32px;
        color: #464548;
        font-size: 23px;
        float:left;
        div {
          font-size: 13px;
        }        
        span {
          font-size: 13px;
          color: #8F8B86;
        }
      }
    }
  }
  .message-content-myself {
    .delete-message {
      color: #1A6CDE;
      cursor: pointer;
      margin-left: 10px;
      font-size: 13px;
      display: none;
    }
  }
  .message-content-myself:hover .delete-message {
    display: inline;
  }
  .clear-float {
    clear: both;
  }
  .share-submit {
    position: sticky;             // 位置停靠
    position: -webkit-sticky;     // 兼容 -webkit 内核的浏览器
    bottom: 0px;                  // 必须设一个值，否则不生效
  }
}
</style>

<style lang="scss">
  .message{
    .el-checkbox__label{
        display: none;
      }
  }
</style>

