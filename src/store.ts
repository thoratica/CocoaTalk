import { AuthApiClient, Chatlog, DefaultConfiguration, OAuthCredential, TalkClient } from 'node-kakao';
import { AxiosWebClient } from 'node-kakao/src/api/axios-web-client';
import { Win32XVCProvider } from 'node-kakao/src/api/xvc';
import { hostname } from 'os';
import { atom } from 'recoil';

export const client = new TalkClient();
export const authApiClient = new AuthApiClient(new AxiosWebClient('https', 'katalk.kakao.com'), hostname(), 'loco', DefaultConfiguration, Win32XVCProvider);
export let credential: OAuthCredential;
export const setCredential = (c: OAuthCredential) => (credential = c);

export const LoginFormAtom = atom<{ email?: string; password?: string; forced?: boolean }>({ key: 'loginForm', default: {} });
export const LogonAtom = atom({ key: 'logon', default: false });
export const CategoryAtom = atom<'FRIENDS' | 'CHATS' | 'SETTINGS'>({ key: 'category', default: 'FRIENDS' });
export const ChatListAtom = atom<Chatlog[][]>({ key: 'chatList', default: [] });
