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

  useEffect(() => {
    Array.from(client.channelList.all()).forEach((channel) => {
      const proxy = new Proxy(chatList[channel.channelId.toString()], {
        get: function (target, prop, reciever) {
          return 'world';
        },
        set: function (target, property, value, receiver) {
          // @ts-expect-error
          console.log('setting ' + property + ' for ' + target + ' with value ' + value);
          // @ts-expect-error
          target[property] = value;

          return true;
        },
      });
      console.log(proxy.push({} as Chatlog));
    });
  }, []);

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
