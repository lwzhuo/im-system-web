import request from '@/utils/request'

export const createChannel = (channel) =>
    request({
        url: '/channels/',
        method: 'post',
        data: channel
    })
