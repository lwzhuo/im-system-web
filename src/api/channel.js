import request from '@/utils/request'

// 创建channel
export const createChannel = (channel) =>
    request({
        url: '/channel/',
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
        url: '/userChannels',
        method: 'GET',
        params: {
            userId: userId,
            channelId: channelId
        }
    })