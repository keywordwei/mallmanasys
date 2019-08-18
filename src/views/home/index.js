import React, { Component } from 'react';
import { Icon, Card, message } from 'antd';
import { reqAllCount } from '../../api';
import './home.less';

export default class Home extends Component {
    state = {
        productCount: 0,
        staffCount: 0,
        categoryCount: 0
    };
    getCount = async () => {
        let res = await reqAllCount();
        if (res.status === 0) {
            this.setState({
                productCount: res.data.productCount,
                staffCount: res.data.staffCount,
                categoryCount: res.data.categoryCount
            })
        } else {
            message.error(res.msg);
        }
    };
    componentDidMount() {
        this.getCount();
    }
    goProduct = () => {
        this.props.history.push('/products/product');
    }
    goStaff = () => {
        this.props.history.push('/user');        
    }
    goCategory = () => {
        this.props.history.push('/products/category');                
    }
    render() {
        const gridStyle = {
            width: '25%',
            textAlign: 'center',
            height: '160px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
        };
        const cardBodyStyle = {
            display: 'flex',
            justifyContent: 'space-between',
            backgroundColor: '#f0f2f5'
        }
        const { productCount, staffCount, categoryCount } = this.state;
        return (
            <Card className="home" bodyStyle={cardBodyStyle} bordered={false}>
                <Card.Grid style={gridStyle} className="grid" onClick={this.goProduct}>
                    <span>
                        <p className="count">{productCount}</p>
                        <p className="desc">
                            <Icon type="shop" />
                            &nbsp;&nbsp;
                            <span>商品总数</span>
                        </p>
                    </span>
                </Card.Grid>
                <Card.Grid style={gridStyle} className="grid" onClick={this.goStaff}>
                    <span>
                        <p className="count">{staffCount}</p>
                        <p className="desc">
                            <Icon type="user" />
                            &nbsp;&nbsp;
                            <span>员工总数</span>
                        </p>
                    </span>
                </Card.Grid>
                <Card.Grid style={gridStyle} className="grid" onClick={this.goCategory}>
                    <span>
                        <p className="count">{categoryCount}</p>
                        <p className="desc">
                            <Icon type="inbox" />
                            &nbsp;&nbsp;
                            <span>分类总数</span>
                        </p>
                    </span>
                </Card.Grid>
            </Card>
        );
    }
}
