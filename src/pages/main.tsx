import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import Chatroom from '../components/content/Chatroom';
import Sidebar from '../components/sidebar/Sidebar';
import { SelectedAtom } from '../store';
import './Main.scss';

const Main = () => {
  const selected = useRecoilValue(SelectedAtom);

  return (
    <div className={'main'}>
      <Sidebar />
      {selected.type === 'CHAT' ? <Chatroom /> : <></>}
    </div>
  );
};

export default Main;
