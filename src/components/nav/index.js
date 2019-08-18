import React, { Component } from 'react';
import menuList from '../../config/menulist';
import { Menu, Icon } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import sessionUtils from '../../utils/sessionUtils';
import './nav.less';
const { SubMenu } = Menu;
class siderNav extends Component {
    onChange = str => {
        this.setState({ str });
    };

    //判断当前登陆用户对某个菜单是否有权限
    hasAuth = item => {
        const { key } = item;
        //当前用户菜单项
        const menus = sessionUtils.getStaff().menus;
        //当前用户权限存在则初始相应菜单项
        if (menus.indexOf(key) !== -1) {
            return true;
        }
        return false;
    };
    // 递归生成菜单
    // getMenuNodes = menu => {
    //     return menu.map(item => {
    //         if (item.children) {
    //             return (
    //                 <SubMenu
    //                     key={item.key}
    //                     title={
    //                         <span>
    //                             <Icon type={item.icon} />
    //                             <span>{item.title}</span>
    //                         </span>
    //                     }
    //                 >
    //                     {this.getMenuNodes(item.children)}
    //                 </SubMenu>
    //             );
    //         } else {
    //             return (
    //                 <Menu.Item key={item.key}>
    //                     <Icon type={item.icon} />
    //                    <span> {currItem.title}</span>
    //                 </Menu.Item>
    //             );
    //         }
    //     });
    // };
    //reduce递归生成menu
    getMenuNodes = menu => {
        const { pathname } = this.props.location;
        return menu.reduce((preItem, currItem) => {
            if (this.hasAuth(currItem)) {
                if (currItem.children) {
                    const cItem = currItem.children.find(value => pathname.indexOf(value.key) === 0);
                    if (cItem) {
                        this.openKey = currItem.key;
                    }
                    preItem.push(
                        <SubMenu
                            key={currItem.key}
                            title={
                                <span>
                                    <Icon type={currItem.icon} />
                                    <span>{currItem.title}</span>
                                </span>
                            }
                        >
                            {this.getMenuNodes(currItem.children)}
                        </SubMenu>
                    );
                } else {
                    preItem.push(
                        <Menu.Item key={currItem.key}>
                            <Link to={currItem.key}>
                                <Icon type={currItem.icon} />
                                <span> {currItem.title}</span>
                            </Link>
                        </Menu.Item>
                    );
                }
            }
            return preItem;
        }, []);
    };
    
    componentWillMount() {
        this.menuNodes = this.getMenuNodes(menuList);
    }
    render() {
        let { pathname } = this.props.location;
        if (pathname.indexOf('/products/product') === 0) {
            pathname = '/products/product';
        }
        const openKey = this.openKey;
        return (
            <div>
                <Menu theme="dark" mode="inline" className="nav" defaultOpenKeys={[openKey]} selectedKeys={[pathname]}>
                    {this.menuNodes}
                </Menu>
            </div>
        );
    }
}
export default withRouter(siderNav);
