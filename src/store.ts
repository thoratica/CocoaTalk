import { AuthApiClient, ChannelUserInfo, Chatlog, DefaultConfiguration, Long, OAuthCredential, TalkClient } from 'node-kakao';
import { AxiosWebClient } from 'node-kakao/src/api/axios-web-client';
import { Win32XVCProvider } from 'node-kakao/src/api/xvc';
import { hostname } from 'os';
import { atom } from 'recoil';

export const client = new TalkClient();
export const authApiClient = new AuthApiClient(
  new AxiosWebClient('https', 'katalk.kakao.com'),
  hostname(),
  'loco',
  DefaultConfiguration,
  Win32XVCProvider
);
export let credential: OAuthCredential;
export const setCredential = (c: OAuthCredential) => (credential = c);

export let chatList = new Map<string, Chatlog[]>();

export const LoginFormAtom = atom<{ email?: string; password?: string; forced?: boolean }>({ key: 'loginForm', default: {} });
export const LogonAtom = atom({ key: 'logon', default: false });
export const CategoryAtom = atom<'FRIENDS' | 'CHATS' | 'SETTINGS'>({ key: 'category', default: 'FRIENDS' });
// export const ChatListAtom = atom<{ [id: string]: Chatlog[] }>({ key: 'chatList', default: {} });
export const SelectedAtom = atom<{ type: 'USER' | 'CHAT' | 'SETTING' | 'NONE'; id: Long }>({
  key: 'selected',
  default: { type: 'NONE', id: Long.fromNumber(0) },
});
export const ReadersModalInfoAtom = atom<{ visible: boolean; data: ChannelUserInfo[] }>({
  key: 'readersModalInfo',
  default: { visible: false, data: [] },
});
