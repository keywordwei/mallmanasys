import React from 'react';
import routes from './router/routes';
import RouteWithSubRoutes from './router/RouteWithSubRoutes';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
// import { TransitionGroup, CSSTransition } from 'react-transition-group';
export default function App(props) {
    return (
        <Router>
             {/* <Route
                render={({ location }) => (
                    //定义路由间页面切换动画效果
                   <TransitionGroup className='router-transition'>
                         <CSSTransition
                            key={location.key}
                            classNames="rootFade"
                            timeout={300}
                            transitionLeave={false}
                        >
                            <Switch location={location}>
                                {routes.map((route, key) => (
                                    <RouteWithSubRoutes {...route} key={key} />
                                ))}
                            </Switch>
                        </CSSTransition>
                    </TransitionGroup>)
                }
                /> */}
            <Switch>
                {routes.map((route, key) => (
                    <RouteWithSubRoutes {...route} key={key} />
                ))}
            </Switch> 
        </Router>
    );
}
