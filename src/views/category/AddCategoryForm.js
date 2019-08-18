import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'antd';
function CategoryForm(props) {
    const { getFieldDecorator } = props.form;
    let { categoryTitle,getForm} = props;
    getForm(props.form);
    return (
        <Form>
            <Form.Item>
               <Input value={categoryTitle} disabled></Input>
            </Form.Item>
            <Form.Item>
                {getFieldDecorator('categoryName', {
                    rules: [{ required: true, message: '品类名不能为空' }],
                    initialValue: ''
                })(<Input placeholder="请输入品类名称" />)}
            </Form.Item>
        </Form>
    );
}
CategoryForm.propTypes = {
    categoryTitle: PropTypes.string.isRequired,
    getForm: PropTypes.func.isRequired
};
const AddCategoryForm = Form.create()(CategoryForm);
export default AddCategoryForm;
