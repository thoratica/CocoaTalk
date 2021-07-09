import { Chatlog, Long } from 'node-kakao';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Paperclip, Send } from 'react-feather';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import useWindowSize from '../../hooks/useWindowSize';
import { chatList, client, SelectedAtom } from '../../store';
import Input from '../common/Input';
import Chat from './Chat';
import './Chatroom.scss';

const Wrapper = styled.div`
  padding: 1rem;

  ::-webkit-scrollbar {
    width: 0.5rem;
    border-radius: 0.4rem;
    background: ${'#353535'};
  }

  ::-webkit-scrollbar-thumb {
    background: ${'#9b9b9b'};
    border-radius: 0.4rem;
  }
`;

const getDay = (date: Date) => `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;
let lastRenderedMsgType = 0;

const Chatroom = () => {
  const selected = useRecoilValue(SelectedAtom);
  // const chatList = useRecoilValue(ChatListAtom);
  const channel = Array.from(client.channelList.all()).find((channel) => channel.channelId.toString() === selected.id.toString());
  const [name, setName] = useState(channel?.getDisplayName() ?? '(알 수 없음)');
  const handle = useRef<VirtuosoHandle>(null);
  const windowSize = useWindowSize();

  useEffect(() => setName(channel?.getDisplayName() ?? '(알 수 없음)'), [selected]);

  return (
    <div className={'chatroom'}>
      <div className={'roomName'}>
        <span className={'text'} onClick={() => setName('wa')}>
          {name}
        </span>
      </div>
      <div className={'chatList'}>
        <Virtuoso
          style={{ height: windowSize.height - 107.38, overflowX: 'hidden' }}
          ref={handle}
          data={chatList[channel?.channelId.toString() ?? ''] ?? []}
          followOutput={'auto'}
          components={{
            List: React.forwardRef((props, ref) => <Wrapper {...props} ref={ref} />),
            Header: () => <div style={{ width: 'auto', height: 16 }} />,
            Footer: () => <div style={{ width: 'auto', height: 16 }} />,
          }}
          itemContent={useCallback(
            (key: number, chat: Chatlog) => {
              if (!chatList) return null;
              const userInfo = channel?.getUserInfo(chat.sender);
              const prevChatlog = chatList[channel?.channelId.toString() ?? ''][(key === 0 ? 1 : key) - 1];
              const prevUserInfo = channel?.getUserInfo(prevChatlog.sender);

              const info = {
                profileImage: userInfo?.profileURL ?? 'https://i.ibb.co/qrDqbNM/profile.png',
                attachment: chat.attachment ?? {},
                author: userInfo,
                channelId: channel?.channelId ?? Long.fromNumber(0),
                hideName:
                  lastRenderedMsgType === 0
                    ? false
                    : prevUserInfo === undefined || userInfo === undefined
                    ? true
                    : prevUserInfo.nickname === userInfo.nickname,
                readers: channel?.getReaders(chat) ?? [],
                isFirstChat:
                  getDay(new Date(prevChatlog.sendAt < 1000000000000 ? prevChatlog.sendAt * 1000 : prevChatlog.sendAt)) !==
                  getDay(new Date(chat.sendAt < 1000000000000 ? chat.sendAt * 1000 : chat.sendAt)),
                date: new Date(chat.sendAt < 1000000000000 ? chat.sendAt * 1000 : chat.sendAt),
                key,
                text: chat.text,
                type: chat.type,
              };

              lastRenderedMsgType = chat.type;

              return (
                <Chat
                  info={info}
                  scrollTo={(index: number) => (index === -1 ? alert('이동할 수 없는 메시지입니다.') : handle.current?.scrollToIndex(index))}
                  key={key}
                />
              );
            },
            [chatList]
          )}
          initialTopMostItemIndex={chatList[channel?.channelId.toString() ?? '']?.length ?? 99999}
        />
      </div>
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
