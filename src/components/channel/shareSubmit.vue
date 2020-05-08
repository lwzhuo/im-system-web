<template>
  <div class="container" v-loading="loadingVisible">
    <div class="toolbar">
        <el-button class="btn" size="mini" @click="submitData" type="primary">确定</el-button>
        <el-button class="btn" size="mini" @click="closeBar">取消</el-button>
      </div>
  </div>
</template>

<script>
import { outputError } from '@/utils/exception'
import { listMember } from '@/api/channel'
import { shareMessage } from '@/api/message'

export default {
  name: 'share-submit',
  props: ['channelId', 'shareMessageList'],
  data() {
    return {
      dialogVisible: false,
      loadingVisible: false,
    }
  },
  methods: {
    submitData(){
      shareMessage(this.channelId,this.shareMessageList)
      .then(response=>{
        if(response.data.code<0)
          outputError(this, "服务异常")
        let responseData = response.data.data
        console.log(responseData)
      }).catch(error => {
        outputError(this, error)
      })
    },
    closeBar(){
      this.$emit("onCloseShareMessageCheckbox")
    }
  }
}
</script>

<style lang="scss" scoped>
  .container {
    -webkit-flex: 0 0 auto;
    flex: 0 0 auto;
    width: 100%;
    z-index: 7;
    background-color: #FFFFFF;
    border-top: solid 1px #DFDAD3;
    .toolbar {
      height: 25px;
      padding: 5px 20px;
      display: inline-block;
      .btn {
        vertical-align: middle;
        float: right;
        margin-left: 10px;
        cursor: pointer;
      }
    }
  }
</style>


