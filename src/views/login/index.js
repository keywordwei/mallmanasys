import React from 'react';
import './index.less';
import { Form, Icon, Input, Button, message } from 'antd';
import { reqLogin } from '../../api';
import { Redirect } from 'react-router-dom';
import storageUtils from '../../utils/storageUtils';
import sessionUtils from '../../utils/sessionUtils';

const Login = props => {
    let handleSubmit = e => {
        e.preventDefault();
        props.form.validateFields(async (err, values) => {
            const { username, password } = values;
            if (!err) {
                let user = await reqLogin(username, password);
                if (user.status === 0) {
                    //保存到localstorage, 浏览器再次启动访问该web站点获取相应用户信息
                    storageUtils.saveStaff(user.data);
                    //session保持web站点浏览器未关闭时的用户信息
                    sessionUtils.saveStaff(user.data);
                    props.history.replace('/');
                } else {
                    error(user.msg, 2);
                }
            }
        });
    };

    //登录失败提示信息
    const error = (errMsg, duration) => {
        message.error(errMsg, duration);
    };
    //validator验证密码框输入合法性
    let validatePassword = async (rule, value, callback) => {
        try {
            if (!value) {
                throw new Error('密码不能为空');
            } else if (!/^[\w@]{4,10}$/.test(value)) {
                throw new Error('密码仅含数字字母_@,4-10位)');
            }
        } catch (err) {
            callback(err);
        }
    };

    const { getFieldDecorator } = props.form;
    if (sessionUtils.getStaff().staff) {
        return <Redirect to="/" />;
    } else {
        return (
            <div className="login clearmargin">
                <div className="mallmanasys-info">
                    <h1>二手商城管理系统</h1>
                    <p className="mallmanasys-alias">Second-hand mall management system</p>
                    <p className="mallmanasys-author">— 魏琴</p>
                </div>
                <Form onSubmit={handleSubmit} className="login-form">
                    <Form.Item>
                        {getFieldDecorator('username', {
                            rules: [
                                {
                                    required: true,
                                    message: '用户名不能为空'
                                },
                                {
                                    pattern: /^[\u4E00-\u9FA5\w@]+$/,
                                    message: '用户名仅含数字字母中文字符_@'
                                }
                            ],
                            initialValue: 'root'
                        })(
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="Username"
                            />
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [
                                {
                                    validator: validatePassword
                                }
                            ],
                            initialValue: 'root'
                        })(
                            <Input.Password
                                placeholder="input password"
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            />
                        )}
                    </Form.Item>
                    <Form.Item className="login-btn">
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
};
const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(Login);
export default WrappedNormalLoginForm;
