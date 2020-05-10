<template>
  <el-dialog :visible.sync="dialogVisible" :modal-append-to-body="false" width="400px" v-loading="loadingVisible">
    <div slot="title" class="dialog-header"><h3>{{title}}</h3></div>
    <div class="list-container">
      <span>用户 {{inviterName}} 向您分享群组「{{userChannel.channelName}}」的聊天记录,点击以下链接查看:<br>
            <a :href="url+shareData.shareId" target="_blank">{{url+shareData.shareId}}</a><br>
            群组简介:{{userChannel.summary}} <br>
            关键词:{{this.shareData.keyword?this.shareData.keyword.split(";").join(" "):''}} <br>
      </span>
    </div>
  </el-dialog>
</template>

<script>
import { outputError } from '@/utils/exception'

export default {
  name: 'share-list',
  props: ['shareData','userChannel'],
  data() {
    return {
      title:"分享",
      inviterName:JSON.parse(localStorage.getItem('currentUser')).username,
      page:"home",
      channelName:'',
      keyword:" ",
      dialogVisible: false,
      loadingVisible: false,
      url:'http://localhost:8081/#/msg/',
    }
  },
  methods: {
  },
  mounted: function() {
    this.$nextTick(() => {  
      this.$on('openDialog', function(action) {
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


