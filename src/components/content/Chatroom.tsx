import React from 'react';
import { useRecoilValue } from 'recoil';
import { client, SelectedAtom } from '../../store';
import './Chatroom.scss';

const Chatroom = () => {
  const selected = useRecoilValue(SelectedAtom);
  const channel = Array.from(client.channelList.all()).find((channel) => channel.channelId.toString() === selected.toString());

  return (
    <div className={'chatroom'}>
      <div className={'name'}>
        <span className={'text'}>{channel?.getDisplayName() ?? '(알 수 없음)'}</span>
      </div>
      <div className={'chatList'}></div>
      <form className={'form'}>
        <input type={'text'} placeholder={'메시지를 입력하세요...'} />
      </form>
    </div>
  );
};

export default Chatroom;
