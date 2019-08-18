import React, { Component } from 'react';
import LinkButton from '../linkbutton';
import './header.less';
import { reqWheater } from '../../api';
import sessionUtils from '../../utils/sessionUtils';
import storageUtils from '../../utils/storageUtils';
import formatDate from '../../utils/dateUtils';
import { withRouter } from 'react-router-dom';
import menuList from '../../config/menulist';
import { Modal } from 'antd';
const { confirm } = Modal;

class Header extends Component {
    state = {
        dayPictureUrl: '',
        weather: '',
        currentTime: formatDate(Date.now()),
    };
    //退出登录
    logOut = () => {
        const { history } = this.props;
        confirm({
            title: '是否确定退出系统?',
            okText: '确定',
            okType: 'primary',
            cancelText: '取消',
            className: 'logoutconfirm',
            width: 280,
            onOk() {
                sessionUtils.removeStaff();
                storageUtils.removeStaff();
                history.replace('/login');
            }
        });
    };

    do_something = (a, b) => {
        console.log(a, b);
    };

    getCityWeather = () => {
        let myCity = new window.BMap.LocalCity();
        myCity.get(async (city) => {
            const { dayPictureUrl, weather } = await reqWheater(city.name);
            this.setState({
                dayPictureUrl,
                weather
            });
        });
    };

    getTime = () => {
        let time = Date.now();
        this.setState({
            currentTime: formatDate(time)
        });
    };

    //递归menu获取当前路由的标题名
    getTitle = menulist => {
        let titleObj = {
            title: '',
            isFindTitle: false
        };
        const { pathname } = this.props.location;
        menulist.forEach(item => {
            if (item.key === pathname) {
                titleObj.title = item.title;
                titleObj.isFindTitle = true;
            } else if (item.children && !titleObj.isFindTitle) {
                // debugger
                titleObj = this.getTitle(item.children);
            }
        });
        return titleObj;
    };

    componentDidMount() {
        this.intervalId = setInterval(() => {
            this.getTime();
        }, 1000);
        this.getCityWeather();
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }
    render() {
        let titleObj = this.getTitle(menuList);
        const {pathname} = this.props.location;
        if(pathname.indexOf('/products/product') === 0){
            titleObj = {
                isFindTitle: true,
                title: '商品管理'
            }
        }
        const { currentTime, dayPictureUrl, weather} = this.state;
        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎,</span>
                    <span>{sessionUtils.getStaff().staff.username}</span>
                    <LinkButton onClick={this.logOut}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{titleObj.title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt="weather" />
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Header);
