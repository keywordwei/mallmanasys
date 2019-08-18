import React from 'react';
import { Table, Input, Popconfirm, Form, Divider, Card, Button, message, Modal, Select } from 'antd';
import LinkButton from '../../components/linkbutton';
import { reqStaffs, reqRoles, reqRegister, reqDeleteStaff, reqUpdateStaff } from '../../api';
import AddStaff from './AddStaff';
import dateFormate from '../../utils/dateUtils';
import md5 from 'blueimp-md5';
import './staff.less';
const EditableContext = React.createContext();

class UserCell extends React.Component {
    getInput = () => {
        const { roles, inputType } = this.props;

        if (inputType === 'select') {
            return (
                <Select style={{ width: '100%' }}>
                    {roles.map(role => (
                        <Select.Option key={role.roleId} value={String(role.roleId)}>
                            {role.roleName}
                        </Select.Option>
                    ))}
                </Select>
            );
        } else if (inputType === 'password') {
            return <Input type="password" />;
        } else {
            return <Input />;
        }
    };

    renderCell = ({ getFieldDecorator }) => {
        const { editing, dataIndex, title, inputType, record, index, children, ...restProps } = this.props;
        const usernameValidate =
            dataIndex === 'username'
                ? {
                      pattern: /^[\u4E00-\u9FA5\w@]+$/,
                      message: '用户名仅含数字字母中文字符_@'
                  }
                : {};
        const phoneValidate =
            dataIndex === 'phone'
                ? {
                      pattern: /^1[3456789]\d{9}$/,
                      message: '请输入正确的手机号码'
                  }
                : {};
        const emailValidate =
            dataIndex === 'email'
                ? {
                      pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                      message: '请输入正确的邮箱地址'
                  }
                : {};
        const passwordValidate =
            dataIndex === 'password'
                ? {
                      pattern: /^[\w@]{4,10}$/,
                      message: '密码仅含数字字母_@,4-10位'
                  }
                : {};
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item style={{ margin: 0 }}>
                        {getFieldDecorator(dataIndex, {
                            validateTrigger: 'onBlur',
                            rules: [
                                {
                                    required: true,
                                    message: `${title}不能为空!`
                                },
                                usernameValidate,
                                phoneValidate,
                                emailValidate,
                                passwordValidate
                            ],
                            initialValue: dataIndex !== 'roleId' ? record[dataIndex] : String(record[dataIndex])
                        })(this.getInput())}
                    </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };

    render() {
        return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
    }
}

