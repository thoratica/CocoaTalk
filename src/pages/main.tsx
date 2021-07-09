import React, { useEffect } from 'react';
import Chatroom from '../components/content/Chatroom';
import Sidebar from '../components/sidebar/Sidebar';
import './Main.scss';

const Main = () => {
  return (
    <div className={'main'}>
      <Sidebar />
      <Chatroom />
    </div>
  );
};

export default Main;
