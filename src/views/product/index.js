import React, { Component } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import RouteWithSubRoutes from '../../router/RouteWithSubRoutes';
export default class Porduct extends Component {
    render() {
        const { routes } = this.props;
        return (
            //注册商品管理的路由
            <Switch>
                <Redirect exact from="/products/product" to="/products/product/showproduct" />
                {routes.map((route, key) => (
                    <RouteWithSubRoutes {...route} key={key} />
                ))}
            </Switch>
        );
    }
}
