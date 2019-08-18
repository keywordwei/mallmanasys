import React, { Component } from 'react';
import { Card, Button, Table, Modal, message, Icon } from 'antd';
import {
    reqFirstLevelCategorys,
    reqAddFirstLevelCategory,
    reqUpdateFirstLevelCategory,
    reqDeleteCategory,
    reqSecondaryCategorys,
    reqAddSecondarCategory,
    reqUpdateSecondaryCategory,
    reqDeleteSecondaryCategory
} from '../../api';
import AddCategoryForm from './AddCategoryForm';
import UpdateCategoryForm from './UpdateCategoryForm';
import modal from '../../utils/modal';
import pagination from '../../utils/pagination';
import { PAGE_SIZE} from '../../utils/constants';
import LinkButton from '../../components/linkbutton';
import './category.less';


export default class Category extends Component {
    state = {
        loading: false, //是否正在获取数据中
        categorys: [], //table的品类表的datasource
        isFirstLevelCategory: true, //当前处于一级品类或是二级品类
        firstLevelCategoryName: '', //跳转二级页面时保存状态，一级品类名称
        firstLevelCategoryKey: '', //跳转二级页面时保存状态，一级品类名称ID,
        firstLevelCategoryPage: 1,//跳转二级页面时保存状态，保存处于何页
        selectedRowKey: '', //指定RowSelction中单选表格选中的哪一项
        currentPage: 1, //指定当前分页处于那一页
        modalVisible: 0 //标识添加/更新/删除的对话框框是否显示, 0:都不显示, 1: 显示添加， 2:显示更新 3:表示删除
    };
    //初始化列名
    initColumns = () => {
        this.columns = [
            {
                title: '品类编号',
                dataIndex: 'id',
                width: '40%'
            },
            {
                title: '品类名称',
                dataIndex: 'name'
            }
        ];
    };
    //点击表格某行单选框选中
    setSelectedRowKey = (record) => {
        this.setState({
            selectedRowKey: record.id
        });
        //当前选中某行的品类名称
        this.categoryName = record.name;
    };
    //分页切换当前页面
    paginationChange = (page) => {
        this.setState({
            currentPage: page,
            selectedRowKey: ''
        })
        this.categoryName='';
    }
    //根据是否处于一级品类或者二级品类获取表的一级品类/二级品类数据源
    getCategorys = async () => {
        this.setState({
            loading: true
        });
        const { isFirstLevelCategory, firstLevelCategoryKey } = this.state;
        let result;
        if (isFirstLevelCategory) {
            result = await reqFirstLevelCategorys();
        } else {
            result = await reqSecondaryCategorys(firstLevelCategoryKey);
        }
        if (result.status === 0) {
            this.setState({
                loading: false,
                categorys: result.data
            });
        }
    };
    //隐藏modal对话框，重置表单
    handleCancel = e => {
        this.setState({
            modalVisible: 0
        });
        this.form.resetFields();
    };
    //显示添加品类的modal对话框
    showAddCategoryModal = () => {
        this.setState({
            modalVisible: 1
        });
    };
    //根据是否为一级品类或者二级品类，添加相应的品类名称(一级品类名称不可重复，二级品类名称可以重复)
    addCategory = e => {
        //禁止冒泡
        e.preventDefault();
        //提交添加分类表单并验证
        this.form.validateFields(async (err, values) => {
            if (!err) {
                const { isFirstLevelCategory, firstLevelCategoryKey } = this.state;
                const {categoryName} = values;
                let result;
                if (isFirstLevelCategory) {
                    result = await reqAddFirstLevelCategory(categoryName);
                } else {
                    result = await reqAddSecondarCategory(firstLevelCategoryKey, categoryName);
                }
                if (result.status === 0) {
                    this.categoryName = result.data.name;
                    let currentPage = pagination.showCurrentPage(this.state.categorys.length + 1, PAGE_SIZE);
                    this.getCategorys();
                    this.setState({
                        modalVisible: 0,
                        selectedRowKey: result.data.id,
                        currentPage
                    });
                    this.form.resetFields();
                } else {
                    //后台验证品类名必须唯一
                    message.error(result.msg);
                }
            }
        });
    };
    //验证品类名必须唯一
    validateCategoryNameUnique = categoryName => {
        const { categorys } = this.state;
        for (let value of categorys) {
            if (value.name === categoryName) {
                message.error('品类名重复，请更换其余品类名');
                return false;
            }
        }
        return true;
    };

