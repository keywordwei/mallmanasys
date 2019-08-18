import React from 'react'
import { Modal } from 'antd';
const { confirm, info } = Modal;

//未选中某行数据提示信息
const showUnSelectRowinfo = () => {
    info({
        title: '温馨提示',
        content: <div>请先选择某行数据</div>,
        okText: '关闭',
        width: 330
    });
};
//确认对话框
const confirmModel = (
    title,
    callback,
    okType = 'primary',
    okText = '确定',
    cancelText = '取消',
    width = 260
) => {
    confirm({
        title: title,
        okText: okText,
        okType: okType,
        cancelText: cancelText,
        className: 'logoutconfirm',
        width: width,
        onOk() {
            callback();
        }
    });
};
export default {
    showUnSelectRowinfo,
    confirmModel
};
