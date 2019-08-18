import React from 'react'
import { Route } from 'react-router-dom';

export default function RouteWithSubRoutes(route) {
    if(route.exact){
        return (
            <Route
                path={route.path}
                exact
                render={
                    (props) => (
                        <route.component {...props} routes={route.routes}/>
                    )
                }
            ></Route>
        )
    }else{
        return (
            <Route
                path={route.path}
                render={
                    (props) => (
                        <route.component {...props} routes={route.routes}/>
                    )
                }
            ></Route>
        )
    }
}
