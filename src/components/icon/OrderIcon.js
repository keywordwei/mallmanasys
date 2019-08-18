//自定义订单icon
import React from 'react';
import { Icon } from 'antd';
const OrderSvg = () => (
    <svg
        t="1564895785134"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="5434"
        width="200"
        height="200"
    >
        <path
            d="M315.9 391.6h174.2v84H315.9zM315.9 228.1h396.9v84H315.9z"
            p-id="5435"
            fill="#ffffff"
        />
        <path
            d="M902.2 958.5H126.1v-895h776.1v324.2L499.4 801.1 321.9 623.6l59.4-59.4 117.4 117.3 319.5-328v-206H210.1v727h608.1V568.6h84z"
            p-id="5436"
            fill="#ffffff"
        />
    </svg>
);
const OrderIcon = (props) => (
    <Icon component={OrderSvg}></Icon>
)

export default OrderIcon;
