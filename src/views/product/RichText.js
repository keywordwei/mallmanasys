import 'braft-editor/dist/index.css';
import 'braft-extensions/dist/color-picker.css';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { message } from 'antd';
import { reqDeleteFile } from '../../api';
import BraftEditor from 'braft-editor';
import ColorPicker from 'braft-extensions/dist/color-picker';

BraftEditor.use(
    ColorPicker({
        includeEditors: ['editor-with-color-picker'],
        theme: 'light' // 支持dark和light两种主题，默认为dark
    })
);

export default class RichText extends Component {
    constructor(props) {
        super(props);

        const { productDetail } = this.props;
        if (productDetail) {
            let editorState = BraftEditor.createEditorState(productDetail);
            this.state = {
                editorState
            };
        } else {
            this.state = {
                editorState: BraftEditor.createEditorState() //富文本初始状态
            };
        }
    }
    //预览功能
    preview = () => {
        if (window.previewWindow) {
            window.previewWindow.close();
        }

        window.previewWindow = window.open();
        window.previewWindow.document.write(this.buildPreviewHtml());
        window.previewWindow.document.close();
    };

    buildPreviewHtml() {
        return `
          <!Doctype html>
          <html>
            <head>
              <title>Preview Content</title>
              <style>
                html,body{
                  height: 100%;
                  margin: 0;
                  padding: 0;
                  overflow: auto;
                  background-color: #f1f2f3;
                }
                .container{
                  box-sizing: border-box;
                  width: 1000px;
                  max-width: 100%;
                  min-height: 100%;
                  margin: 0 auto;
                  padding: 30px 20px;
                  overflow: hidden;
                  background-color: #fff;
                  border-right: solid 1px #eee;
                  border-left: solid 1px #eee;
                }
                .container img,
                .container audio,
                .container video{
                  max-width: 100%;
                  height: auto;
                }
                .container p{
                  white-space: pre-wrap;
                  min-height: 1em;
                }
                .container pre{
                  padding: 15px;
                  background-color: #f1f1f1;
                  border-radius: 5px;
                }
                .container blockquote{
                  margin: 0;
                  padding: 15px;
                  background-color: #f1f1f1;
                  border-left: 3px solid #d1d1d1;
                }
              </style>
            </head>
            <body>
              <div class="container">${this.state.editorState.toHTML()}</div>
            </body>
          </html>
        `;
    }

    contentChange = editorState => {
        this.setState({
            editorState: editorState
        });
    };
    uploadMedia = media => {
        const { file } = media;
        let regImg = /image\/\*/;
        let serverUrl;
        let filemime = file.type;
        if (regImg.test(filemime)) {
            serverUrl = '/product/img/upload';
        } else {
            serverUrl = '/product/vedio/upload';
        }
        //xhr对象
        const xhr = new XMLHttpRequest();
        //准备数据
        const fd = new FormData();

        const successFn = res => {
            const response = JSON.parse(xhr.responseText);
            let uploadResData;
            if (regImg.test(filemime)) {
                uploadResData = Object.assign(response.data);
            } else {
                uploadResData = Object.assign(response.data);
            }
            media.success({
                url: uploadResData.url,
                name: uploadResData.fileName,
                meta: {
                    controls: true, // 指定音视频是否显示控制栏
                    poster: uploadResData.poster
                }
            });
        };
        const progressFn = event => {
            // 上传进度发生变化时调用param.progress
            media.progress((event.loaded / event.total) * 100);
        };
        const errorFn = response => {
            // 上传发生错误时调用param.error
            media.error({
                msg: 'unable to upload.'
            });
        };
        xhr.upload.addEventListener('progress', progressFn, false);
        //异步请求成功实践监听
        xhr.addEventListener('load', successFn, false);
        //异步请求失败事件监听
        xhr.addEventListener('err', errorFn, false);
        //添加数据
        fd.append('image', media.file);
        //建立连接 type url
        xhr.open('POST', serverUrl, true);
        //发送数据
        xhr.send(fd);
    };
    //验证文件大小不能超过30M
    myValidateFn = file => {
        return file.size < 1024 * 40000;
    };
    //富文本编辑器的钩子函数
    hooksConfig = {
        'remove-medias': async file => {
            let result = 0;
            for (let fileObj of file) {
                let fileName = fileObj.name;
                result = await reqDeleteFile({ fileName });
            }
            if (result.status === 0) {
                message.success(result.msg);
            }
        }
    };
    //父组件获取富文本内的值
    getProductDetail = () => {
        // 返回输入数据对应的html格式的文本
        return this.state.editorState.toHTML();
    };

    render() {
        const { editorState } = this.state;
        const extendControls = [
            {
                key: 'custom-button',
                type: 'button',
                text: '预览',
                onClick: this.preview
            }
        ];
        const excludeControls = ['code'];
        return (
            <div>
                <div className="editor-wrapper">
                    <BraftEditor
                        style={{ border: '1px solid #d9d9d9' }}
                        contentStyle={{ height: '300px' }}
                        placeholder="请输入商品详情"
                        value={editorState}
                        onChange={this.contentChange}
                        excludeControls={excludeControls}
                        extendControls={extendControls}
                        media={{ uploadFn: this.uploadMedia, validateFn: this.myValidateFn }}
                        hooks={this.hooksConfig}
                        id="editor-with-color-picker"
                    />
                </div>
            </div>
        );
    }
}
RichText.propTypes = {
    productDetail: PropTypes.string
};
