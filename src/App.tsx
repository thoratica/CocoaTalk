import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import { useRecoilState } from 'recoil';
import { chatList, client, LogonAtom, setChatList } from './store';
import Main from './pages/Main';
import './App.scss';
import TrafficButtons from './components/common/TrafficButtons';
import { Chatlog, Long, TalkChannel, TalkChatData } from 'node-kakao';
import cloneDeep from 'lodash.clonedeep';

const { shell } = window.require('electron');

const App = () => {
  const [logon, setLogon] = useRecoilState(LogonAtom);
  // const [chatList, setChatList] = useRecoilState(ChatListAtom);

  useEffect(() => {
    // @ts-ignore
    window.openExternal = shell.openExternal;

    const updateChatList = (data: TalkChatData, channel: TalkChannel) => void chatList[channel.channelId.toString()].push(data.chat);
    client.on('chat', updateChatList);

    return () => void client.off('chat', updateChatList);
  }, []);

  useEffect(() => {
    (async () => {
      const channels = Array.from(client.channelList.all());
      const chatList: [string, Chatlog[]][] = await Promise.all(
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

      channels.forEach((channel) => channel.on('chat', (data, channel) => {}));

      console.log(chatList);
      setChatList(Object.fromEntries(chatList));
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
