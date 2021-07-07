import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';
import App from './app';
import './index.scss';

axios.defaults.adapter = require('axios/lib/adapters/http');

ReactDOM.render(
  <RecoilRoot>
    <App />
  </RecoilRoot>,
  document.getElementById('root')!
);
document.getElementById('_render')!.remove();
