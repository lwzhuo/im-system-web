import request from '@/utils/request'
import qs from 'qs'

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

export const listUser = (name) =>
    request({
        url: '/user/get-user-info-by-username',
        method: 'GET',
        params: {
            username: name,
        }
    })