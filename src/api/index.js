import ajax from './axios';
import { POST } from './method';
import jsonp from 'jsonp';
import { message } from 'antd';
//职员登录
export const reqLogin = (username, password) => ajax('/login', { username, password }, POST);
//职员注册
export const reqRegister = (staff) => 
    ajax('/register',staff,POST);
//删除职员
export const reqDeleteStaff = (staffId) => 
    ajax('/deleteStaff',staffId);    
//更新员工 
export const reqUpdateStaff = (staff) => 
    ajax('/updateStaff',staff,POST);
//修改头像 
export const reqUpdateAvatar = (staffAvatar) => 
    ajax('/updataStaffAvatar',staffAvatar, POST);
//获取一级分类列表
export const reqFirstLevelCategorys = () => ajax('/productCategory/list');
//添加一级分类列表
export const reqAddFirstLevelCategory = categoryName => ajax('/productCategory/add', { categoryName }, POST);
//修改一级分类列表
export const reqUpdateFirstLevelCategory = (firstId, categoryName) =>
    ajax('/productCategory/update', { firstId, categoryName }, POST);
//删除一级分类列表
export const reqDeleteCategory = firstId => ajax('/productCategory/delete', { firstId });
//获取二级分类列表
export const reqSecondaryCategorys = firstId => ajax('/productSecondaryCategory/list', { firstId });
//添加二级分类列表
export const reqAddSecondarCategory = (firstId, secondaryCategoryName) =>
    ajax('/productSecondaryCategory/add', { firstId, secondaryCategoryName }, POST);
//修改二级分类列表
export const reqUpdateSecondaryCategory = (secondaryId, secondaryCategoryName) =>
    ajax('/productSecondaryCategory/update', { secondaryId, secondaryCategoryName }, POST);
//删除二级分类列表
export const reqDeleteSecondaryCategory = secondaryId => ajax('/productSecondaryCategory/delete', { secondaryId });
//根据一级分类ID 二级分类名获取二级分类ID
export const reqSecondaryId = (searchSecondaryValues) => 
    ajax('/productSecondaryCategory/findSecondaryId',searchSecondaryValues,POST);

//获取所有商品列表
export const reqProducts = (currentPage, pageSize) => ajax('/products/list', { currentPage, pageSize });
//修改商品状态(在售/下架)
export const reqUpdateProductStatus = (goods_id, goods_status) =>
    ajax('/product/updateStatus', { goods_id, goods_status }, POST);
//当前分页搜索商品
export const reqSearchProducts = searchValues => ajax('product/searchProduct', searchValues, POST);
//根据某选项排序
export const reqSorterProduct = (currentPage, pageSize, sorterKeyWord, sorterType) =>
    ajax('/product/sorter', { currentPage, pageSize, sorterKeyWord, sorterType });
//无排序的条件查询
export const reqOnlySearch = searchValues => ajax('/product/conditionSearch', searchValues, POST);
//带排序的条件查询
export const reqSearchAndSortProducts = searchAndSortValues =>
    ajax('/product/searchAndSort', searchAndSortValues, POST);
//修改商品图片
export const reqUpdateProductImg = (productImgs) => 
    ajax('/product/updateImgs',productImgs, POST);

//删除商品
export const reqDeleteProduct = goodsId => ajax('/product/deleteProduct', goodsId);
//请求用户信息
export const reqUserMsg = userId => ajax('/user/searchById', userId);
//删除已上传的文件
export const reqDeleteFile = fileName => ajax('/product/media/delete', fileName, POST);
//添加商品
export const reqAddProduct = productValues => ajax('/product/addProduct', productValues, POST);
//更新商品信息
export const reqUpdateProduct = (updateProductValues) => 
    ajax('/product/updateProduct',updateProductValues,POST);
//权限设置
export const reqRoles = () => 
    ajax('/role/list');
export const reqAddRole = (roleValues) => 
    ajax('/role/add',roleValues,POST);
export const reqUpdateRole = (role) => 
    ajax('/role/addPermission',role, POST);
export const reqDeleteRole = (roleId) => 
    ajax('/role/deleteRole',{roleId},POST);
//员工管理
export const reqStaffs = () => 
    ajax('/staff/list');
//获取首页信息
export const reqAllCount = () =>
    ajax('/homedata');
//jsop请求天气信息
export const reqWheater = city => {
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`;
    return new Promise((resolve, reject) => {
        jsonp(url, {}, (err, data) => {
            if (!err && data.status === 'success') {
                const { dayPictureUrl, weather } = data.results[0].weather_data[0];
                resolve({ dayPictureUrl, weather });
            } else {
                message.error('请求出错了:' + err);
                return;
            }
        });
    });
};
