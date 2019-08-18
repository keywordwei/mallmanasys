import axios from 'axios';
import { message } from 'antd';
import { GET } from './method';

const ajax = (url, data = {}, type = GET) => {
    let promise;
    return new Promise((resolve, reject) => {
        if (type === GET) {
            promise = axios.get(url, {
                params: data
            });
        } else {
            promise = axios.post(url, data);
        }
        promise
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                message.error('请求出错了:' + err.message);
            });
    });
};
export default ajax;
