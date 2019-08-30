import React, { Component } from 'react';
import { Card } from 'antd'
export default class Adress extends Component {
    renderMap = () => {
        this.map = new window.BMap.Map('address'); // 创建Map实例
        this.map.centerAndZoom(new window.BMap.Point(104.2064182883,30.5668503008), 11); // 初始化地图,设置中心点坐标和地图级别
        //添加地图类型控件
        this.map.addControl(
            new window.BMap.MapTypeControl({
                mapTypes: [window.BMAP_NORMAL_MAP, window.BMAP_HYBRID_MAP]
            })
        );
 
        var myCity = new window.BMap.LocalCity();
	    myCity.get(this.myAddress);
        this.map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
    };
    //更据ip定位
    myAddress = (result) => {
		var cityName = result.name;
		this.map.setCenter(cityName);
	}
    componentDidMount() {
        this.renderMap();
    }
    render() {
        return (
            <Card>
                <div id="address" style={{width: '100%', height:'550px'}}></div>
            </Card>
        );
    }
}
