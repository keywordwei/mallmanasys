import React from 'react';
import ReactDOM from 'react-dom';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/es/locale-provider/zh_CN';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render( <LocaleProvider locale={zh_CN}><App /></LocaleProvider>, document.getElementById('mallmanasys'));
serviceWorker.unregister();
