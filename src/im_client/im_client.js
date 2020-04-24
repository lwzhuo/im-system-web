import actionMap from './actionMap'
export class IMClient {
  constructor(url,heartChecknterval) {
    this.url = url
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"))
    this.heartChecknterval = heartChecknterval
    this.currentChannelId = ''
  }

  connect(callback) {
    this.connectCallback = callback // 绑定回调函数
    // 创建websocket对象时使用第二个参数传入token
    // 根据rfc文档 https://www.rfc-editor.org/rfc/rfc6455.html#section-11.3.4
    // 数据会放在 Sec-WebSocket-Protocol 这个header中，且只有在open的时候才会有这个请求头
    // 用于业务中子协议制定
    this.conn = new WebSocket(this.url)
    // ws四种状态的回调函数
    this.conn.onopen = () => {
      this.connected = true
      this.onOpen()
    }

    this.conn.onclose = () => {
      this.connected = false
      this.onClose()
    }

    this.conn.onerror = (event) => {
      this.onError(event)
    }

    this.conn.onmessage = (event) => {
      this.onMessage(event.data)
    }
  }

  // 心跳检测机制
  heartCheckUtil = {
    start: () => {
      this.heartCheckObj = setTimeout(() => {
        if (this.conn && this.conn.readyState === 1) {
          let echoMsg = {
            action:1,
            msg:"echo",
            fromUid:this.currentUser.id,
            msgType:3
          }
          this.conn.send(JSON.stringify(echoMsg))
        }
      }, this.heartChecknterval)
    },

    reset: () => {
      clearTimeout(this.heartCheckObj)
      this.heartCheckUtil.start()
    },

    stop: () => {
      if (this.heartCheckObj) {
        clearTimeout(this.heartCheckObj)
      }
    }
  }

  // 重连机制
  reconnectUtil = {
    start: () => {
      this.reconnectObj = setTimeout(() => {
        // 已经关闭了与服务器的连接
        if (this.conn.readyState == 3) {
          this.reconnectStarting = true
          this.connect()
        }
      }, 5000)
    },

    stop: () => {
      this.reconnectStarting = false
      if (this.reconnectObj) {
        clearTimeout(this.reconnectObj)
        this.reconnectObj = null
      }
    }
  }

  onOpen() {
    let registerMsg = {
      action:3, // todo 配置文件
      msg:"hello",
      fromUid:this.currentUser.id,
      msgType:3 // 配置文件
    }
    this.send(JSON.stringify(registerMsg));
    if(this.connectCallback != null) {
      this.connectCallback(this) //执行bindToGroupChannel
    }
    const reconnectStarting = this.reconnectStarting
    this.reconnectUtil.stop()
    if (reconnectStarting && this.handleReconnectSuccessed) { // 首次开启不会进入这个分支
      this.handleReconnectSuccessed()
    }
    if(this.handleUserOnline) {
      this.handleUserOnline()
    }
    this.heartCheckUtil.start()
  }

  onClose() {
    this.heartCheckUtil.stop() // 关闭心跳机制
    this.reconnectUtil.start() // websocket关闭的时候开启重连
    if(this.handleConnectionClosed) {
      this.handleConnectionClosed()
    }
    if(this.handleUserOffline) {
      this.handleUserOffline()
    }
  }

  onError(error) {
    console.error(error)
  }

  // 收到数据时，转发数据到handleMessage中具体的函数进行处理
  onMessage(message) {
    if (message !== '') {
      this.handleMessage(JSON.parse(message))
    }
    this.heartCheckUtil.reset()
  }

  send(message) {
    if (this.connected) {
      this.conn.send(message)
      this.heartCheckUtil.reset()
    }
  }

