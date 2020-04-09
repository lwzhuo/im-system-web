import request from '@/utils/request'
import qs from 'qs'

export const registerUser = (username, password) =>
    request({
        url: '/user/register',
        method: 'post',
        header:{'Content-Type':'application/json'},
        data: {
            "username":username,
            "password":password
        }
    })