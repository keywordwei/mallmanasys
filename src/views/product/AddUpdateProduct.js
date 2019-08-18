import React, { Component } from 'react';
import { Card, Icon, Form, Input, Cascader, Button, InputNumber, message } from 'antd';
import LinkButton from '../../components/linkbutton';
import UploadPicture from './UploadPicture';
import RichText from './RichText';
import { reqFirstLevelCategorys, reqSecondaryCategorys, reqAddProduct, reqUpdateProduct , reqSecondaryId} from '../../api';
import sessionUtils from '../../utils/sessionUtils';
import { dateFomatter } from '../../utils/dateUtils';
const { Item } = Form;

class AddUpdateProduct extends Component {
    state = {
        categoryOptions: [], //商品分类级联下拉框
        secondaryId:''
    };
    constructor(props) {
        super(props);
        // 创建用来保存ref标识的标签对象的容器
        this.uploadImg = React.createRef();
        this.productDetailRT = React.createRef();
    }
    //获取一级产品分类
    getCategorys = async () => {
        const result = await reqFirstLevelCategorys();
        if (result.status === 0) {
            this.initOptions(result.data);
        }
    };
    //初始化一级分类级联框
    initOptions = async firstLevelCategorys => {
        const categoryOptions = firstLevelCategorys.map(category => ({
            value: category.id,
            label: category.name,
            isLeaf: false
        }));
        const { isUpdate, product } = this;
        let secondaryCategoryOptions;
        if(isUpdate){
            let result = await reqSecondaryCategorys(product.goods_category_id);
            if (result.status === 0) {
                let secondaryCategorys = result.data;
                secondaryCategoryOptions = secondaryCategorys.map(category => ({
                    value: category.id,
                    label: category.name,
                    isLeaf: true
                }));
            }
            const targetOption = categoryOptions.find( option => 
                option.value === product.goods_category_id
            )
            targetOption.children = secondaryCategoryOptions;
            this.getSecondaryCategoryId();
        }
        this.setState({
            categoryOptions
        });
    };
    //获得二级分类ID
    getSecondaryCategoryId = async () => {
        if(this.isUpdate){
            const { goods_category_id, goods_category_name} = this.product;
            let result = await reqSecondaryId({goods_category_id, goods_category_name});
            if(result.status === 0){
                let secondaryId = result.data;
                this.setState({secondaryId})
            }
        }
    }
    onChange = (value, selectedOptions) => {
        console.log(value, selectedOptions);
    };
    //根据一级分类初始化二级分类级联框 selectedOptions： 当前选中的级联框, 是一个含有选中选项的对象数组 [{value: 'xxx', label:'xx', isLeaf: 'xx'}]
    loadSecondaryCategoryData = async selectedOptions => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        let result = await reqSecondaryCategorys(targetOption.value);
        if (result.status === 0) {
            let secondaryCategorys = result.data;
            targetOption.children = secondaryCategorys.map(category => ({
                value: category.id,
                label: category.name,
                isLeaf: true
            }));
        }
        this.setState({
            options: [...this.state.categoryOptions]
        });
    };

    //提交产品
    submitProduct = e => {
        e.preventDefault();
        this.props.form.validateFields(async (error, values) => {
            const imgs = this.uploadImg.current.getImgs();
            const goods_details = this.productDetailRT.current.getProductDetail();
            if (JSON.stringify(imgs) === '[]') {
                message.error('商品图片不能为空');
                return;
            }
            if (goods_details === '<p></p>') {
                message.error('商品详情不能为空');
                return;
            }
            if (!error) {
                const { categoryOptions } = this.state;
                let goods_img = imgs.join('#');
                let goods_category_id = values.goods_category_id[0];
                let goods_category_name;
                let goods_first_categoryName;
                for (let selectOption of categoryOptions) {
                    if (selectOption.value === goods_category_id) {
                        goods_first_categoryName = selectOption.label;
                        for (let childOption of selectOption.children) {
                            if (childOption.value === values.goods_category_id[1]) {
                                goods_category_name = childOption.label;
                            }
                        }
                    }
                }
                let result ;
                if(this.isUpdate){
                    let goods_id = this.product.goods_id;
                    result = await reqUpdateProduct({
                        ...values,
                        goods_details,
                        goods_img,
                        goods_category_id,
                        goods_category_name,
                        goods_id,
                        goods_first_categoryName
                    });
                }else{
                    let goods_by_user_id = sessionUtils.getStaff().staff.staffId;
                    let goods_hot = 0;
                    let goods_status = 0;
                    let goods_publish_time = Number(dateFomatter(Date.now()));
                    result = await reqAddProduct({
                        ...values,
                        goods_details,
                        goods_img,
                        goods_category_id,
                        goods_hot,
                        goods_status,
                        goods_by_user_id,
                        goods_publish_time,
                        goods_category_name,
                        goods_first_categoryName
                    });
                }
                if (result.status === 0) {
                    message.success(`${this.isUpdate ? '修改' : '添加'}商品成功`);
                    this.props.history.goBack();
                } else {
                    message.error(`${this.isUpdate ? '修改' : '添加'}商品成功`);
                }
            }
        });
    };
    componentWillMount() {
        const product = this.props.location.state;
        this.isUpdate = !!product;
        this.product = product || {};
    }

    //获取一级/二级分类选项
    componentDidMount() {
        this.getCategorys();
    }
    render() {
        const { categoryOptions, secondaryId } = this.state;
        const { product } = this;
        const {
            goods_title,
            goods_price,
            goods_img,
            goods_details,
            goods_description,
            goods_contact_qq,
            goods_contact_phone,
            goods_category_id,
            goods_id
        } = product;
        const imgs = goods_img? goods_img.split('#') : [];
        const categoryIds = [];
        if(this.isUpdate){
            categoryIds.push(goods_category_id);
            categoryIds.push(secondaryId);
        }
        const title = (
            <span>
                <LinkButton>
                    <Icon
                        type="arrow-left"
                        style={{ marginRight: 10, fontSize: 20, verticalAlign: 'center' }}
                        onClick={() => this.props.history.goBack()}
                    />
                </LinkButton>
                <span>添加商品</span>
            </span>
        );
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 10 }
        };
        return (
            <div>
                <Card title={title} className="add-product">
                    <Form {...formItemLayout}>
                        <Item label="商品名称">
                            {getFieldDecorator('goods_title', {
                                initialValue: goods_title,
                                rules: [{ required: true, message: '输入商品名称不能为空', whitespace: true }]
                            })(<Input placeholder="请输入商品名称" allowClear />)}
                        </Item>
                        <Item label="商品价格">
                            {getFieldDecorator('goods_price', {
                                initialValue: goods_price,
                                rules: [{ required: true, message: '商品价格不能为空' }]
                            })(
                                <InputNumber
                                    style={{ width: '100%' }}
                                    formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/¥\s?|(,*)/g, '')}
                                    min={0}
                                    max={10000000}
                                />
                            )}
                        </Item>
                        <Item label="商品描述">
                            {getFieldDecorator('goods_description', {
                                initialValue: goods_description,
                                rules: [{ required: true, message: '商品描述不能为空' }]
                            })(<Input placeholder="请输入商品描述" allowClear />)}
                        </Item>
                        <Item label="商品分类">
                            {getFieldDecorator('goods_category_id', {
                                initialValue: categoryIds,
                                rules: [{ required: true, message: '商品品类不能为空' }]
                            })(
                                <Cascader
                                    expandTrigger="hover"
                                    placeholder="请指定商品分类"
                                    options={categoryOptions}
                                    loadData={this.loadSecondaryCategoryData}
                                    onChange={this.onChange}
                                    allowClear
                                />
                            )}
                        </Item>
                        <Item label="电话号码">
                            {getFieldDecorator('goods_contact_phone', {
                                initialValue:goods_contact_phone,
                                validateTrigger: 'onBlur',
                                rules: [
                                    { required: true, message: '手机号不能为空', whitespace: true },
                                    {
                                        pattern: /^1[3456789]\d{9}$/,
                                        message: '请输入正确的手机号码'
                                    }
                                ]
                            })(<Input placeholder="请输入手机号"  allowClear/>)}
                        </Item>
                        <Item label="QQ号">
                            {getFieldDecorator('goods_contact_qq', {
                                initialValue: goods_contact_qq,
                                validateTrigger: 'onBlur',
                                rules: [
                                    { required: true, message: 'QQ号不能为空', whitespace: true },
                                    {
                                        pattern: /^[1-9][0-9]{4,9}$/gim,
                                        message: '请输入正确的QQ号码'
                                    }
                                ]
                            })(<Input placeholder="请输入QQ号" allowClear/>)}
                        </Item>
                        <Item label="商品图片" required>
                            <UploadPicture ref={this.uploadImg} imgs={imgs} isUpdate={this.isUpdate} productId={goods_id}/>
                        </Item>
                        <Item label="商品详情" labelCol={{ span: 3 }} wrapperCol={{ span: 18 }} required>
                            <RichText ref={this.productDetailRT} productDetail={goods_details}/>
                        </Item>
                        <Item wrapperCol={{ offset: 3 }}>
                            <Button type="primary" onClick={this.submitProduct}>
                                提交
                            </Button>
                        </Item>
                    </Form>
                </Card>
            </div>
        );
    }
}
export default Form.create()(AddUpdateProduct);