    //modalVisible === 2时显示更新品类modal对话框
    ShowupdateCategory = () => {
        if (!this.categoryName) {
            modal.showUnSelectRowinfo();
        } else {
            this.setState({
                modalVisible: 2
            });
        }
    };
    //根据是否为一级品类或二级品类更新品类名称
    updateCategory = e => {
        e.preventDefault();
        const { selectedRowKey, isFirstLevelCategory } = this.state;
        this.form.validateFields(async (err, values) => {
            const categoryName = values.categoryName;
            if (!err) {
                if (categoryName !== this.categoryName) {
                    if (this.validateCategoryNameUnique(categoryName)) {
                        let result;
                        if (isFirstLevelCategory) {
                            result = await reqUpdateFirstLevelCategory(selectedRowKey, categoryName);
                        } else {
                            result = await reqUpdateSecondaryCategory(selectedRowKey, categoryName);
                        }
                        if (result.status === 0) {
                            this.getCategorys();
                            this.categoryName = categoryName;
                        }
                        this.setState({
                            modalVisible: 0
                        });
                        this.form.resetFields();
                    }
                } else {
                    this.setState({
                        modalVisible: 0
                    });
                }
            }
        });
    };
    //根据品类ID删除品类数据，删除一级品类时将同时将删掉二级品类
    deleteCategory = () => {
        const { selectedRowKey, isFirstLevelCategory } = this.state;
        if (!this.categoryName) {
            modal.showUnSelectRowinfo();
            return;
        }
        let title = `确定删除品类${this.categoryName}?`;
        modal.confirmModel(title, async () => {
            let result;
            console.log(selectedRowKey);
            if (isFirstLevelCategory) {
                result = await reqDeleteCategory(selectedRowKey);
            } else {
                result = await reqDeleteSecondaryCategory(selectedRowKey);
            }
            if (result.status === 0) {
                this.getCategorys();
                this.categoryName = '';
                this.setState({
                    selectedRowKey: ''
                })
            }
        });
    };
    //根据一级品类id获取而二级品类列表
    findSecondaryCategory = () => {
        if (!this.categoryName) {
            modal.showUnSelectRowinfo();
        } else {
            const { selectedRowKey,currentPage } = this.state;
            this.setState(
                {
                    isFirstLevelCategory: false,
                    firstLevelCategoryKey: selectedRowKey,
                    firstLevelCategoryName: this.categoryName,
                    selectedRowKey: '',
                    firstLevelCategoryPage: currentPage,
                    currentPage: 1
                },
                () => {
                    this.getCategorys();
                    this.categoryName = '';
                }
            );
        }
    };
    //点击card标签返回一级界面时显示的文字
    showCategorys = () => {
        const { firstLevelCategoryKey, firstLevelCategoryName, firstLevelCategoryPage } = this.state;
        this.setState(
            {
                isFirstLevelCategory: true,
                selectedRowKey: firstLevelCategoryKey,
                currentPage: firstLevelCategoryPage
            },
            () => {
                this.getCategorys();
                this.categoryName = firstLevelCategoryName;
            }
        );
    };
    //初始品类表列名
    componentWillMount() {
        this.initColumns();
    }
    //挂载组件后获取品类表数据源
    componentDidMount() {
        this.getCategorys();
    }

    render() {
        const {
            modalVisible,
            isFirstLevelCategory,
            categorys,
            firstLevelCategoryName,
            selectedRowKey,
            loading,
            currentPage
        } = this.state;
        //modal对话框第一个输入框显示的文字
        const categoryTitle = isFirstLevelCategory ? '一级品类列表' : firstLevelCategoryName;
        // card标题
        const title = isFirstLevelCategory ? (
            '一级品类列表'
        ) : (
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
                <Icon type="arrow-right" style={{ marginRight: 5 }} />
                <span>{firstLevelCategoryName}</span>
            </span>
        );
        let rowSelection = {
            selectedRowKeys: [selectedRowKey],
            type: 'radio',
            onSelect: (category) => { // 选择某个radio时回调
                this.setState({
                    selectedRowKey: category.id
                })
              }
        };
        const addCategorybodyStyle = {
            padding: '0px'
        };
        const addCategoryHeadStyle = {
            border: '1px solid #e8e8e8'
        };
        const visiblebtn = isFirstLevelCategory ? 'visible' : 'hidden';
        const extra = (
            <Button type="primary" icon="plus" onClick={this.showAddCategoryModal}>
                添加
            </Button>
        );
        const deUpFinTitle = (
            <div>
                <Button type="primary" onClick={this.ShowupdateCategory}>
                    修改
                </Button>
                <Button type="danger" onClick={this.deleteCategory}>
                    删除
                </Button>
                <Button type="primary" onClick={this.findSecondaryCategory} style={{ visibility: visiblebtn }}>
                    查看子分类
                </Button>
            </div>
        );
        return (
            <Card title={title} extra={extra} className="category">
                <Card
                    title={deUpFinTitle}
                    headStyle={addCategoryHeadStyle}
                    bodyStyle={addCategorybodyStyle}
                    bordered={false}
                    className="category-card"
                >
                    <Table
                        bordered
                        rowKey="id"
                        rowSelection={rowSelection}
                        columns={this.columns}
                        dataSource={categorys}
                        loading={loading}
                        pagination={{
                            size: 'small',
                            defaultPageSize: PAGE_SIZE,
                            showQuickJumper: true,
                            showSizeChanger: true,
                            current: currentPage,
                            pageSizeOptions: [''+PAGE_SIZE, ''+PAGE_SIZE*2, ''+PAGE_SIZE*3, ''+ PAGE_SIZE*4],
                            showTotal: pagination.showTotal,
                            onChange: this.paginationChange
                        }}
                        onRow={(record) => {
                            return {
                                onClick: () => {
                                    this.setSelectedRowKey(record);
                                }
                            };
                        }}
                    />
                    <Modal
                        title="更新品类"
                        visible={modalVisible === 2}
                        onOk={this.updateCategory}
                        onCancel={this.handleCancel}
                    >
                        <UpdateCategoryForm
                            categoryName={this.categoryName}
                            getUpdateForm={form => {
                                this.form = form;
                            }}
                        />
                    </Modal>
                </Card>

                <Modal
                    title="添加分类"
                    visible={modalVisible === 1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <AddCategoryForm
                        categoryTitle={categoryTitle}
                        getForm={form => {
                            this.form = form;
                        }}
                    />
                </Modal>
            </Card>
        );
    }
}
