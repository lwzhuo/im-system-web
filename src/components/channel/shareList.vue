<template>
  <el-dialog :visible.sync="dialogVisible" :modal-append-to-body="false" width="400px" v-loading="loadingVisible">
    <div slot="title" class="dialog-header"><h3>分享</h3></div>
    <div class="list-container">
      <ul>
        <li>分享聊天链接</li>
        <li>分享聊天记录</li>                                      
      </ul>
    </div>  
  </el-dialog>
</template>

<script>
import { outputError } from '@/utils/exception'
import { listMember } from '@/api/channel'

export default {
  name: 'share-list',
  props: ['channelId', 'channelName'],
  data() {
    return {
      dialogVisible: false,
      loadingVisible: false,
      memberList: [],
      searchParams: {
        username: '',
        limit: 20,
        offset: 0
      },
      memberTotal: 0
    }
  },
  methods: {
  },
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


