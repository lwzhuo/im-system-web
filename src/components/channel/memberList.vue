<template>
<div>
  <el-dialog :visible.sync="dialogVisible" :modal-append-to-body="false" width="400px" v-loading="loadingVisible">
    <div slot="title" class="dialog-header"><h3>{{channelName}}&nbsp;-&nbsp;成员</h3></div>
    <div class="list-container">
      <ul>
        <li v-for="(item, index) in this.memberList" :class="{ 'is-admin': item.userType===1 }" :title="item.userType===1 ? '群管理员': ''">{{ item.username }}<span v-if="isAdmin && item.userType===2" @click="removeUser(item.id)">-</span></li>                                     
      </ul>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" type="primary" @click="showAddMemberDilog()">添加成员</el-button>
      <el-button size="small" @click="dialogVisible=false">关闭</el-button>
    </span>    
  </el-dialog>
  <add-member ref="addChannelMemberDlg" :channel-id="channelId" :channel-name="channelName"></add-member>
</div>
</template>

<script>
import { outputError } from '@/utils/exception'
import { listMember,isAdmin,leftChannel} from '@/api/channel'

export default {
  name: 'member-list',
  props: ['channelId', 'channelName','memberInfo'],
  data() {
    return {
      isAdmin:false,
      dialogVisible: false,
      loadingVisible: false,
      memberList: [],
      memberTotal: 0,
    }
  },
  methods: {
    getMemberList() {
      this.memberList = []
      for(let uid in this.memberInfo){
        if(this.memberInfo[uid].status==1){
          this.memberList.push({
            id:uid,
            username:this.memberInfo[uid].username,
            userType:this.memberInfo[uid].userType,
          })
        }
      }
    },
    getExcludeMemberList(excludeUid) {
      this.memberList = []
      for(let uid in this.memberInfo){
        if(uid==excludeUid)
          continue
        if(this.memberInfo[uid].status==1){
          this.memberList.push({
            id:uid,
            username:this.memberInfo[uid].username,
            userType:this.memberInfo[uid].userType,
          })
        }
      }
    },
    showAddMemberDilog(){
      this.$refs.addChannelMemberDlg.$emit('openDialog', [])
      this.dialogVisible=false
      this.loadingVisible=false
    },
    // 删除用户
    removeUser(uid){
      this.$confirm('确定将该用户移出群聊吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
         type: 'warning'
      }).then(_ => {
        leftChannel(this.channelId,uid)
        .then(response=>{
          if(response.data.code<0){
            outputError(this, "服务异常")
          }else{
            this.getExcludeMemberList(uid)
            this.$message({
              message: '已将用户移出群聊',
              type: 'success'
              });
          }
        }).catch(error => {
            this.loadingVisible = false
            outputError(this, error)
          })
        }).catch(_=>{})
        this.loadingVisible = false
        this.dialogVisible = false
    }  
  },
  mounted: function() {
    this.$nextTick(() => {  
      this.$on('openDialog', function(action) {
        this.dialogVisible = true
        isAdmin(this.channelId).then(response=>{
          if(response.data.code<0){
            outputError(this, "服务异常")
          }else{
            let res = response.data.data
            if(res==true)
              this.isAdmin=true
            else
              this.isAdmin=false
          }
          this.getMemberList()
        }).catch(error => {
          this.showLoading = false
          outputError(this, error)
        }) 
      })
    })
  },
  components:{AddMember: resolve => require(['@/components/channel/addMember'], resolve),}  
}
</script>

<style lang="scss" scoped>
.list-container {
  padding: 6px 16px;
  ul {
    height: 360px;
    border: solid 1px #D4D1CC;
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