class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            staffs: [], //所有员工
            editingKey: '', //当前编辑行
            isShowAddStaff: false, //显示添加用户
            roles: [] //所有角色列表
        };
    }

    initColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username',
                editable: true,
                align: 'center'
            },
            {
                title: '电话',
                dataIndex: 'phone',
                editable: true,
                align: 'center'
            },
            {
                title: '邮箱',
                dataIndex: 'email',
                editable: true,
                align: 'center'
            },
            // {
            //     title: '注册时间',
            //     dataIndex: 'createTime',
            //     align: 'center'
            // },
            {
                title: '密码',
                dataIndex: 'password',
                align: 'center'
            },
            {
                title: '所属角色',
                dataIndex: 'roleId',
                editable: true,
                align: 'center',
                width: '12%',
                render: roleId => {
                    for (let role of this.state.roles) {
                        if (String(role.roleId) === String(roleId)) {
                            return role.roleName;
                        }
                    }
                }
            },
            {
                title: '操作',
                dataIndex: 'operation',
                align: 'center',
                width: '11%',
                render: (text, record) => {
                    const { editingKey } = this.state;
                    const editable = this.isEditing(record);
                    const disablesStyle =
                        editingKey === ''
                            ? {}
                            : {
                                  color: '#bfbfbf'
                              };
                    return editable ? (
                        <span>
                            <EditableContext.Consumer>
                                {form => (
                                    <LinkButton onClick={() => this.updateStaff(form, record.staffId)}>保存</LinkButton>
                                )}
                            </EditableContext.Consumer>
                            <Divider type="vertical" />
                            <Popconfirm title={`确定取消编辑吗?`} onConfirm={() => this.cancel(record.staffId)}>
                                <LinkButton>取消</LinkButton>
                            </Popconfirm>
                        </span>
                    ) : record.username === 'root' ? (
                        ''
                    ) : (
                        <span>
                            <LinkButton style={disablesStyle} onClick={() => this.edit(record.staffId)}>
                                编辑
                            </LinkButton>
                            <Divider type="vertical" />
                            <Popconfirm
                                title={`确定删除职员${record.username}吗`}
                                onConfirm={() => {
                                    this.deleteStaff(record.staffId);
                                }}
                            >
                                <LinkButton style={disablesStyle}>删除</LinkButton>
                            </Popconfirm>
                        </span>
                    );
                }
            }
        ];
    };
    //获取所有职员信息
    getStaffs = async () => {
        let result = await reqStaffs();
        if (result.status === 0) {
            this.setState({
                staffs: result.data
            });
        }
    };
    //获取所有角色信息
    getRoles = async () => {
        let result = await reqRoles();
        if (result.status === 0) {
            this.setState({
                roles: result.data
            });
        }
    };
    //显示添加职员对话框
    showAddStaff = () => {
        this.setState({
            isShowAddStaff: true
        });
    };
    //添加职员
    addStaff = () => {
        this.form.validateFields(async (error, values) => {
            if (!error) {
                let createTime = dateFormate(Date.now());
                let result = await reqRegister({ ...values, createTime });
                if (result.status === 0) {
                    this.setState({ isShowAddStaff: false });
                    this.form.resetFields();
                    message.success(`添加职员${values.username}成功`);
                    this.getStaffs();
                } else {
                    message.error(result.msg);
                }
            }
        });
    };
    //删除职员
    deleteStaff = async staffId => {
        let result = await reqDeleteStaff({ staffId });
        if (result.status === 0) {
            this.getStaffs();
        } else {
            message.error(result.message);
        }
    };
    //是否处于编辑状态
    isEditing = record => record.staffId === this.state.editingKey;
    //取消编辑状态
    cancel = () => {
        this.setState({ editingKey: '' });
    };
    //修改职员信息
    updateStaff = (form, staffId) => {
        form.validateFields(async (error, staff) => {
            if (error) {
                return;
            }
            const newStaffs = [...this.state.staffs];
            const staffRowIndex = newStaffs.findIndex(item => staffId === item.staffId);
            if (staffRowIndex > -1) {
                let result = await reqUpdateStaff({ staff: { ...staff }, staffId });
                if (result.status === 0) {
                    const item = newStaffs[staffRowIndex];
                    staff.password = md5(staff.password);
                    newStaffs.splice(staffRowIndex, 1, {
                        ...item,
                        ...staff
                    });
                    this.setState({ staffs: newStaffs, editingKey: '' });
                    message.success(result.msg);
                } else {
                    message.error(result.msg);
                }
            } else {
                //addRow添加一行数据
                newStaffs.push(staff);
                this.setState({ newStaffs: staff, editingKey: '' });
            }
        });
    };
    //进入编辑职员状态
    edit(staffId) {
        this.setState({ editingKey: staffId });
    }
    componentWillMount() {
        this.initColumns();
    }
    componentDidMount() {
        this.getStaffs();
        this.getRoles();
    }

    render() {
        //默认不显示root用户不可编辑删除修改
        const { staffs, isShowAddStaff, roles } = this.state;
        const title = (
            <span>
                <Button type="primary" onClick={this.showAddStaff}>
                    创建职员
                </Button>
                &nbsp;&nbsp;
            </span>
        );
        const components = {
            body: {
                cell: UserCell
            }
        };

        const columns = this.columns.map(col => {
            if (!col.editable) {
                return col;
            }
            let inputType;
            if (col.dataIndex === 'roleId') {
                inputType = 'select';
            } else if (col.dataIndex === 'password') {
                inputType = 'password';
            } else {
                inputType = 'text';
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    roles: [...roles],
                    inputType: inputType,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record)
                })
            };
        });

        return (
            <Card title={title} style={{minWidth: '1042px'}}>
                <EditableContext.Provider value={this.props.form}>
                    <Table
                        rowKey="staffId"
                        components={components}
                        bordered
                        dataSource={staffs}
                        columns={columns}
                        rowClassName="editable-row"
                        pagination={{
                            onChange: this.cancel
                        }}
                    />
                </EditableContext.Provider>
                <Modal
                    title="添加职员"
                    visible={isShowAddStaff}
                    onOk={this.addStaff}
                    onCancel={() => {
                        this.form.resetFields();
                        this.setState({ isShowAddStaff: false });
                    }}
                >
                    <AddStaff setForm={form => (this.form = form)} roles={roles} />
                </Modal>
            </Card>
        );
    }
}
const UserForm = Form.create()(User);
export default UserForm;
