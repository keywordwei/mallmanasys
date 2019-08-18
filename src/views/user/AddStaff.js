import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Select, Input } from 'antd';
const Item = Form.Item;
const Option = Select.Option;
/*
添加职员
 */
class AddStaff extends PureComponent {
    static propTypes = {
        setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
        roles: PropTypes.array.isRequired
    };

    componentWillMount() {
        this.props.setForm(this.props.form);
    }

    render() {
        const { roles } = this.props;
        const { getFieldDecorator } = this.props.form;
        // 指定Item布局的配置对象
        const formItemLayout = {
            labelCol: { span: 4 }, // 左侧label的宽度
            wrapperCol: { span: 15 } // 右侧包裹的宽度
        };

        return (
            <Form {...formItemLayout}>
                <Item label="用户名">
                    {getFieldDecorator('username', {
                        rules: [
                            { required: true, message: '用户名不能为空' },
                            {
                                pattern: /^[\u4E00-\u9FA5\w@]+$/,
                                message: '用户名仅含数字字母中文字符_@'
                            }
                        ]
                    })(<Input placeholder="请输入用户名" />)}
                </Item>

                <Item label="密码">
                    {getFieldDecorator('password', {
                        validateTrigger: 'onBlur',
                        rules: [
                            { required: true, message: '密码不能为空' },
                            {
                                pattern: /^[\w@]{4,10}$/,
                                message: '密码仅含数字字母_@,4-10位'
                            }
                        ]
                    })(<Input type="password" placeholder="请输入密码" />)}
                </Item>

                <Item label="手机号">
                    {getFieldDecorator('phone', {
                        validateTrigger: 'onBlur',
                        rules: [
                            { required: true, message: '手机号不能为空' },
                            {
                                pattern: /^1[3456789]\d{9}$/,
                                message: '请输入正确的手机号码'
                            }
                        ]
                    })(<Input placeholder="请输入手机号"/>)}
                </Item>
                <Item label="邮箱">
                    {getFieldDecorator('email', {
                        validateTrigger: 'onBlur',
                        rules: [
                            { required: true, message: '邮箱不能为空' },
                            {
                                pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                                message: '请输入正确的邮箱地址'
                            }
                        ]
                    })(<Input placeholder="请输入邮箱" />)}
                </Item>

                <Item label="角色">
                    {getFieldDecorator('roleId', {
                        initialValue: roles[0].roleId
                    })(
                        <Select>
                            {roles.map(role => (
                                <Option key={role.roleId} value={role.roleId}>
                                    {role.roleName}
                                </Option>
                            ))}
                        </Select>
                    )}
                </Item>
            </Form>
        );
    }
}

export default Form.create()(AddStaff);
