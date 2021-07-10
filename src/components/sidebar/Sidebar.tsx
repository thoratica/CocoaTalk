import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { Plus } from 'react-feather';
import List from '../list/List';
import { CategoryAtom, chatList, client } from '../../store';
import Category from './Category';
import './Sidebar.scss';
import { Chatlog } from 'node-kakao';

const Sidebar = () => {
  const category = useRecoilValue(CategoryAtom);

  return (
    <section className={'sidebar'}>
      <Category />
      <div className={'right'}>
        <div className={'categoryTitle'}>
          <span className={'text'}>
            {category === 'FRIENDS' ? '친구' : category === 'CHATS' ? '채팅' : category === 'SETTINGS' ? '설정' : ''}
          </span>
          <span className={'add'}>
            <Plus />
          </span>
        </div>
        <List />
      </div>
    </section>
  );
};

export default Sidebar;
