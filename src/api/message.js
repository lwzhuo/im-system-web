import request from '@/utils/request'

// 加载消息
export const listMessage = (channelId, maxCreateAt, size) =>
    request({
        url: '/message/'+channelId,
        method: 'GET',
        params: {
            maxCreateAt: maxCreateAt,
            size: size
        }
    })

// 发送消息
export const saveMessage = (message) =>
    request({
        url: '/message/send',
        method: 'POST',
        data: message
    })

// 设置消息已读
export const readMessage = (channelId, total) =>
    request({
        url: '/messages/read',
        method: 'POST',
        data: {
            channelId: channelId,
            total: total
        }
    })

// 删除消息
export const removeMessage = (messageId, channelId, toUserId) =>
    request({
        url: '/messages',
        method: 'DELETE',
        data: {
            messageId: messageId,
            channelId: channelId,
            toUserId: toUserId
        }
    })

export const shareMessage = (channelId,messageIdList)=>
    request({
        url:'/message/share/'+channelId,
        method: 'POST',
        data:{
            messageIdList:messageIdList
        }
    })