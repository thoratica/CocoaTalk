import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { ChatListAtom, client, LogonAtom } from './store';
import Main from './pages/Main';
import './App.scss';
import TrafficButtons from './components/common/TrafficButtons';
import { Chatlog, Long } from 'node-kakao';

const App = () => {
  const [logon, setLogon] = useRecoilState(LogonAtom);
  const setChatList = useSetRecoilState(ChatListAtom);

  useEffect(() => {
    (async () => {
      const channels = Array.from(client.channelList.all());
      const chatList: Chatlog[][] = await Promise.all(
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

          return update;
        })
      );

      channels.forEach(channel => channel.on('chat', (data, channel) => {
        
      }))

      console.log(chatList);
      setChatList(chatList);
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
