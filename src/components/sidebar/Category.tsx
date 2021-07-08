import React from 'react';
import { MessageSquare, Tool, User } from 'react-feather';
import { useRecoilState } from 'recoil';
import { CategoryAtom } from '../../store';

const Category = () => {
  const [category, setCategory] = useRecoilState(CategoryAtom);

  return (
    <section className={'category'}>
      <ul className={'list'}>
        <li className={'item friends'} onClick={() => setCategory('FRIENDS')}>
          <User size={28} strokeWidth={1.3} stroke={'#1c1c1c'} fill={category === 'FRIENDS' ? '#1c1c1c' : 'transparent'} />
        </li>
        <li className={'item chats'} onClick={() => setCategory('CHATS')}>
          <MessageSquare size={28} strokeWidth={1.3} stroke={'#1c1c1c'} fill={category === 'CHATS' ? '#1c1c1c' : 'transparent'} />
        </li>
        <li className={'item settings'} onClick={() => setCategory('SETTINGS')}>
          <Tool size={28} strokeWidth={1.3} stroke={'#1c1c1c'} fill={category === 'SETTINGS' ? '#1c1c1c' : 'transparent'} />
        </li>
      </ul>
    </section>
  );
};

export default Category;
