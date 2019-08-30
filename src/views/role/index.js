import React, { Component } from 'react';
import { Card, Button, Table, Modal, message } from 'antd';
import { PAGE_SIZE } from '../../utils/constants';
import { reqRoles, reqAddRole, reqUpdateRole, reqDeleteRole } from '../../api';
import AddForm from './addform';
import AuthForm from './authform';
import sessionUtils from '../../utils/sessionUtils';
import formatDate from '../../utils/dateUtils';
import storageUtils from '../../utils/storageUtils';
import modal from '../../utils/modal';
import pagination from '../../utils/pagination';

export default class Role extends Component {
    state = {
        roles: [], // 所有角色的列表
        role: {}, // 选中的role
        isShowAdd: false, // 是否显示添加界面
        isShowAuth: false, // 是否显示设置权限界面
        currentPage: 1 //指定当前分页处于那一页
    };

    constructor(props) {
        super(props);

        this.auth = React.createRef();
    }

    initColumn = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'roleName',
                align: 'center'
            },
            {
                title: '创建时间',
                dataIndex: 'createTime',
                align: 'center'
            },
            {
                title: '授权时间',
                dataIndex: 'authTime',
                align: 'center',
                render: formatDate
            },
            {
                title: '授权人',
                dataIndex: 'authName',
                align: 'center'
            }
        ];
    };

    getRoles = async () => {
        const result = await reqRoles();
        if (result.status === 0) {
            const roles = result.data;
            this.setState({
                roles
            });
        }
    };
    //选中某行
    onRow = role => {
        return {
            onClick: event => {
                // 点击行
                if (role.roleName === '超级管理员') {
                    this.setState({
                        role: {}
                    });
                } else {
                    this.setState({
                        role
                    });
                }
            }
        };
    };

    /*
  添加/修改角色
   */
    addRole = () => {
        this.form.validateFields(async (error, values) => {
            if (!error) {
                // 收集数据
                const { roleName } = values;
                let authName = sessionUtils.getStaff().staff.username;
                this.setState({ isShowAdd: false });
                this.form.resetFields();
                //更新角色
                if (this.isUpdateRoleName) {
                    const { role, roles } = this.state;
                    role.roleName = roleName;
                    const result = await reqUpdateRole(role);
                    if (result.status === 0) {
                        for (let roleItem of roles) {
                            if (roleItem.roleId === role.roleId) {
                                roleItem.roleName = roleName;
                            }
                        }
                        this.setState(state => ({
                            roles: [...state.roles]
                        }));
                        this.isUpdateRoleName = false;
                    }
                } else {
                    //添加角色
                    let createTime = formatDate(Date.now());
                    const result = await reqAddRole({ roleName, createTime, authName, authTime: createTime });
                    // 根据结果提示/更新列表显示
                    if (result.status === 0) {
                        const role = result.data;
                        // 更新roles状态: 基于原本状态数据更新
                        let currentPage = pagination.showCurrentPage(this.state.roles.length + 1, PAGE_SIZE);
                        this.setState(state => ({
                            roles: [...state.roles, role],
                            role: { ...role },
                            currentPage
                        }));
                    } else {
                        message.error('添加角色失败: ' + result.msg);
                    }
                }
            } else {
                message.error(`${this.isUpdateRoleName ? '更新' : '添加'}操作失败`);
            }
        });
    };

    /*
      更新角色权限
       */
    updateRole = async () => {
        // 隐藏确认框
        this.setState({
            isShowAuth: false
        });
        const { role, roles } = this.state;
        // 得到最新的menus
        const menus = this.auth.current.getMenus();
        role.menus = menus.join('#');
        role.authTime = formatDate(Date.now());
        role.authName = sessionUtils.getStaff().staff.username;

        // 请求更新
        const result = await reqUpdateRole(role);
        if (result.status === 0) {
            // this.getRoles()
            // 如果当前更新的是自己角色的权限, 强制退出
            if (role.roleId === sessionUtils.getStaff().staff.roleId) {
                sessionUtils.removeUser();
                storageUtils.removeUser();
                this.props.history.replace('/login');
                message.success('当前用户角色权限成功');
            } else {
                message.success('设置角色权限成功');
                let roleIndex = roles.findIndex(item => item.roleId === role.roleId);
                roles[roleIndex] = role;
                this.setState({
                    roles: [...roles],
                    role: { ...role }
                });
            }
        }
    };
    //删除角色
    deleteRole = () => {
        const { role, roles } = this.state;
        let title = `确定删除角色${role.roleName}?`;
        modal.confirmModel(title, async () => {
            let result;
            result = await reqDeleteRole(role.roleId);
            if (result.status === 0) {
                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].roleId === role.roleId) {
                        roles.splice(i, 1);
                    }
                }
                this.setState(state => ({
                    roles: [...state.roles],
                    role: {}
                }));
            }
        });
    };
    //分页切换当前页面
    paginationChange = page => {
        this.setState({
            currentPage: page,
            role: {}
        });
    };
    //修改角色
    updateRoleName = () => {
        this.setState({
            isShowAdd: true
        });
        this.isUpdateRoleName = true;
    };
    componentWillMount() {
        this.initColumn();
    }
    //获得角色列表
    componentDidMount() {
        this.getRoles();
    }

    render() {
        const { roles, role, isShowAdd, isShowAuth, currentPage } = this.state;
        const modalTitle = !this.isUpdateRoleName ? '添加角色' : '修改角色';
        const title = (
            <span>
                <Button type="primary" onClick={() => this.setState({ isShowAdd: true })}>
                    创建角色
                </Button>{' '}
                &nbsp;&nbsp;
                <Button type="primary" disabled={!role.roleId} onClick={() => this.setState({ isShowAuth: true })}>
                    设置角色权限
                </Button>
                &nbsp;&nbsp;
                <Button type="primary" disabled={!role.roleId} onClick={this.updateRoleName}>
                    修改角色
                </Button>
                &nbsp;&nbsp;
                <Button type="danger" disabled={!role.roleId} onClick={this.deleteRole}>
                    删除
                </Button>
            </span>
        );

        return (
            <Card title={title} >
                <Table
                    bordered
                    rowKey="roleId"
                    dataSource={roles}
                    columns={this.columns}
                    pagination={{
                        size: 'small',
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true,
                        showSizeChanger: true,
                        current: currentPage,
                        pageSizeOptions: ['' + PAGE_SIZE, '' + PAGE_SIZE * 2, '' + PAGE_SIZE * 3, '' + PAGE_SIZE * 4],
                        showTotal: pagination.showTotal,
                        onChange: this.paginationChange
                    }}
                    rowSelection={{
                        type: 'radio',
                        selectedRowKeys: [role.roleId],
                        getCheckboxProps: record => ({
                            disabled: record.roleName === '超级管理员',
                            name: record.roleName
                        }),
                        onSelect: role => {
                            // 选择某个radio时回调
                            this.setState({
                                role
                            });
                        }
                    }}
                    onRow={this.onRow}
                />

                <Modal
                    title={modalTitle}
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={() => {
                        this.setState({ isShowAdd: false });
                        this.form.resetFields();
                        this.isUpdateRoleName = false;
                    }}
                >
                    <AddForm
                        setForm={form => (this.form = form)}
                        roleName={role.roleName}
                        isUpdateRoleName={this.isUpdateRoleName}
                    />
                </Modal>

                <Modal
                    title="设置角色权限"
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={() => {
                        this.setState({ isShowAuth: false });
                    }}
                >
                    <AuthForm ref={this.auth} role={role} />
                </Modal>
            </Card>
        );
    }
}
