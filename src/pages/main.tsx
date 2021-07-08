import React, { useEffect } from 'react';
import { Plus } from 'react-feather';
import { useRecoilValue } from 'recoil';
import FriendList from '../components/list/FriendList';
import Sidebar from '../components/sidebar/Sidebar';
import { CategoryAtom } from '../store';
import './Main.scss';

const Main = () => {
  const category = useRecoilValue(CategoryAtom);

  useEffect(() => {
    (async () => {})();
  }, []);

  return (
    <div className={'main'}>
      <Sidebar />
      <div className={'right'}>
        <div className={'title'}>
          <span className={'text'}>
            {category === 'FRIENDS' ? '친구' : category === 'CHATS' ? '채팅' : category === 'SETTINGS' ? '설정' : ''}
          </span>
          <span className={'add'}>
            <Plus />
          </span>
        </div>
        {category === 'FRIENDS' ? <FriendList /> : category === 'CHATS' ? <></> : category === 'SETTINGS' ? <></> : <></>}
      </div>
    </div>
  );
};

export default Main;
