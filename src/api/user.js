import request from '@/utils/request'
import qs from 'qs'

// 注册用户
export const registerUser = (username, password) =>
    request({
        url: '/user/register',
        method: 'POST',
        header:{'Content-Type':'application/json'},
        data: {
            "username":username,
            "password":password
        }
    })

// 创建channel时 用于根据用户名查询用户信息
export const listUser = (name) =>
    request({
        url: '/user/get-user-info-by-username',
        method: 'GET',
        params: {
            username: name,
        }
    })

// 获取本人用户信息
export const getMyInfo = () =>
    request({
        url: '/user/me',
        method: 'GET'
    })

export const updateMyInfo = (nickname, avatarUrl) =>
    request({
        url: '/user/info/save',
        method: 'POST',
        data: {
            nickname: nickname,
            avatarUrl: avatarUrl
        }
    })