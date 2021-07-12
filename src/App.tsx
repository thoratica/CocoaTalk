import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import { useRecoilState } from 'recoil';
import { chatList, client, LogonAtom } from './store';
import Main from './pages/Main';
import './App.scss';
import TrafficButtons from './components/common/TrafficButtons';
import {
  Chatlog,
  DeleteAllFeed,
  DELETED_MESSAGE_OFFSET,
  KnownChatType,
  Long,
  TalkChannel,
  TalkChatData,
  TypedChatlog,
} from 'node-kakao';

const { shell } = window.require('electron');

const App = () => {
  const [logon, setLogon] = useRecoilState(LogonAtom);

  useEffect(() => {
    // @ts-ignore
    window.openExternal = shell.openExternal;

    const updateChatList = (data: TalkChatData, channel: TalkChannel) => void chatList.get(channel.channelId.toString())?.push(data.chat);
    client.on('chat', updateChatList);

    const deleteChat = (_: Readonly<TypedChatlog<KnownChatType.FEED>>, channel: TalkChannel, feed: DeleteAllFeed) => {
      const list = chatList.get(channel.channelId.toString())!;
      const index = list.findIndex((chat) => chat.logId.toString() === feed.logId.toString());

      list[index] = {
        ...list[index],
        type: DELETED_MESSAGE_OFFSET,
      };

      chatList.set(channel.channelId.toString(), list);
    };
    client.on('chat_deleted', deleteChat);

    return () => {
      client.off('chat', updateChatList);
      client.off('chat_deleted', deleteChat);
    };
  }, []);

  useEffect(() => {
    (async () => {
      const channels = Array.from(client.channelList.all());
      const newList: [string, Chatlog[]][] = await Promise.all(
        channels.map(async (channel) => {
          let startId: Long | undefined = undefined;
          const update: Chatlog[] = [];
          let chatLog: Chatlog[];

          const getChatLog = async (startId: Long | undefined): Promise<Chatlog[]> => {
            const chatListFromRes = await channel.getChatListFrom(startId);
            if (!chatListFromRes.success) return [];
            return chatListFromRes.result;
          };

          while ((chatLog = await getChatLog(startId)) && chatLog?.length > 0) {
            update.push(...chatLog);
            if (startId?.toString() !== chatLog[(chatLog?.length ?? 1) - 1].logId.toString()) {
              startId = chatLog[(chatLog?.length ?? 1) - 1].logId;
            }
          }

          return [channel.channelId.toString(), update] as [string, Chatlog[]];
        })
      );

      newList.forEach(([channel, list]) => chatList.set(channel, list));
    })();
  }, [logon]);

  return (
    <div className={'app'}>
      <Toaster position={'bottom-center'} />
      <TrafficButtons />
      {logon ? <Main /> : <Login />}
      {/* <Main /> */}
    </div>
  );
};

export default App;