  handleMessage(message) {
    switch (message.action) {
      case "ONLINE_STATUS_CHANGED":
        if (this.handleOnlineStatusChanged) {
          this.handleOnlineStatusChanged(message)
        }
        if(this.handleUserOnlineStatusChanged) {
          this.handleUserOnlineStatusChanged(message)
        }
        break
      case "NICKNAME_CHANGED":
        if (this.handleNicknameChanged) {
          this.handleNicknameChanged(message)
        }
        break
      case "AVATAR_CHANGED":
        if (this.handleAvatarChanged) {
          this.handleAvatarChanged(message)
        }
        break
      case actionMap.NEW_MESSAGE:
        if (this.handleNewMessage) {
          this.handleNewMessage(message)
        }
        if (this.handleUnreadMessage) {
          this.handleUnreadMessage(message)
        }
        break
      case "READ_MESSAGE":
        if(this.handleReadMessage) {
          this.handleReadMessage(message)
        }
        break
      case "JOIN_CHANNEL":
        if(this.handleJoinChannel) {
          this.handleJoinChannel(message)
        }
        break
      case "MESSAGE_REMOVED":
        if(this.handleMessageRemoved) {
          this.handleMessageRemoved(message)
        }
        break
      case "CHANNEL_NAME_CHANGED":
        if(this.handleChannelNameChanged) {
          this.handleChannelNameChanged(message)
        }
        break
      case "MEMBERS_COUNT_CHANGED":
        if(this.handleMembersCountChanged) {
          this.handleMembersCountChanged(message)
        }
        break
      case "REMOVE_FROM_CHANNEL":
        if(this.handleRemoveFromChannel) {
          this.handleRemoveFromChannel(message)
        }
        break
      case "LEAVE_CHANNEL":
        if(this.handleLeaveChannel) {
          this.handleLeaveChannel(message)
        }
        break
      case "CHANNEL_REMOVED":
        if(this.handleChannelRemoved) {
          this.handleChannelRemoved(message)
        }
        break
    }
  }

  bindOnlineStatusChanged(callback) {
    this.handleOnlineStatusChanged = callback
  }
  unbindOnlineStatusChanged() {
    this.handleOnlineStatusChanged = null
  }

  bindNicknameChanged(callback) {
    this.handleNicknameChanged = callback
  }
  unbindNicknameChanged() {
    this.handleNicknameChanged = null
  }

  bindAvatarChanged(callback) {
    this.handleAvatarChanged = callback
  }
  unbindAvatarChanged() {
    this.handleAvatarChanged = null
  }

  bindNewMessage(callback) {
    this.handleNewMessage = callback
  }
  unbindNewMesssage() {
    this.handleNewMessage = null
  }

  bindConnectionClosed(callback) {
    this.handleConnectionClosed = callback
  }
  unbindConnectionClosed() {
    this.handleConnectionClosed = null
  }

  bindReconnectSuccessed(callback) {
    this.handleReconnectSuccessed = callback
  }
  unbindReconnectSuccessed() {
    this.handleReconnectSuccessed = null
  }

  bindUnreadMessage(callback) {
    this.handleUnreadMessage = callback
  }
  unbindUnreadMessage() {
    this.handleUnreadMessage = null
  }

  bindReadMessage(callback) {
    this.handleReadMessage = callback
  }
  unbindReadMessage() {
    this.handleReadMessage = null
  }

  bindJoinChannel(callback) {
    this.handleJoinChannel = callback
  }
  unbindJoinChannel() {
    this.handleJoinChannel = null
  }

  bindUserOnlineStatusChanged(callback) {
    this.handleUserOnlineStatusChanged = callback
  }
  unbindUserOnlineStatusChanged() {
    this.handleUserOnlineStatusChanged = null
  }

  bindMessageRemoved(callback) {
    this.handleMessageRemoved = callback
  }
  unbindMessageRemoved() {
    this.handleMessageRemoved = null
  }

  bindChannelNameChanged(callback) {
    this.handleChannelNameChanged = callback
  }
  unbindChannelNameChanged() {
    this.handleChannelNameChanged = null
  }

  bindMembersCountChanged(callback) {
    this.handleMembersCountChanged = callback
  }
  unbindMembersCountChanged() {
    this.handleMembersCountChanged = null
  }

  bindRemoveFromChannel(callback) {
    this.handleRemoveFromChannel = callback
  }
  unbindRemoveFromChannel() {
    this.handleRemoveFromChannel = null
  }

  bindLeaveChannel(callback) {
    this.handleLeaveChannel = callback
  }
  unbindLeaveChannel() {
    this.handleLeaveChannel = null
  }

  bindChannelRemoved(callback) {
    this.handleChannelRemoved = callback
  }
  unbindChannelRemoved() {
    this.handleChannelRemoved = null
  }

  bindUserOnline(callback) {
    this.handleUserOnline = callback
  }
  unbindUserOnline() {
    this.handleUserOnline = null
  }

  bindUserOffline(callback) {
    this.handleUserOffline = callback
  }
  unbindUserOffline() {
    this.handleUserOffline = null
  }

}