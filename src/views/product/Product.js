import React, { Component } from 'react';
import { Card, Table, Divider, Tag, Popconfirm, Button } from 'antd';
import SearchForm from './SearchForm';
import LinkButton from '../../components/linkbutton';
import {
    reqFirstLevelCategorys,
    reqProducts,
    reqUpdateProductStatus,
    reqOnlySearch,
    reqSorterProduct,
    reqSearchAndSortProducts,
    reqDeleteProduct
} from '../../api';
import { PAGE_SIZE } from '../../utils/constants';
import pagination from '../../utils/pagination';
const { CheckableTag } = Tag;
export default class Product extends Component {
    state = {
        categorys: [], //一级品类数据
        total: 0, //商品的总数量
        loading: false, //渲染表格数据是否加载中
        products: [], //商品数据
        currentPage: 1, //当前处于哪一页
        searchValues: {}, //查询信息参数
        sorterKeyWord: '', //排序关键字
        sorterType: '', //排序方式 升序/降序
        pageSize: 6 //当前页面显示数据条数
    };

    //初始化商品列
    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'goods_title',
                align: 'center'
            },
            {
                title: '商品描述',
                width: '35%',
                dataIndex: 'goods_description',
                align: 'center'
            },
            {
                title: '商品品类',
                dataIndex: 'goods_first_categoryName',
                align: 'center'
            },
            {
                title: '价格',
                dataIndex: 'goods_price',
                key: 'price',
                sorter: true,
                render: price => '¥' + price,
                align: 'center'
            },
            {
                title: '点击量',
                dataIndex: 'goods_hot',
                key: 'hot',
                align: 'center',
                sorter: true,
                editable: true,
                render: goods_hot => {
                    return <Tag>{goods_hot}</Tag>;
                }
            },
            {
                title: '状态',
                dataIndex: 'goods_status',
                key: 'status',
                align: 'center',
                render: (goods_status, record) => {
                    let title = goods_status ? '下架' : '上架';
                    let changeTitle = goods_status ? '上架' : '下架';
                    let checked = goods_status ? false : true;
                    return (
                        <Popconfirm
                            title={`确定${changeTitle}${record.goods_title}商品吗?`}
                            onConfirm={() => this.updateProdudctStatus(record.goods_id, checked)}
                            className="popconfirm"
                        >
                            <span>
                                <CheckableTag checked={checked} style={{cursor: 'point'}}>{title}</CheckableTag>
                            </span>
                        </Popconfirm>
                    );
                }
            },
            {
                title: '操作',
                key: 'action',
                align: 'center',
                render: (text, product) => {
                    return (
                        <span>
                            <LinkButton onClick={() => this.showDetail(product)}>详情</LinkButton>
                            <Divider type="vertical" />
                            <LinkButton onClick={() => this.showUpdate(product)}>修改</LinkButton>
                            <Divider type="vertical" />
                            <Popconfirm
                                title={`确定删除商品${product.goods_title}吗?`}
                                onConfirm={() => this.deleteProduct(product.goods_id)}
                            >
                                <LinkButton>删除</LinkButton>
                            </Popconfirm>
                        </span>
                    );
                }
            }
        ];
    };
    //显示商品详情界面
    showDetail = product => {
        sessionStorage.setItem('product', JSON.stringify(product)) ;
        this.props.history.push('/products/product/productdetail');
    };

    //显示修改商品界面
    showUpdate = product => {
        sessionStorage.setItem('product', JSON.stringify(product));
        this.props.history.push('/products/product/editproduct');
    };
    getAllCategory = async () => {
        let result = await reqFirstLevelCategorys();
        if (result.status === 0) {
            this.setState({
                categorys: result.data
            });
        }
    };
    getProducts = async currentPage => {
        //保存查询的某一页
        this.setState({
            loading: true,
            currentPage
        });
        const { searchValues, sorterKeyWord, sorterType, pageSize } = this.state;
        let result;
        //分页查询排序为一体的查找 有查询条件=>有排序的条件查询和无排序的条件查询 无查询条件=>排序查询和非排序查询
        //当选择为全部，查询输入框为空时不进入条件查询
        if (
            JSON.stringify(searchValues) !== '{}' &&
            (searchValues.searchCategory !== 'allCategory' || searchValues.searchInputMsg)
        ) {
            if (sorterKeyWord && sorterType) {
                result = await reqSearchAndSortProducts({
                    currentPage,
                    pageSize,
                    sorterKeyWord,
                    sorterType,
                    ...searchValues
                });
            } else {
                result = await reqOnlySearch({ currentPage, pageSize, ...searchValues });
            }
        } else {
            //无查询条件时的查询
            if (sorterKeyWord && sorterType) {
                result = await reqSorterProduct(currentPage, pageSize, sorterKeyWord, sorterType);
            } else {
                result = await reqProducts(currentPage, pageSize);
            }
        }
        this.setState({ loading: false });
        if (result.status === 0) {
            const { total, products } = result.data;
            this.setState({
                products,
                total
            });
        }
    };
    //商品上架/下架状态修改
    updateProdudctStatus = async (goods_id, productStatus) => {
        const { currentPage } = this.state;
        let goodsStatus = productStatus ? 1 : 0;
        const result = await reqUpdateProductStatus(goods_id, goodsStatus);
        if (result.status === 0) {
            this.getProducts(currentPage);
        }
    };
    //根据用户选择查询相应数据信息
    searchProduct = e => {
        e.preventDefault();
        this.form.validateFields(async (err, values) => {
            if (!err) {
                this.setState({ searchValues: values }, () => {
                    this.getProducts(1);
                });
            }
        });
    };
    //重置查询表单
    resetfields = e => {
        e.preventDefault();
        this.form.resetFields();
        this.setState(
            {
                searchValues: {}
            },
            () => {
                this.getProducts(1);
            }
        );
    };
    //表格排序仅排序当前页
    tableOnChange = (pagination, filters, sorter) => {
        let sorterKeyWord = sorter.field;
        let sorterType;
        if (sorter.order === 'ascend') {
            sorterType = 'asc';
        } else if (sorter.order === 'descend') {
            sorterType = 'desc';
        }
        this.setState(
            {
                sorterKeyWord,
                sorterType,
                pageSize: pagination.pageSize
            },
            () => {
                this.getProducts(pagination.current);
            }
        );
    };
    //删除商品
    deleteProduct = async goods_id => {
        let result = await reqDeleteProduct({ goods_id });
        if (result.status === 0) {
            const { currentPage, total } = this.state;
            if (!((total - 1) % PAGE_SIZE) && currentPage !== 1) {
                this.getProducts(currentPage - 1);
            } else {
                this.getProducts(currentPage);
            }
        }
    };
    componentWillMount() {
        this.initColumns();
    }
    componentDidMount() {
        this.getAllCategory();
        if(!this.isUpdate){
            
        }
        let currentPage = sessionStorage.getItem('productCurrentPage');
        if (currentPage) {
            this.getProducts(parseInt(currentPage));
        } else {
            this.getProducts(1);
        }
    }
    componentWillUnmount() {
        const { currentPage, products } = this.state;
        sessionStorage.setItem('productCurrentPage', currentPage);
        sessionStorage.setItem("",products.length);
    }
    render() {
        const { categorys, total, products, loading, currentPage } = this.state;
        let title = (
            <SearchForm
                categorys={categorys}
                getSearchForm={form => (this.form = form)}
                searchProduct={this.searchProduct}
                resetFields={this.resetfields}
            />
        );
        const extra = (
            <Button
                type="primary"
                icon="plus"
                onClick={() => {
                    this.isUpdate = false;
                    this.props.history.push('/products/product/editproduct');
                }}
            >
                添加商品
            </Button>
        );
        const cardBodyStyle = {
            padding: 0
        };
        return (
            <div>
                <Card title={title} extra={extra} bodyStyle={cardBodyStyle} />
                <Table
                    bordered
                    loading={loading}
                    columns={this.columns}
                    dataSource={products}
                    onChange={this.tableOnChange}
                    rowKey="goods_id"
                    style={{ marginTop: 20, backgroundColor: '#fff' }}
                    pagination={{
                        size: 'small',
                        defaultPageSize: PAGE_SIZE,
                        total: total,
                        current: currentPage,
                        showSizeChanger: true,
                        pageSizeOptions: ['' + PAGE_SIZE, '' + PAGE_SIZE * 2, '' + PAGE_SIZE * 3, '' + PAGE_SIZE * 4],
                        showQuickJumper: true,
                        showTotal: pagination.showTotal
                    }}
                />
            </div>
        );
    }
}
