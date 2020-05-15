<template>
  <el-dialog :visible.sync="dialogVisible" :modal-append-to-body="false" width="1000px" v-loading="loadingVisible">
    <div slot="title" class="dialog-header"><h3>聊天记录查找结果</h3></div>
    <div :id="'message_' + item.messageId" v-for="(item, index) in messageSearchRes" :key="item.messageId">
      <div class="message-container">
        <div class="message">
          <div class="message-content">
            <span class="sender">{{ item.fromUserName ? item.fromUserName :memberInfo[item.fromUid].username }}</span>
            <span class="createAt">{{ getCreateDateTime(item) }}</span>
            <!-- 处理不同的消息类型 文本 图片 文件 -->
            <div v-if="item.msgType === 1" v-text="item.msg"></div>
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
    </div>
  </el-dialog>
</template>

<script>
import { outputError } from '@/utils/exception'
import { listMember } from '@/api/channel'

export default {
  name: 'message-search-res-list',
  props: ['messageSearchRes','memberInfo'],
  data() {
    return {
      dialogVisible: false,
      loadingVisible: false,
    }
  },
  methods: {
    getCreateDateTime(message) {
      return new Date(message.ts).toLocaleString()
    }, 
  },
  mounted: function() {
    this.$nextTick(() => {  
      this.$on('openDialog', function(action) {
        this.title="聊天记录查找结果"
        this.dialogVisible = true
      })
    })
    console.log(this.messageSearchRes)
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
</style>


