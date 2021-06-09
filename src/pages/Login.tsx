import React, { useState } from 'react';
import Input from '../components/common/Input';
import './Login.scss';

const Login = () => {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(email, password);
  };

  return (
    <div className={'Login'}>
      <form onSubmit={(e) => onSubmit(e)}>
        <h1 className={'title'}>CocoaTalk</h1>
        <Input className={'email'} type={'text'} placeholder={'이메일 또는 전화번호'} onChange={(e) => setEmail(e.target.value)} autoFocus />
        <Input className={'password'} type={'password'} placeholder={'비밀번호'} onChange={(e) => setPassword(e.target.value)} />
        <Input className={'login'} type={'submit'} value={'로그인'} />
      </form>
    </div>
  );
};

export default Login;
