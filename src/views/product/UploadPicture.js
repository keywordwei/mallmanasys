import React, { Component } from 'react';
import { Upload, Icon, Modal, message } from 'antd';
import { reqDeleteFile } from '../../api';
import PropTypes from 'prop-types';
import { IMG_URL } from '../../utils/constants';
export default class uploadPicture extends Component {
    constructor(props) {
        super(props);
        const { imgs } = this.props;
        let fileList = [];
        if (imgs && imgs.length > 0) {
            fileList = imgs.map((fileName, key) => ({
                uid: -key,
                name: fileName,
                status: 'done',
                url: IMG_URL + fileName
            }));
        }
        this.state = {
            showPreview: false, //是否预览大图
            previewImage: '', //预览大图图片地址
            fileList //保存图片数组
        };
    }

    //关闭大图预览
    closePreview = () => this.setState({ showPreview: false });
    //预览大图
    previewImg = async file => {
        this.setState({
            previewImage: file.url || file.preview,
            showPreview: true
        });
    };
    //处理上传图片/删除图片操作
    handleUploadChange = async ({ file, fileList }) => {
        if (file.status === 'done') {
            const result = file.response;
            if (result.status === 0) {
                const { fileName, url } = result.data;
                file = fileList[fileList.length - 1];
                file.name = fileName;
                file.url = url;
            } else {
                message.error(result.msg);
            }
        } else if (file.status === 'removed') {
            const { isUpdate } = this.props;
            console.log(isUpdate);
            if (!isUpdate) {
                let fileName = file.name;
                const result = await reqDeleteFile({ fileName });
                if (result.status === 0) {
                    message.success(result.msg);
                }
            }
        }
        this.setState({ fileList });
    };
    //父组件获取上传文件名数组
    getImgs = () => {
        return this.state.fileList.map(file => file.name);
    };
    render() {
        const { showPreview, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div className="clearfix">
                <Upload
                    action="/product/img/upload"
                    accept="image/*"
                    name="image"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.previewImg}
                    onChange={this.handleUploadChange}
                >
                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <Modal visible={showPreview} footer={null} onCancel={this.closePreview}>
                    <img alt="添加/修改商品预览" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}
uploadPicture.propTypes = {
    imgs: PropTypes.array
};
