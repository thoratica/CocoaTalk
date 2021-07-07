import { AuthApiClient, DefaultConfiguration, TalkClient } from 'node-kakao';
import { AxiosWebClient } from 'node-kakao/src/api/axios-web-client';
import { Win32XVCProvider } from 'node-kakao/src/api/xvc';
import { hostname } from 'os';
import { atom } from 'recoil';
import Api from './api';

export const client = new TalkClient();
export const authApiClient = new AuthApiClient(
  new AxiosWebClient('https', 'katalk.kakao.com'),
  hostname(),
  'loco',
  DefaultConfiguration,
  Win32XVCProvider
);
export const api = new Api(authApiClient);

export const LoginFormAtom = atom<{ email?: string; password?: string; forced?: boolean }>({ key: 'loginForm', default: {} });
export const LogonAtom = atom({ key: 'logon', default: false });
