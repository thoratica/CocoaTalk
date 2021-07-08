import axios from 'axios';
import { OAuthCredential } from 'node-kakao';
import { FriendListStruct, FriendStruct } from 'node-kakao/src/api/struct';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import querystring from 'querystring';
import { CategoryAtom, credential } from '../../store';
import TextEllipsis from 'react-text-ellipsis';

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

const FriendList = () => {
  const category = useRecoilValue(CategoryAtom);
  const [friends, setFriends] = useState<FriendStruct[]>([]);

  useEffect(() => {
    if (category === 'FRIENDS') {
      requestFriendList(credential).then(({ friends }) => setFriends(friends));
    }
  }, [category]);

  return (
    <ul className={'list'}>
      {category === 'FRIENDS' ? (
        friends.map((friend, key) => {
          return (
            <li className={'item'} key={key}>
              <div className={'profile'} style={{ backgroundImage: `url('${friend.profileImageUrl}')` }} />
              <div className={'text'}>
                <TextEllipsis lines={1} tag={'div'} ellipsisChars={'...'} tagClass={'name'} debounceTimeoutOnResize={200}>
                  {friend.nickName}
                </TextEllipsis>
                <TextEllipsis lines={1} tag={'div'} ellipsisChars={'...'} tagClass={'description'} debounceTimeoutOnResize={200}>
                  {friend.statusMessage}
                </TextEllipsis>
              </div>
            </li>
          );
        })
      ) : category === 'CHATS' ? (
        friends.map((friend, key) => {
          return (
            <li className={'item'} key={key}>
              {friend.nickName}
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
  );
};

export default FriendList;
