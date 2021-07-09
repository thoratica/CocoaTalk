import React, { useEffect, useRef, useState } from 'react';
import { Paperclip, Send } from 'react-feather';
import { useRecoilValue } from 'recoil';
import { client, SelectedAtom } from '../../store';
import Input from '../common/Input';
import './Chatroom.scss';

const Chatroom = () => {
  const selected = useRecoilValue(SelectedAtom);
  const channel = Array.from(client.channelList.all()).find((channel) => channel.channelId.toString() === selected.id.toString());
  const [name, setName] = useState(channel?.getDisplayName() ?? '(알 수 없음)');
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => setName(channel?.getDisplayName() ?? '(알 수 없음)'), [selected]);

  return (
    <div className={'chatroom'}>
      <div className={'name'}>
        <span className={'text'} onClick={() => setName('wa')}>
          {name}
        </span>
      </div>
      <div className={'chatList'}></div>
      <form className={'form'}>
        <button role={'button'}>
          <Paperclip size={18} strokeWidth={1.5} />
        </button>
        <Input type={'text'} placeholder={'메시지를 입력하세요...'} />
        <label>
          <Input type={'submit'} />
          <button role={'button'}>
            <Send size={18} strokeWidth={1.5} />
          </button>
        </label>
      </form>
    </div>
  );
};

export default Chatroom;
