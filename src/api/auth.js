import request from '@/utils/request'
import qs from 'qs'

export const login = (username, password) =>
    request({
        url: '/auth/login',
        method: 'post',
        header:{'Content-Type':'application/json'},
        data: {
            "username":username,
            "password":password
        }
    })