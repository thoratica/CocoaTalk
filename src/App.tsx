import React from 'react';
import { Toaster } from 'react-hot-toast';
import Login from './pages/login';
import { useRecoilState } from 'recoil';
import { LogonAtom } from './store';
import Main from './pages/main';
import './app.scss';
import TrafficButtons from './components/common/trafficButtons';

const App = () => {
  const [logon, setLogon] = useRecoilState(LogonAtom);

  return (
    <div className={'app'}>
      <Toaster position={'bottom-center'} />
      <TrafficButtons />
      {logon ? <Main /> : <Login />}
    </div>
  );
};

export default App;
