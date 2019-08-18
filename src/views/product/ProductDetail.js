import React, { Component } from 'react';
import { Card, List, Icon, Avatar, Modal } from 'antd';
import LinkButton from '../../components/linkbutton';
import { IMG_URL } from '../../utils/constants';
import './productdetail.less';
import { reqUserMsg } from '../../api/index';

const Item = List.Item;

export default class ProductDetail extends Component {
    state = {
        userMsg: {}, //发布商品的用户信息
        previewVisible: false, //图片大图是否可见
        previewImage: '' //modal对话框显示的图片名
    };
    //获取发布商品用户的信息
    showBigImg = imgsrc => {
        this.setState({ previewVisible: true, previewImage: IMG_URL + imgsrc });
    };
    getPublishGoodsUserMsg = async goods_by_user_id => {
        let result = await reqUserMsg({ goods_by_user_id });
        if (result.status === 0) {
            this.setState({
                userMsg: result.data
            });
        }
    };
    handleCancel = () => {
        this.setState({
            previewVisible: false
        });
    };
    componentWillMount() {
        //路由错误处理
        const routerState = this.props.location.state;
        if(!routerState){
            this.props.history.goBack();
        }
    }
    componentDidMount() {
        const { goods_by_user_id } = this.props.location.state.product;
        this.getPublishGoodsUserMsg(goods_by_user_id);
    }

    render() {
        const { user_name, user_status, user_img } = this.state.userMsg;
        const { previewVisible, previewImage } = this.state;
        const {
            goods_title,
            goods_status,
            goods_publish_time,
            goods_price,
            goods_img,
            goods_hot,
            goods_details,
            goods_description,
            goods_contact_qq,
            goods_contact_phone,
            goods_category_name
        } = this.props.location.state.product;
        const goodsStatus = goods_status ? '下架' : '在售';
        const userStatus = user_status ? '未认证' : '已认证';
        const productImgs = goods_img ? goods_img.split('#') : [];
        const gridStyle = {
            width: '33.3%',
            textAlign: 'center',
            padding: '10px'
        };
        const productGridStyle = {
            width: '50%'
        };
        const title = (
            <span>
                <LinkButton>
                    <Icon
                        type="arrow-left"
                        style={{ marginRight: 10, fontSize: 20, verticalAlign: 'center' }}
                        onClick={() => this.props.history.goBack()}
                    />
                </LinkButton>

                <span>商品详情</span>
            </span>
        );

        return (
            <Card title={title} bordered={false} className="product">
                <Card>
                    <Card.Grid style={productGridStyle}>
                        {' '}
                        <List size="small" split={false}>
                            <Item>
                                <p className="goods-showtitle">{goods_title}</p>
                            </Item>
                            <Item>
                                <div className="goods-showprice">
                                    &nbsp;&nbsp;&nbsp;&nbsp;￥<span className="goods-showpircenum">{goods_price}</span>
                                </div>
                            </Item>
                            <Item>
                                <Item.Meta
                                    avatar={<Avatar src={IMG_URL + user_img} />}
                                    title={user_name}
                                    description={userStatus}
                                />
                            </Item>
                            <Item>商品描述：&nbsp;&nbsp;{goods_description}</Item>
                            <Item>商品分类：&nbsp;&nbsp;{goods_category_name}</Item>
                            <Item>联系电话：&nbsp;&nbsp;{goods_contact_phone}</Item>
                            <Item>联系QQ： &nbsp;&nbsp;&nbsp;{goods_contact_qq}</Item>
                            <Item>发布时间：&nbsp;&nbsp;{goods_publish_time}</Item>
                            <Item>点击量： &nbsp;&nbsp;&nbsp;&nbsp;{goods_hot}</Item>
                            <Item>商品状态：&nbsp;&nbsp;{goodsStatus}</Item>
                        </List>
                    </Card.Grid>
                    <Card.Grid style={productGridStyle}>
                        商品图片：
                        <br />
                        <Card className="productDetailImg">
                            {productImgs.map((imgsrc, key) => (
                                <Card.Grid style={gridStyle} key={key}>
                                    <img
                                        src={IMG_URL + imgsrc}
                                        key={key}
                                        alt="商品图片"
                                        onClick={() => {
                                            this.showBigImg(imgsrc);
                                        }}
                                    />
                                </Card.Grid>
                            ))}
                        </Card>
                        商品详情：
                        <Card bordered={false}>
                            <span dangerouslySetInnerHTML={{ __html: goods_details }} className="detail">
                            </span>
                        </Card>
                        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                            <img alt="商品大图" style={{ width: '100%' }} src={previewImage} />
                        </Modal>
                    </Card.Grid>
                </Card>
            </Card>
        );
    }
}
