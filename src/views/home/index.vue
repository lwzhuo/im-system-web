<template>
  <el-container class="body-container">
    <el-scrollbar style="background-color: #1C5CB9;">
      <div class="sidebar">
        <div class="header">
          <span id="status-dropdown">
            <div class="avatar status-selector">
              <img v-if="realAvatarUrl" :src="realAvatarUrl">
              <!-- <span v-else>{{ userInfo.firstLetterOfName }}</span> 暂时使用默认头像--> 
              <span v-else style="width: 32px; height:32px;"><img class="status-wrapper-image" src="../../assets/images/avatar.png" /></span>
              <!-- <span class="status">
                <div class="icon-container">
                  <status-online-avatar v-if="onlineStatus === 'online'"></status-online-avatar>
                  <status-away-avatar v-else-if="onlineStatus === 'away'"></status-away-avatar>
                  <status-offline-avatar v-else-if="onlineStatus === 'offline'"></status-offline-avatar>
                  <status-dnd-avatar v-else="onlineStatus === 'dnd'"></status-dnd-avatar>
                </div>
              </span>
              <div class="status-edit">
                <el-dropdown trigger="click" @command="handleOnlineStatus">
                  <span>
                    <svg t="1525682970585" viewBox="0 0 1024 1024" version="1.1" p-id="1166" width="13" height="13"><path d="M180.177 258.603c-32.209 0-49.892 39.532-29.407 65.799l316.399 405.35c23.526 30.156 67.296 30.156 90.824 0l316.079-405.394c20.485-26.227 2.8-65.757-29.408-65.757l-664.487 0z" p-id="1167" fill="#111111"></path></svg>
                  </span>
                  <el-dropdown-menu slot="dropdown" style="margin-top: -15px;">
                    <el-dropdown-item command="online">在线</el-dropdown-item>
                    <el-dropdown-item command="away">离开</el-dropdown-item>
                    <el-dropdown-item command="dnd">
                      <div>请勿打扰</div>
                      <div class="status-tooltip">停用推送通知</div>
                    </el-dropdown-item>
                    <el-dropdown-item command="offline">离线</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div> -->
            </div>
          </span>
          <h4 class="username">{{ userInfo.username }}</h4>
          <a class="dropdown-icon" title="主菜单">
            <el-dropdown trigger="click" @command="handleCommand">
              <span>
                <svg width="16px" height="10px" viewBox="0 0 16 10" version="1.1"><g stroke="none" stroke-width="1" fill="inherit" fill-rule="evenodd"><g transform="translate(-188.000000, -38.000000)" fill-rule="nonzero" fill="inherit"><g><g><g transform="translate(188.000000, 38.000000)"><path d="M15.5,0 C15.776,0 16,0.224 16,0.5 L16,1.5 C16,1.776 15.776,2 15.5,2 L0.5,2 C0.224,2 0,1.776 0,1.5 L0,0.5 C0,0.224 0.224,0 0.5,0 L15.5,0 Z M15.5,4 C15.776,4 16,4.224 16,4.5 L16,5.5 C16,5.776 15.776,6 15.5,6 L0.5,6 C0.224,6 0,5.776 0,5.5 L0,4.5 C0,4.224 0.224,4 0.5,4 L15.5,4 Z M15.5,8 C15.776,8 16,8.224 16,8.5 L16,9.5 C16,9.776 15.776,10 15.5,10 L0.5,10 C0.224,10 0,9.776 0,9.5 L0,8.5 C0,8.224 0.224,8 0.5,8 L15.5,8 Z"></path></g></g></g></g></g></svg>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="editPersonalInfo">账号设置</el-dropdown-item>
                <!-- <el-dropdown-item command="changePassword">修改密码</el-dropdown-item> -->
                <el-dropdown-item command="logout" divided>注销登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </a>
          <edit-personal-info ref="editPersonalInfoDlg"></edit-personal-info>
          <!-- <change-password ref="changePasswordDlg"></change-password> -->
        </div>
        <!-- <div class="channel-search-container">
          <div class="search"><input type="text" placeholder="搜索" v-model="searchKey" @keyup="onSearchInputKeyUp"><i class="el-icon-search" @click="doSearchChannel"></i></div>
        </div> -->
        <div class="channel-container first-nav-channel" v-bind:style="{height: channelListHeight}">
          <ul class="nav-channel">
            <li class="channel-header">
              <span>公开群组</span>
            </li>
            <li class="channel-item" v-for="(item, index) in this.userChannelList" v-if="item.channelType == 4" :key="item.channelId" :class="{'channel-item channel-item-active' : selectedChannelId === item.channelId}" @click="selectChannel(item, index)">
              <router-link :to="{ name: 'messageDialog', params: { channelId: item.channelId, channelType: item.channelType, leaveChannelCallback: leaveChannelCallback, removeChannelCallback: removeChannelCallback }}">
                <a href="#">
                  <div class="status">
                    <group-icon :selected="selectedChannelId === item.channelId"></group-icon>
                  </div>
                  <div :class="{'channel-item-name channel-item-name-selected' : selectedChannelId === item.channelId, 'channel-item-name': selectedChannelId !== item.channelId}">{{ item.channelName }}</div>
                  <div :class="{'unread-message-count': item.unreadMessageCount > 0, 'unread-message-count-hide': item.unreadMessageCount == 0}">{{ item.unreadMessageCount > 0 ? item.unreadMessageCount : "" }}</div>
                </a>
              </router-link>
            </li>
          </ul>
          <ul class="nav-channel">
            <li class="channel-header">
              <span>群聊</span>
              <button class="add-channel-btn" title="创建群聊" @click="openCreateGroupChannelDlg">+</button>
              <create-group-channel ref="createGroupChanneDlg" @onChannelCreated="onGroupChannelCreated"></create-group-channel>
            </li>
            <li class="channel-item" v-for="(item, index) in this.userChannelList" v-if="item.channelType == 2" :key="item.channelId" :class="{'channel-item channel-item-active' : selectedChannelId === item.channelId}" @click="selectChannel(item, index)">
              <router-link :to="{ name: 'messageDialog', params: { channelId: item.channelId, channelType: item.channelType, leaveChannelCallback: leaveChannelCallback, removeChannelCallback: removeChannelCallback }}">
                <a href="#">
                  <div class="status">
                    <group-icon :selected="selectedChannelId === item.channelId"></group-icon>
                  </div>
                  <div :class="{'channel-item-name channel-item-name-selected' : selectedChannelId === item.channelId, 'channel-item-name': selectedChannelId !== item.channelId}">{{ item.channelName }}</div>
                  <div :class="{'unread-message-count': item.unreadMessageCount > 0, 'unread-message-count-hide': item.unreadMessageCount == 0}">{{ item.unreadMessageCount > 0 ? item.unreadMessageCount : "" }}</div>
                </a>
              </router-link>
            </li>
          </ul>
          <ul class="nav-channel">
            <li class="channel-header">
              <span>私聊</span>
              <button class="add-channel-btn" title="创建私聊" @click="openCreatePrivateChannelDlg">+</button>
              <create-private-channel ref="createPrivateChanneDlg" @onChannelCreated="onPrivateChannelCreated"></create-private-channel>
            </li>
            <li class="channel-item" v-for="(item, index) in this.userChannelList" v-if="item.channelType == 1" :key="item.channelId" :class="{'channel-item channel-item-active' : selectedChannelId === item.channelId}" @click="selectChannel(item, index)">
              <router-link :to="{ name: 'messageDialog', params: { channelId: item.channelId, channelType: item.channelType }}">
                <div class="has-close">
                  <div class="status">
                    <status-online-icon v-if="item.toUserOnlineStatus === 'online'"></status-online-icon>
                    <status-away-icon v-else-if="item.toUserOnlineStatus === 'away'"></status-away-icon>
                    <status-dnd-icon v-else-if="item.toUserOnlineStatus === 'dnd'"></status-dnd-icon>
                    <status-offline-icon v-else-if="item.toUserOnlineStatus === 'offline'"></status-offline-icon>
                    <status-unknow-icon v-else></status-unknow-icon>
                  </div>
                  <div :class="{'channel-item-name channel-item-name-selected' : selectedChannelId === item.channelId, 'channel-item-name': selectedChannelId !== item.channelId}">{{ item.channelName }}</div>
                  <!-- <div :class="{'unread-message-count': item.unreadMessageCount > 0, 'unread-message-count-hide': item.unreadMessageCount == 0}">{{ item.unreadMessageCount > 0 ? item.unreadMessageCount : "" }}</div> -->
                  <!-- <span class="btn-close" @click="doHideChannel(item.channelId)">×</span> -->
                </div>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </el-scrollbar>
    
    <div class="content">
      <transition>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </transition>      
    </div>
  </el-container>
