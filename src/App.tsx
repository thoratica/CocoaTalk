import React from 'react';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import { useRecoilState } from 'recoil';
import { LogonAtom } from './store';
import Main from './pages/Main';
import './App.scss';
import TrafficButtons from './components/common/TrafficButtons';

const App = () => {
  const [logon, setLogon] = useRecoilState(LogonAtom);

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
