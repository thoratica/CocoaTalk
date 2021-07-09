import axios from 'axios';
import { OAuthCredential } from 'node-kakao';
import { FriendListStruct, FriendStruct } from 'node-kakao/src/api/struct';
import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import querystring from 'querystring';
import { CategoryAtom, chatList, client, credential, SelectedAtom } from '../../store';
import TextEllipsis from 'react-text-ellipsis';
import ChatroomProfile from './ChatroomProfile';
import Scrollbars from 'react-custom-scrollbars-2';

const requestFriendList = async (credential: OAuthCredential): Promise<FriendListStruct> =>
  (
    await axios.post(
      'https://katalk.kakao.com/win32/friends/update.json',
      querystring.stringify({
        contacts: [],
        removed_contacts: [],
        phone_number_type: '7',
        token: '0',
        type: 'a',
        manual: 'true',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          A: 'win32/3.2.3/ko',
          Authorization: `${credential.accessToken}-${credential.deviceUUID}`,
          'User-Agent': 'KT/3.2.3 Wd/10.0 ko',
          Accept: '*/*',
          'Accept-Language': 'ko',
        },
      }
    )
  ).data;

const requestClientInfo = async (credential: OAuthCredential): Promise<ClientInfo> =>
  (
    await axios.get('https://katalk.kakao.com/win32/account/more_settings.json?since=0', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        A: 'win32/3.2.3/ko',
        Authorization: `${credential.accessToken}-${credential.deviceUUID}`,
        'User-Agent': 'KT/3.2.3 Wd/10.0 ko',
        Accept: '*/*',
        'Accept-Language': 'ko',
      },
    })
  ).data;

const FriendList = () => {
  const category = useRecoilValue(CategoryAtom);
  // const chatList = useRecoilValue(ChatListAtom);
  const [selected, setSelected] = useRecoilState(SelectedAtom);
  const [clientInfo, setClientInfo] = useState<ClientInfo>();
  const [friends, setFriends] = useState<FriendStruct[]>([]);
  const [vh, setVh] = useState(0);

  useEffect(() => {
    const updateVh = () => setVh(window.innerHeight);
    updateVh();

    window.addEventListener('resize', updateVh);
    return () => window.removeEventListener('resize', updateVh);
  });

  useEffect(() => {
    if (category === 'FRIENDS') {
      requestClientInfo(credential).then((data) => setClientInfo(data));
      requestFriendList(credential).then(({ friends }) => setFriends(friends));
    }
  }, [category]);

  return (
    <Scrollbars style={{ height: `${vh - 51.6}px` }}>
      <ul className={'list'}>
        {category === 'FRIENDS' ? (
          [
            <li className={'item'} key={'me'}>
              <div
                className={'profile'}
                style={{
                  backgroundImage: `url('${
                    clientInfo?.profileImageUrl === '' || clientInfo?.profileImageUrl === undefined
                      ? 'https://i.ibb.co/qrDqbNM/profile.png'
                      : clientInfo?.profileImageUrl
                  }')`,
                }}
              />
              <div className={'text'}>
                <TextEllipsis lines={1} tag={'div'} ellipsisChars={'...'} tagClass={'name'} debounceTimeoutOnResize={200}>
                  {clientInfo?.nickName}
                </TextEllipsis>
                <TextEllipsis lines={1} tag={'div'} ellipsisChars={'...'} tagClass={'description'} debounceTimeoutOnResize={200}>
                  {clientInfo?.statusMessage}
                </TextEllipsis>
              </div>
            </li>,
            <li className={'item type'} key={'channel-title'}>
              채널 {friends.filter((friend) => friend.type === 1 && !friend.hidden).length}
            </li>,
            ...friends
              .filter((friend) => friend.type === 1 && !friend.hidden)
              .sort((a, b) => (a.nickName < b.nickName ? -1 : a.nickName > b.nickName ? 1 : 0))
              .map((friend, key) => (
                <li className={'item'} key={`channel-${key}`}>
                  <div
                    className={'profile'}
                    style={{
                      backgroundImage: `url('${
                        friend.profileImageUrl === '' ? 'https://i.ibb.co/qrDqbNM/profile.png' : friend.profileImageUrl
                      }')`,
                    }}
                  />
                  <div className={'text'}>
                    <TextEllipsis lines={1} tag={'div'} ellipsisChars={'...'} tagClass={'name'} debounceTimeoutOnResize={200}>
                      {friend.nickName}
                    </TextEllipsis>
                    <TextEllipsis lines={1} tag={'div'} ellipsisChars={'...'} tagClass={'description'} debounceTimeoutOnResize={200}>
                      {friend.statusMessage}
                    </TextEllipsis>
                  </div>
                </li>
              )),
            <li className={'item type'} key={'friend-title'}>
              친구 {friends.filter((friend) => friend.type !== 1 && !friend.hidden).length}
            </li>,
            ...friends
              .filter((friend) => friend.type !== 1 && !friend.hidden)
              .sort((a, b) => (a.nickName < b.nickName ? -1 : a.nickName > b.nickName ? 1 : 0))
              .map((friend, key) => (
                <li className={'item'} key={`friend-${key}`}>
                  <div
                    className={'profile'}
                    style={{
                      backgroundImage: `url('${
                        friend.profileImageUrl === '' ? 'https://i.ibb.co/qrDqbNM/profile.png' : friend.profileImageUrl
                      }')`,
                    }}
                  />
                  <div className={'text'}>
                    <TextEllipsis lines={1} tag={'div'} ellipsisChars={'...'} tagClass={'name'} debounceTimeoutOnResize={200}>
                      {friend.nickName}
                    </TextEllipsis>
                    <TextEllipsis lines={1} tag={'div'} ellipsisChars={'...'} tagClass={'description'} debounceTimeoutOnResize={200}>
                      {friend.statusMessage}
                    </TextEllipsis>
                  </div>
                </li>
              )),
          ]
        ) : category === 'CHATS' ? (
          Array.from(client.channelList.all()).map((channel, key) => {
            const members = Array.from(channel.getAllUserInfo()).filter((member) => {
              console.log(client.logon);
              return member.userId.toString() !== client.clientUser.userId.toString();
            });

            return (
              <li
                className={'item'}
                key={key}
                onClick={() => {
                  if (selected.id.toString() === channel.channelId.toString()) return;
                  setSelected({ type: 'CHAT', id: channel.channelId });
                }}
              >
                <ChatroomProfile members={members} />
                <div className={'text'}>
                  <TextEllipsis lines={1} tag={'div'} ellipsisChars={'...'} tagClass={'name'} debounceTimeoutOnResize={200}>
                    {channel.getDisplayName()}
                  </TextEllipsis>
                  <TextEllipsis lines={1} tag={'div'} ellipsisChars={'...'} tagClass={'description'} debounceTimeoutOnResize={200}>
                    {(chatList[channel.channelId.toString()] ?? [])[(chatList[channel.channelId.toString()]?.length ?? 1) - 1]?.text}
                  </TextEllipsis>
                </div>
              </li>
            );
          })
        ) : category === 'SETTINGS' ? (
          friends.map((friend, key) => {
            return (
              <li className={'item'} key={key}>
                {friend.nickName}
              </li>
            );
          })
        ) : (
          <></>
        )}
      </ul>
    </Scrollbars>
  );
};

export default FriendList;
