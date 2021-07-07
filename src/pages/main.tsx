import { ServiceApiClient } from 'node-kakao';
import React, { useEffect } from 'react';
import { api } from '../store';

const Main = () => {
  useEffect(() => {
    (async () => {
      const friendListRes = await api.serviceApiClient.requestFriendList();
    })();
  }, []);

  return <div className={'main'}>wa</div>;
};

export default Main;
