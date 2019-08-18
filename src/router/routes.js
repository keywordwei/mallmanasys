import Login from '../views/login';
import Admin from '../views/admin';
import Home from '../views/home';
import Category from '../views/category';
import Product from '../views/product';
import ProductList from '../views/product/Product';
import User from '../views/user';
import Role from '../views/role';
import Bar from '../views/charts/Bar';
import Pie from '../views/charts/Pie';
import Line from '../views/charts/Line';
import Address from '../views/address';
import AddUpdateProduct from '../views/product/AddUpdateProduct';
import ProductDetail from '../views/product/ProductDetail';
//前端路由模块
const routes = [
    {
        path: '/login',
        exact: true,
        component: Login
    },
    {
        path: '/',
        component: Admin,
        routes: [
            {
                path: '/home',
                component: Home
            },
            {
                path: '/products/category',
                component: Category
            },
            {
                path: '/products/product',
                component: Product,
                routes: [
                    {
                        path: '/products/product/showproduct',
                        component: ProductList
                    },
                    {
                        path: '/products/product/editproduct',
                        component: AddUpdateProduct
                    },
                    {
                        path: '/products/product/productdetail',
                        component: ProductDetail
                    }
                ]
            },
            {
                path: '/user',
                component: User
            },
            {
                path: '/role',
                component: Role
            },
            {
                path: '/charts/bar',
                component: Bar
            },
            {
                path: '/charts/pie',
                component: Pie
            },
            {
                path: '/charts/line',
                component: Line
            },
            {
                path: '/address',
                component: Address
            }
        ]
    }
];
export default routes;
