import React, { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Login from './pages/login';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { api, authApiClient, client, LoginFormAtom, LogonAtom } from './store';
import Main from './pages/main';
import './app.scss';
import TrafficButtons from './components/common/trafficButtons';

const getLocalStorageItem = (key: string) => {
  if (localStorage.hasOwnProperty(key)) return localStorage.getItem(key);
  else return null;
};

const App = () => {
  const [logon, setLogon] = useRecoilState(LogonAtom);
  const setFormData = useSetRecoilState(LoginFormAtom);

  useEffect(() => {
    const email = getLocalStorageItem('email');
    const password = getLocalStorageItem('password');

    if (email === null || password === null) return;

    toast.promise(
      (async () => {
        const formData = { email, password, forced: true };
        setFormData(formData);

        const loginRes = await authApiClient.login(formData);
        if (!loginRes.success) throw new Error(loginRes.status.toString());

        console.log(loginRes.result);

        const res = await client.login(loginRes.result);
        if (!res.success) throw new Error(res.status.toString());

        api.init(loginRes.result);

        return setTimeout(() => setLogon(client.logon), 100);
      })().catch((e) => console.error(e)),
      { loading: '자동 로그인 중...', success: '자동 로그인 성공', error: '자동 로그인 실패' }
    );
  }, []);

  return (
    <div className={'app'}>
      <Toaster position={'bottom-center'} />
      <TrafficButtons />
      {logon ? <Main /> : <Login />}
    </div>
  );
};

export default App;