</template>

<script>
import { listUserChannels, getUserChannel} from '@/api/channel'
import { IMClient } from '@/im_client/im_client'
import GroupIcon from '@/components/svg/groupIcon'
import { logout } from '@/api/auth'
import StatusOnlineIcon from '@/components/svg/statusOnlineIcon'
import StatusOfflineIcon from '@/components/svg/statusOfflineIcon'
import StatusAwayIcon from '@/components/svg/statusAwayIcon'
import StatusDndIcon from '@/components/svg/statusDndIcon'
import StatusUnknowIcon from '@/components/svg/statusUnknowIcon'
import StatusOnlineAvatar from '@/components/svg/statusOnlineAvatar'
import StatusOfflineAvatar from '@/components/svg/statusOfflineAvatar'
import StatusDndAvatar from '@/components/svg/statusDndAvatar'
import StatusAwayAvatar from '@/components/svg/statusAwayAvatar'


const USER_CHANNEL_LIST_SIZE = 16 // todo 配置文件
export default {
  data() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'))
    return {
      userInfo: {
        id: currentUser.id,
        firstLetterOfName: currentUser.firstLetterOfName.toUpperCase(),
        username: currentUser.username,
        avatarUrl: currentUser.avatarUrl
      },
      onlineStatus: 'online',
      userChannelList: [],
      selectedChannelId: '',
      searchKey: '',
      unreadMessageChannelList: [],
      channelListHeight: ''
    }
  },
  methods: {
    // 处理下拉框的命令
    handleCommand(command) {
      switch(command) {
        case 'logout':
          this.logout()
          break
        case 'editPersonalInfo':
          this.$refs.editPersonalInfoDlg.$emit('openDialog')
          break
        case 'changePassword':
          this.$refs.changePasswordDlg.$emit('openDialog')
          break
      }
    },
    handleOnlineStatus(command) {
      if(this.onlineStatus !== command) {
        this.onlineStatus = command
        updateOnlineStatus(JSON.parse(localStorage.getItem('currentUser')).id, this.onlineStatus)
        .catch(error => {
          outputError(this, error)
        })
      }
    },
    logout() {
      this.$confirm('确定注销当前用户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
         type: 'warning'
      }).then(_ => {
        // 停止websocket客户端
        let imClient = this.$store.getters.imClient
        if(imClient!=null)
          imClient.conn.close()
        // 知会服务端
        logout().then(response=>{
          if(response.data.code==0){
            console.log("注销成功")
            localStorage.clear()// 清理localstorage
            this.$router.push('/login') // 跳转到登录页面
            // 模拟f5刷新
            this.$router.go(0)
          }
        }).catch(error => {
            outputError(this, error)
          })
      }).catch(_ => {
      })
    },
    // 创建私聊channel
    onPrivateChannelCreated(channel) {
      this.selectedChannelId = channel.channelId
      // 执行跳转
      this.$router.push({ name: 'messageDialog', params: { channelId: channel.channelId, channelType: 1 }})
      // 在当前已有的channel列表中查找channelid
      for(let userChannel of this.userChannelList) {
        if(userChannel.channelId === channel.channelId) {
          return
        }
      }
      // 将新的对话插入到列表开头
      this.userChannelList.unshift(channel)
      // 列表超过USER_CHANNEL_LIST_SIZE长度限制 推出最后一个列表
      if(this.userChannelList.length > USER_CHANNEL_LIST_SIZE) {
        this.userChannelList.pop()
      }
    },
    onGroupChannelCreated(channel) {
      this.selectedChannelId = channel.channelId
      this.$router.push({ name: 'messageDialog', params: { channelId: channel.channelId, channelType: 2 }})   
      // 将新的对话插入到列表开头
      this.userChannelList.unshift(channel)
      // 列表超过USER_CHANNEL_LIST_SIZE长度限制 推出最后一个列表
      if(this.userChannelList.length > USER_CHANNEL_LIST_SIZE) {
        this.userChannelList.pop()
      } 
    },
    openCreatePrivateChannelDlg() {
      this.$refs.createPrivateChanneDlg.$emit('openDialog', 'add')
    },
    openCreateGroupChannelDlg() {
      this.$refs.createGroupChanneDlg.$emit('openDialog', 'add')
    },
    selectChannel(channel, index) {
      this.selectedChannelId = channel.channelId
    },
    onChannelCreate(message){
      let channelId = message.channelId
      let channelType = message.createdChannelType
      let channelName = message.channelName
      let data = {
        channelId:channelId,
        channelType:channelType,
        channelName:channelName
      }
      this.userChannelList.unshift(data)
    },
    onOnlineStatusChanged(message) {
      if(message.userId === JSON.parse(localStorage.getItem('currentUser')).id) {
        return
      }
      for(let userChannel of this.userChannelList) {
        if(userChannel.toUserId == null) {
          continue
        }
        if(userChannel.toUserId === message.userId) {
          userChannel.toUserOnlineStatus = message.onlineStatus
          break
        }
      }
    },
    onNicknameChanged(message) {
      if(message.userId === this.userInfo.id) {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'))
        currentUser.nickname = this.userInfo.nickname = message.nickname
        localStorage.setItem('currentUser', JSON.stringify(currentUser))
        return
      }
      for(let userChannel of this.userChannelList) {
        if(userChannel.toUserId === message.userId) {
          if(userChannel.channelDisplayName == null || userChannel.channelDisplayName === '') {
            userChannel.channelDisplayName = message.nickname
          }
          return
        }
      }   
    },
    onAvatarChanged(message) {
      if(message.userId === this.userInfo.id) {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'))
        currentUser.avatarUrl = this.userInfo.avatarUrl = ''
        currentUser.avatarUrl = this.userInfo.avatarUrl = message.avatar
        localStorage.setItem('currentUser', JSON.stringify(currentUser))          
      }
    },
    onUnreadMessage(message) {
      if(message.channelId !== this.selectedChannelId) {
        let index = this.userChannelList.findIndex(item => item.channelId === message.channelId)
        if(index === -1) {
          let unreadMsgChannelIndex = this.unreadMessageChannelList.findIndex(item => item === message.channelId)
          if(unreadMsgChannelIndex == -1) {
            this.unreadMessageChannelList.push(message.channelId)
            getUserChannel(this.userInfo.id, message.channelId)
            .then(response => {
              let exists = this.userChannelList.findIndex(item => item.channelId === message.channelId)
              if(exists === -1) {
                this.userChannelList.unshift(response.data)
              }
              let existingUnreadMsgChannelIndex = this.unreadMessageChannelList.findIndex(item => item === message.channelId)
              if(existingUnreadMsgChannelIndex > -1) {
                this.unreadMessageChannelList.splice(existingUnreadMsgChannelIndex, 1)
              }
            })
            .catch(error => {
              outputError(this, error)
            })          
          }         
        } else {
          this.userChannelList[index].unreadMessageCount += 1
        }
      }
    },
    onReadMessage(message) {
      for(let userChannel of this.userChannelList) {
        if(userChannel.channelId === message.channelId) {
          if(message.readAll) {
            userChannel.unreadMessageCount = 0
          } else {
            userChannel.unreadMessageCount -= message.total
          }
          return
        }
      }
    },
    onJoinChannel(message) {
      let index = this.userChannelList.findIndex(item => item.channelId === message.channelId)
      if(index > -1) {
        return
      }
      getUserChannel(this.userInfo.id, message.channelId)
      .then(response => {
        let channelJoined = response.data
        let index = this.userChannelList.findIndex(item => item.channelId === channelJoined.channelId)
        if(index > -1) {
          return
        }
        this.userChannelList.unshift(channelJoined)
        if(this.userChannelList.length > USER_CHANNEL_LIST_SIZE) {
          this.userChannelList.pop()
        } 
      })
      .catch(error => {
        outputError(this, error)
      })
    },    
    onChannelNameChanged(message) {
      for(let channel of this.userChannelList) {
        if(channel.channelId === message.channelId) {
          channel.channelName = message.channelName
          return
        }
      }
    },
    onRemoveFromChannel(message) {
      let index = this.userChannelList.findIndex(item => item.channelId === message.channelId)
      if(index === -1) {
        return
      }      
      let imClient = this.$store.getters.imClient
      if(imClient != null) {      
        let sendMessage = {
          action: 'REMOVE_CHANNEL_FROM_GROUP',
          channelId: message.channelId
        }
        imClient.send(JSON.stringify(sendMessage))
      }
      this.userChannelList.splice(index, 1)
      if(this.selectedChannelId === message.channelId) {
        this.selectedChannelId = ''
        this.$router.push({ name: 'welcome' })
      }
    },
    leaveChannelCallback(channelId) {
      let index = this.userChannelList.findIndex(item => item.channelId === channelId)
      if(index === -1) {
        return
      }      
      let imClient = this.$store.getters.imClient
      if(imClient != null) {      
        let sendMessage = {
          action: 'REMOVE_CHANNEL_FROM_GROUP',
          channelId: channelId
        }
        imClient.send(JSON.stringify(sendMessage))
      }
      this.userChannelList.splice(index, 1)
      if(this.selectedChannelId === channelId) {
        this.selectedChannelId = ''
        this.$router.push({ name: 'welcome' })
      }
    },
    removeChannelCallback(channelId) {
      this.leaveChannelCallback(channelId)
    },
    onChannelRemoved(message) {
      this.leaveChannelCallback(message.channelId)
    },
    onUserOnline() {
      this.onlineStatus = 'online'
      updateOnlineStatus(JSON.parse(localStorage.getItem('currentUser')).id, this.onlineStatus)
      .catch(error => {
        outputError(this, error)
      })
    },
    onUserOffline() {
      this.onlineStatus = 'offline'
      updateOnlineStatus(JSON.parse(localStorage.getItem('currentUser')).id, this.onlineStatus)
      .catch(error => {
        outputError(this, error)
      })
    }, 
    // 初始化websocket客户端
    initIMClient() {
      let wsUrl = process.env.WEBSOCKET_URL+"?token=" + localStorage.getItem('token') // todo 配置文件
      const imClient = new IMClient(wsUrl, 30 * 1000)
      this.$store.dispatch('setIMClient', imClient)
      imClient.connect()
      imClient.bindChannelCreate(this.onChannelCreate)
    },
  },
  doHideChannel(channelId) {
      hideChannel(this.userInfo.id, channelId)
      .then(response => {
        if(response.data > 0) {
          let index = this.userChannelList.findIndex(item => item.channelId === channelId)
          if(index === -1) {
            return
          }
          this.userChannelList.splice(index, 1)
          if(this.selectedChannelId === channelId) {
            this.selectedChannelId = ''
            this.$router.push({ name: 'welcome' })
          }          
        }
      })
      .catch(error => {
        outputError(this, error)
      })      
    },
    doSearchChannel() {
      if(!this.searchKey.trim()) {
        return
      }
      this.userChannelList = []
      searchUserChannel(this.userInfo.id, this.searchKey)
      .then(response => {
        this.userChannelList = response.data
      })
      .catch(error => {
        outputError(this, error)
      })        
    },
    onSearchInputKeyUp(event) {
      if(!this.searchKey.trim()) {
        listUserChannels(this.userInfo.id, USER_CHANNEL_LIST_SIZE)
        .then(response => {
          this.userChannelList = response.data
        })
        .catch(error => {
          outputError(this, error)
        })
        return
      }
      if(event.keyCode === 13) {
        this.doSearchChannel()
      }
    },
  computed: {
    realAvatarUrl() {
      if(this.userInfo.avatarUrl == null || this.userInfo.avatarUrl.trim() === '') {
        return null
      }
      if(!this.userInfo.avatarUrl.startsWith('http:') && !this.userInfo.avatarUrl.startsWith('https:')) {
        return process.env.BASE_API + '/user/avatar/get/' + this.userInfo.id + '/'+this.userInfo.avatarUrl
      }
      return this.userInfo.avatarUrl + (this.userInfo.avatarUrl.indexOf('?') > -1 ? '&' : '?') + 'rdm=' + Math.random()
    }
  },
  // 使用activated每次页面被激活时运行
  activated() {
    if(!localStorage.getItem('currentUser')){
      this.$router.push({
        path: '/login',
        query: { redirect: this.$route.path }
      })
      return
    }
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
    let userId = JSON.parse(localStorage.getItem('currentUser')).id
    listUserChannels(userId, USER_CHANNEL_LIST_SIZE) // 获取用户的聊天列表
    .then(response => {
      if(response.data.code==-200){
        // token不合法
        // 清理localstorage
        localStorage.removeItem("currentUser")
        localStorage.removeItem("token")
        // 跳转登录窗口
        this.$router.push({
          path: '/login',
          query: { redirect: this.$route.path }
        })
        return
      }
      this.userChannelList = response.data.data
      this.initIMClient()// 初始化ws客户端
    })
    .catch(error => {
      console.error(error)
    })
    if(this.$route.params.channelId) {
      this.selectedChannelId = this.$route.params.channelId
    } else {
      this.$router.push({ name: 'welcome' })
    }
  },
  // 执行权限认证 拦截
  beforeRouteEnter(to, from, next) {    
    if(localStorage.getItem("token")) {
        next(true);
    }else {
        next(vm => {    // 通过 `vm` 访问组件实例 ，直接用this是有指向问题的   
            vm.$router.push({
            path: '/login',
            query: { redirect: to.fullPath }
            });
            vm.$message({       //这里是elementUI的message提示，按自己需求来写就行
            message: '请先登录！',
            type: 'warning'
            });
        })
    }
  },
  components: { 
    GroupIcon,StatusOnlineIcon, StatusOfflineIcon, StatusAwayIcon, 
    StatusDndIcon, StatusUnknowIcon,StatusOnlineAvatar, StatusOfflineAvatar, StatusAwayAvatar, StatusDndAvatar,
    CreatePrivateChannel: resolve => require(['@/components/channel/createPrivateChannel'], resolve),
    CreateGroupChannel: resolve => require(['@/components/channel/createGroupChannel'], resolve),
    EditPersonalInfo: resolve => require(['@/components/user/editPersonalInfo'], resolve),
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  background-color: #F0F0F0;
}
::-webkit-scrollbar-thumb {
  -webkit-border-radius: 2px;
  -moz-border-radius: 2px;
  -ms-border-radius: 2px;
  -o-border-radius: 2px;
  border-radius: 2px;
  background: rgba(0,0,0,.2);
}
::-webkit-scrollbar-track {
  background: rgba(0,0,0,.1);
}
.body-container {
    height: 100%;
    background-color: #fff;
    overflow: hidden;
}
.sidebar {
  width: 220px;
  float: left;
  background-color: #1C5CB9;
  .header {
    background-color: #0A53A4;
    height: 70px;
    width: 100%;
    position: relative;
    .avatar {
      width: 36px; 
      height: 36px;
      margin: 19px 0px auto 5px;
      background-color: #DF016E;
      border-radius: 36px;
      text-align: center;
      line-height: 36px;
      color: #fff;
      font-weight: bold;
      float: left;
      img {
        width: 36px;
        height: 36px;
        display: block;
        border-radius: 36px;
      }
    }
    #status-dropdown {
      cursor: pointer;
    }
    .status {
      border-radius: 15px;
      bottom: -4px;
      height: 15px;
      line-height: 0;
      margin: 0;
      position: absolute;
      left: 32px;
      top: 41px;
      width: 15px;
      svg {
        max-height: 11px;
        position: relative;
        top: 2px;
      }
      .icon-container {
        :after {
          border-radius: 20px;
          height: 10px;
          left: 4px;
          position: absolute;
          top: 4px;
          width: 10px;
        }
      }             
    }
    .status-edit {
      border-radius: 15px;
      background-color: #fff;
      width: 15px;
      height: 15px;
      left: 32px;
      top: 41px;
      position: absolute;
      text-align: center;    
      svg {
        position: relative;
        top: -8px;
        padding: 0;
        margin: 0;
      } 
    }      
    .status-selector:hover > .status {
      display: none;
    }
    .status-selector > .status {
      display: inherit;
    }
    .status-selector > .status-edit {
      display: none;
    }
    .status-selector:hover > .status-edit {
      display: inherit;
    }
    .username {
      color: #fff;
      padding-top: 4px;
      margin-left: 6px;
      float: left;
    }
    .dropdown-icon {
      border-radius: 36px;
      fill: #D0DDEC;
      float: right;
      height: 36px;
      line-height: 36px;
      position: relative;
      text-align: center;
      width: 36px;
      margin-top: 18px;
      cursor: pointer;
      &:hover {
        fill: #fff;
      }
    }
  }

  .channel-search-container {
    height: 28px;
    padding: 3px 5px 0 5px;
    .search {      
      padding: 0 0 0 5px;
      background-color: #046BBB;
      height: 28px;
      line-height: 28px;
      vertical-align: middle;
      border-radius: 3px;
      i {
        color: #DDDBD7;
        cursor: pointer;
      }
      input {
        margin: 0 0 0 4px;
        width: 177px;
        outline: 0;
        border: none;
        background-color: transparent;
        -webkit-appearance: textfield;
        -webkit-rtl-ordering: logical;
        cursor: text;
        color: #fff;
      }
      input::-webkit-input-placeholder {
        color: #DDDBD7;
      }
      input::-moz-placeholder {   /* Mozilla Firefox 19+ */
        color: #DDDBD7;
      }
      input:-moz-placeholder {    /* Mozilla Firefox 4 to 18 */
        color: #DDDBD7;
      }
      input:-ms-input-placeholder {  /* Internet Explorer 10-11 */ 
        color: #DDDBD7;
      }           
    }
  }
  
  .channel-container {
    width: 219px;
    overflow: auto;
  }

  .nav-channel {
    margin: 0;
    padding: 0;
    color: #97B8DD;
    list-style: none;
    .channel-header {
      padding: 0 2px 0 10px;
      line-height: 36px;
      span {
        font-weight: bold;
      }
      .add-channel-btn {
        float: right;
        font-size: 28px;
        margin-top: -4px;
        color: #D0DDEC;
        cursor: pointer;
        background: transparent;
        border: none;
        font-family: inherit;
        &:hover {
          color: #fff;
        }
      }
    }
    .channel-item {
      padding-left: 3px;
      &:hover {
        background-color: #1F77BA;
      }
      a {
        display: block;
        -webkit-transition: none 1s;
        transition-delay: 0s;
        -moz-transition: none 1s;
        -o-transition: none 1s;
        transition: none false false 1s;
        text-align: left;
        width: 100%;
        border-radius: 0;
        line-height: 30px;
        height: 30px;
        outline: none;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 14px;
        color: #fff;
        white-space: nowrap;
        svg {
          height: 14px;
          width: 14px;
          left: 10px;
          top: 0px;
          max-height: initial;
          position: relative;
          z-index: 1;
        } 
      }
      .status {
        display: inline-block;
        position: relative;
        padding: 0 0 0 10px;
        margin-top: 1px;
      }     
      .channel-item-name {
        display: inline-block;
        width: 131px;
        max-width: 131px;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: top;
      }
      .channel-item-name-selected {
        font-weight: bold;
        color: #F6F7C0;
      }
      .unread-message-count {
        display: inline-block;
        width: 20px; 
        height: 20px;
        margin-top: -7px;
        background-color: red;
        border-radius: 20px;
        text-align: center;
        line-height: 20px;
        color: #fff;
        vertical-align: middle;
        font-size: 12px;
      }
      .unread-message-count-hide {
        display: inline-block;
        width: 20px;
      }      
      .has-close {
        &:hover{
          .btn-close {
            opacity: 0.8;
            display: inline-block;
            text-decoration: none;
          }
          .channel-item-name {
            max-width: 131px;
            min-width: 131px;
          }
        }
      }
      .btn-close {
        opacity: 0;
        display: none;
        font-size: 20px;
        font-weight: 600;
        right: 29px;
        height: 16px;
        line-height: 16px;
        margin: -7px 0 0 0;
        padding-bottom: 2px;
        vertical-align: middle;
        &:hover {
          opacity: 1;
          background-color: #F23724;
        }
      }
    }
    .channel-item-active {
      padding-left: 0px;
      background-color: #186CC1;
      border-left: solid 3px #279EFF;
    }
  }
  .first-nav-channel {
    padding-top: 2px;
  }
}
.content {
  flex: 1;
}
.status-tooltip {
  font-size: 8px;
  color: #7C7A74;
  margin-top: -15px;
}
</style>

<style lang="scss">
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
</style>