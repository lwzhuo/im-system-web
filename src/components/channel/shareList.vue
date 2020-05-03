<template>
  <el-dialog :visible.sync="dialogVisible" :modal-append-to-body="false" width="400px" v-loading="loadingVisible">
    <div slot="title" class="dialog-header"><h3>{{title}}</h3></div>
    <div v-if="page=='home'" class="list-container">
      <ul>
        <li @click="showShareLinkDialog">邀请成员</li>
        <li>分享聊天记录</li>                                      
      </ul>
    </div> 
    <div v-else-if="page=='shareUrl'" class="list-container">
      <span>用户{{inviterName}}邀请你进入群聊,点击以下链接即可进入群聊房间:<br>
            <a :href="url+channelId" target="_blank">{{url+channelId}}</a><br>
            群聊主题:{{channelName}} <br>
            群聊简介:{{channelSummary}} <br>
      </span>
    </div>
  </el-dialog>
</template>

<script>
import { outputError } from '@/utils/exception'
import { listMember } from '@/api/channel'

export default {
  name: 'share-list',
  props: ['userChannel'],
  data() {
    return {
      title:"分享",
      inviterName:JSON.parse(localStorage.getItem('currentUser')).username,
      page:"home",
      dialogVisible: false,
      loadingVisible: false,
      channelId:this.userChannel.channelId,
      channelName:this.userChannel.channelName,
      channelSummary:this.userChannel.summary,
      url:'http://localhost:8081/#/join/',
    }
  },
  methods: {
    showShareLinkDialog(){
      // this.$refs.shareUrl.$emit('openDialog')
      // this.dialogVisible = false
      this.page='shareUrl'
      this.title="邀请成员"
    }
  },
  mounted: function() {
    this.$nextTick(() => {  
      this.$on('openDialog', function(action) {
        this.page='home'
        this.title="分享"
        this.dialogVisible = true
      })
    })
  }
}
</script>

<style lang="scss" scoped>
.list-container {
  padding: 6px 16px;
  ul {
    height: 50px;
    padding: 0;
    margin: 0;
    overflow-y: auto;
    margin: 0;
    list-style-type: none;
    .load-more {
      text-align: center;
      font-size: 11px;
    }
    li {
      display: list-item;
      padding: 2px 5px;
      margin: 0;
      span {
        font-weight: bold;
        float: right;
        display: none;
        font-size: 5em;
      }
    }
    li:hover {
      background-color: #F1EFEE;
      cursor: pointer;
    }
    li:hover span {
      display: block;
    }
    .is-admin {
      color: #0A53A4;
      font-weight: bold;
    }     
  }
}
</style>


