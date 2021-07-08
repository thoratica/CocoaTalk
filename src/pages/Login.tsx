import { KnownAuthStatusCode } from 'node-kakao';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSetRecoilState } from 'recoil';
import { EventEmitter } from 'events';
import Input from '../components/common/Input';
import { authApiClient, client, LoginFormAtom, LogonAtom, setCredential } from '../store';
import './Login.scss';

const inputEventEmitter = new EventEmitter();

const getLocalStorageItem = (key: string) => {
  if (localStorage.hasOwnProperty(key)) return localStorage.getItem(key);
  else return null;
};

const Login = () => {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [passcode, setPasscode] = useState<string>();
  const [step, setStep] = useState(0);
  const setFormData = useSetRecoilState(LoginFormAtom);
  const setLogon = useSetRecoilState(LogonAtom);

  const logout = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    location.reload();
  };

  let registerDevice = async (email: string, password: string) => {};

  const login = async (email: string, password: string) => {
    const formData = { email, password, forced: true };
    setFormData(formData);

    const loginRes = await authApiClient.login(formData);
    if (!loginRes.success) {
      if (loginRes.status === KnownAuthStatusCode.DEVICE_NOT_REGISTERED) {
        const passcodeRes = await authApiClient.requestPasscode(formData);
        if (!passcodeRes.success) throw passcodeRes.status;
        setStep(1);
        toast('인증번호를 5분 이내로 입력해주세요.');
        return await registerDevice(email, password);
      } else throw loginRes.status;
    }

    const res = await client.login(loginRes.result);
    if (!res.success) throw res.status.toString();

    localStorage.setItem('email', email);
    localStorage.setItem('password', password);

    setCredential(loginRes.result);

    return setLogon(client.logon);
  };

  registerDevice = async (email: string, password: string) => {
    const formData = { email, password, forced: true };

    const passcode = await new Promise<string>((resolve, reject) => {
      inputEventEmitter.on('passcode', (passcode) => resolve(passcode));
      setTimeout(() => {
        toast.error('인증 시간이 만료되었습니다.');
        reject();
      }, 1000 * 60 * 5);
    });

    const registerRes = await authApiClient.registerDevice(formData, passcode, true);
    if (!registerRes.success) throw registerRes.status;

    return await login(email, password);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email === undefined || password === undefined) return;

    login(email, password)
      .then(() => toast.success('로그인 성공'))
      .catch(async (error) => {
        const formData = { email, password, forced: true };

        if (error === KnownAuthStatusCode.DEVICE_NOT_REGISTERED) {
          const passcodeRes = await authApiClient.requestPasscode(formData);
          if (!passcodeRes.success) throw passcodeRes.status;
          setStep(1);
          toast('인증번호를 5분 이내로 입력해주세요.');
          return await registerDevice(email, password);
        } else toast.error(`로그인 실패: ${error}`);
      });
  };

  useEffect(() => {
    const email = getLocalStorageItem('email');
    const password = getLocalStorageItem('password');

    if (email === null || password === null) return;

    (async () => {
      const formData = { email, password, forced: true };
      setFormData(formData);

      const loginRes = await authApiClient.login(formData);

      if (!loginRes.success) throw loginRes.status;

      const res = await client.login(loginRes.result);
      if (!res.success) throw res.status;

      setCredential(loginRes.result);

      return setTimeout(() => setLogon(client.logon), 100);
    })()
      .then(() => toast.success('자동 로그인 성공'))
      .catch(async (error) => {
        const formData = { email, password, forced: true };

        if (error === KnownAuthStatusCode.DEVICE_NOT_REGISTERED) {
          const passcodeRes = await authApiClient.requestPasscode(formData);
          if (!passcodeRes.success) throw passcodeRes.status;
          setStep(1);
          toast('인증번호를 5분 이내로 입력해주세요.');
          return await registerDevice(email, password);
        } else toast.error(`자동 로그인 실패: ${error}`);
      });
  }, []);

  return step === 0 ? (
    <div className={'login'}>
      <form onSubmit={(e) => onSubmit(e)}>
        <h1 className={'title'}>CocoaTalk</h1>
        <Input
          className={'email'}
          type={'text'}
          placeholder={'이메일 또는 전화번호'}
          onChange={(e) => setEmail(e.target.value)}
          value={email ?? ''}
          autoFocus
        />
        <Input
          className={'password'}
          type={'password'}
          placeholder={'비밀번호'}
          onChange={(e) => setPassword(e.target.value)}
          value={password ?? ''}
        />
        <Input className={'login'} type={'submit'} value={'로그인'} />
        <span style={{ fontSize: '.8rem', color: '#686868' }}>
          CocoaTalk을 사용하여 생기는 모든 불이익에 대한 책임은 사용자에게 있습니다.
        </span>
      </form>
      <span
        style={{
          cursor: 'pointer',
          position: 'fixed',
          bottom: '1rem',
          right: '1rem',
          padding: '.5rem .9rem',
          backgroundColor: '#fee500',
          borderRadius: '.4rem',
        }}
        onClick={logout}
      >
        로그아웃
      </span>
    </div>
  ) : (
    <div className={'login'}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          inputEventEmitter.emit('passcode', passcode);
        }}
      >
        <h1 className={'title'}>기기 인증</h1>
        <Input
          className={'passcode'}
          type={'text'}
          placeholder={'인증번호 입력'}
          onChange={(e) => setPasscode(e.target.value)}
          value={passcode ?? ''}
          autoFocus
        />
        <Input className={'login'} type={'submit'} value={'로그인'} />
      </form>
      <span
        style={{
          cursor: 'pointer',
          position: 'fixed',
          bottom: '1rem',
          right: '1rem',
          padding: '.5rem .9rem',
          backgroundColor: '#fee500',
          borderRadius: '.4rem',
        }}
        onClick={logout}
      >
        로그아웃
      </span>
    </div>
  );
};

export default Login;
