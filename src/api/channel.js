import request from '@/utils/request'

// 创建channel
export const createChannel = (channel) =>
    request({
        url: '/channel/create',
        method: 'post',
        data: channel
    })

// 列出一定数量的用户channel 用户聊天列表展示
export const listUserChannels = (userId, limit) =>
    request({
        url: '/user-channel/' + userId + '?limit=' + limit,
        method: 'GET'
    })

// 根据用户id和channelID查询channel
export const getUserChannel = (userId, channelId) =>
    request({
        url: '/channel/info',
        method: 'GET',
        params: {
            uid: userId,
            channelId: channelId
        }
    })

// 加入channel
export const joinChannel = (uid,channelId) =>
    request({
        url: '/channel/join',
        method: 'GET',
        params:{
            uid:uid,
            channelId:channelId
        }
    })

// 加入channel
export const joinChannelBatch = (uidList,channelId) =>
    request({
        url: '/channel/join-batch',
        method: 'POST',
        data:{
            uidList:uidList,
            channelId:channelId
        }
    })

export const getChannelList = () =>
    request({
        url: '/channels/',
        method: 'GET'
    })

export const getChannelById = (id) =>
    request({
        url: '/channels/' + id,
        method: 'GET'
    })

export const isAdmin = (channelId) =>
    request({
        url: '/channel/' + channelId + '/is-admin',
        method: 'GET'
    })

// 离开频道
export const leftChannel=(channelId,leftUid) =>
    request({
        url: '/channel/left',
        method: 'GET',
        params:{
            uid:leftUid,
            channelId:channelId
        }
    })

export const updateUserChannelDisplayName = (channelId, displayName) =>
    request({
        url: '/userChannels/' + channelId,
        method: 'PATCH',
        headers: {
            'Content-type': 'text/xml'
        },
        data: displayName
    })

export const updateChannelName = (channelId, name) =>
    request({
        url: '/channels/' + channelId,
        method: 'PATCH',
        data: {
            name: name
        }
    })

export const updateChannelPurpose = (channelId, purpose) =>
    request({
        url: '/channels/' + channelId,
        method: 'PATCH',
        data: {
            purpose: purpose
        }
    })

export const addMember = (channelId, userIds) => 
    request({
        url: '/channels/' + channelId + '/members',
        method: 'POST',
        data: userIds
    })

export const listMember = (channelId, username, limit, offset) =>
    request({
        url: '/channels/' + channelId + '/members',
        method: 'GET',
        params: {
            username: username,
            limit: limit,
            offset: offset
        }
    })

export const removeMember = (channelId, memberId) =>
    request({
        url: '/channels/' + channelId + '/members',
        method: 'DELETE',
        headers: {
            'Content-type': 'text/xml'
        },                
        data: memberId      
    })

export const changeAdmin = (channelId, memberId, isAdmin) =>
    request({
        url: '/channels/' + channelId + '/admin',
        method: 'PUT',
        data: {
            memberId: memberId,
            isAdmin: isAdmin
        }
    })

export const leaveChannel = (channelId, memberId, memberNickname) =>
    request({
        url: '/channels/' + channelId + '/members/' + memberId,
        method: 'DELETE',
        data: {
            memberNickname: memberNickname
        }
    })

export const removeChannel = (channelId) =>
    request({
        url: '/channels/' + channelId,
        method: 'DELETE',
    })

export const hideChannel = (userId, channelId) =>
    request({
        url: '/userChannels/' + channelId + '/hiding',
        method: 'POST'
    })

export const searchUserChannel = (userId, name) =>
    request({
        url: '/userChannels/' + userId + '/search',
        method: 'GET',
        params: {
            name: name
        }
    })