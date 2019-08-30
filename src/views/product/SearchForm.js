import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Select, Button } from 'antd';
const { Option } = Select;
const SearForm = props => {
    const { categorys = [], searchProduct, form, getSearchForm, resetFields } = props;
    const { getFieldDecorator } = form;
    getSearchForm(form);
    
    const formItemLayout = {
        labelCol: {
            xs: { span: 7 }
        },
        wrapperCol: {
            xs: { span: 17 }
        }
    };
    return (
        <Form layout="inline" {...formItemLayout}>
            <Form.Item label="查询品类">
                {getFieldDecorator('searchCategory', {
                    initialValue: 'allCategory'
                })(
                    <Select style={{ width: 160 }}>
                        <Option value="allCategory">全部</Option>
                        {categorys.map(category => (
                            <Option value={category.id} key={category}>
                                {category.name}
                            </Option>
                        ))}
                    </Select>
                )}
            </Form.Item>
            <Form.Item label="查询方式" >
                {getFieldDecorator('searchWays', {
                    initialValue: 'goods_title'
                })(
                    <Select style={{ width: 160 }}>
                        <Option value="goods_title">按商品名称查询</Option>
                        <Option value="goods_description">按商品描述查询</Option>
                    </Select>
                )}
            </Form.Item>

            <Form.Item>{getFieldDecorator('searchInputMsg', {})(<Input placeholder="请输入查询内容" />)}</Form.Item>
            <Form.Item>
                <Button type="primary" icon="search" onClick={searchProduct} htmlType="submit">
                    查询
                </Button>
            </Form.Item>
            <Form.Item>
                <Button onClick={resetFields}>重置</Button>
            </Form.Item>
        </Form>
    );
};

SearForm.propTypes = {
    getSearchForm: PropTypes.func.isRequired,
    searchProduct: PropTypes.func.isRequired,
    resetFields: PropTypes.func.isRequired
};
const SearchForm = Form.create()(SearForm);
export default SearchForm;
