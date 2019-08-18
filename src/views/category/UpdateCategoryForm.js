import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'antd';
function upCategoryForm(props) {
    const { getFieldDecorator } = props.form;
    let { getUpdateForm, categoryName} = props;
    getUpdateForm(props.form);
    return (
        <Form>
            <Form.Item>
                {getFieldDecorator('categoryName', {
                    rules: [{ required: true, message: '品类名不能为空' }],
                    initialValue: categoryName
                })(<Input />)}
            </Form.Item>
        </Form>
    );
}
upCategoryForm.propTypes = {
    categoryName: PropTypes.string.isRequired,
    getUpdateForm: PropTypes.func.isRequired
};
const UpdateCategoryForm = Form.create()(upCategoryForm);
export default UpdateCategoryForm;
