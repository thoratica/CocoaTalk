declare type InputTypes =
  | 'button'
  | 'checkbox'
  | 'color'
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'file'
  | 'hidden'
  | 'image'
  | 'month'
  | 'number'
  | 'password'
  | 'radio'
  | 'range'
  | 'reset'
  | 'search'
  | 'submit'
  | 'tel'
  | 'text'
  | 'time'
  | 'url'
  | 'week';

declare interface ClientInfo {
  status: number;
  accountId: number;
  accountDisplayId: string;
  hashedAccountId: string;
  emailAddress: string;
  emailVerified: boolean;
  serviceUserId: number;
  emailStatus: number;
  agreeAdidTerms: boolean;
  available: number;
  available2: number;
  chatRoomDecorationSetting: { revision: number };
  clientConf: { osVersion: string };
  contactNameSync: number;
  emoticonStoreBadge: number;
  emoticonWebstore: { 'x1.25ImageUrl': string; x2ImageUrl: string; 'x1.5ImageUrl': string; targetUrl: string; x1ImageUrl: string };
  featureFlags?: null[] | null;
  locoConfRevision: number;
  moreApps: { grid?: { k: string; n: string; w: string; t: number }[] | null; services?: null[] | null };
  rollingContent: { revision: number };
  settingsStatus: number;
  since: number;
  openChat: {
    chatMemberMaxJoin: number;
    chatRoomMaxJoin: number;
    createLinkLimit: number;
    createCardLinkLimit: number;
    numOfStaffLimit: number;
    rewritable: boolean;
    handoverEnabled: boolean;
  };
  pstnNumber: string;
  formattedPstnNumber: string;
  nsnNumber: string;
  formattedNsnNumber: string;
  allowMigration: boolean;
  friendsPollingInterval: number;
  settingsPollingInterval: number;
  moreListPollingInterval: number;
  morePayPollingInterval: number;
  daumMediaPollingInterval: number;
  lessSettingsPollingInterval: number;
  profilePollingInterval: number;
  statusMessage: string;
  nickName: string;
  profileImageUrl: string;
  fullProfileImageUrl: string;
  originalProfileImageUrl: string;
  profileSettings: { useProfileHistoryShare: boolean; useProfilecon: boolean };
  recentVersion: string;
  seasonNoticeRev: number;
  seasonProfileRev: number;
  server_time: number;
  contentTab: string;
  uuid: string;
  uuidSearchable: boolean;
}

declare module 'react-text-ellipsis';
