import React, { Component } from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import { Layout, Avatar, Upload, message } from 'antd';
import RouteWithSubRoutes from '../../router/RouteWithSubRoutes';
import Nav from '../../components/nav';
import Header from '../../components/header';
import sessionUtils from '../../utils/sessionUtils';
import storageUtils from '../../utils/storageUtils';
import './admin.less';
import NotFound from '../not-found/not-found';
import { IMG_URL } from '../../utils/constants';
import { reqUpdateAvatar, reqDeleteFile } from '../../api';
const { Content, Sider } = Layout;

export default class Admin extends Component {
    state = {
        collapsed: false,
        avatarUrl: sessionUtils.getStaff().staff.avatar //头像数据
    };

    onCollapse = collapsed => {
        this.setState({ collapsed });
    };

    beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('请选择图片文件');
        }
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            message.error('图片不能超过10M');
        }
        return isJpgOrPng && isLt10M;
    }

    uploadAvatar = async info => {
        if (info.file.status === 'done') {
            let res = info.file.response;
            this.setState({avatarUrl: res.data.fileName});
            if(res.status === 0){
                const {staffId,avatar } = sessionUtils.getStaff().staff;
                let avatarName = res.data.fileName;
                await reqDeleteFile({ fileName: avatar });
                let result = await reqUpdateAvatar({staffId,avatar:avatarName });
                if(result.status === 0){
                    sessionUtils.getStaff().staff.avatar = avatarName;
                    storageUtils.getStaff().staff.avatar = avatarName;
                    message.success('修改头像成功!');
                }else {
                    message.success('修改头像失败!');
                }
            }
        }
    };
    render() {
        const user = sessionUtils.getStaff();
        // 如果没有登录跳转到登录界面
        if (JSON.stringify(user) === '{}') {
            // 自动跳转到登陆(在render()中)
            return <Redirect to="/login" />;
        }
        let { routes } = this.props;
        let menus = sessionUtils.getStaff().menus;
        let roleRoutes = [];
        //更据相应角色权限注册路由
        for (let route of routes) {
            for (let path of menus) {
                if (route.path === path) {
                    roleRoutes.push(route);
                }
            }
        }
        const { avatarUrl } = this.state;
        return (
            <Layout className="mall-layout">
                <Sider
                    breakpoint="lg"
                    collapsible
                    collapsed={this.state.collapsed}
                    onCollapse={this.onCollapse}
                    onBreakpoint={broken => {}}
                    className="sider"
                >
                    <div className="logo">
                        <Upload
                            action="/product/img/upload"
                            accept="image/*"
                            name="image"
                            showUploadList={false}
                            beforeUpload={this.beforeUpload}
                            onChange={this.uploadAvatar}
                        >
                            <Avatar size={64} src={IMG_URL + avatarUrl} />
                        </Upload>
                    </div>
                    <Nav />
                </Sider>
                <Layout className="content-layout">
                    <Header />
                    <Content className="content-body">
                        <Switch>
                            <Redirect exact from="/" to="/home" />
                            {roleRoutes.map((route, key) => (
                                <RouteWithSubRoutes {...route} key={key} />
                            ))}
                            <Route component={NotFound} />
                        </Switch>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}
