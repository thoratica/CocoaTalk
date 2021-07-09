import React, { useEffect } from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import './Main.scss';

const Main = () => {
  useEffect(() => {
    (async () => {})();
  }, []);

  return (
    <div className={'main'}>
      <Sidebar />
    </div>
  );
};

export default Main;
