import React from 'react';
import { Chatlog, KnownChatType, KnownFeedType, TalkChannel } from 'node-kakao';
import { ContextMenuParams, TriggerEvent } from 'react-contexify';
import { profileStyle } from '../../../../utils';
import { AlertCircle } from 'react-feather';

const Unsupported = ({
  chat,
  feed,
  channel,
  showContextMenu,
  chatRef,
  hideName,
  index,
}: {
  chat: Chatlog;
  feed: { feedType: KnownFeedType };
  channel: TalkChannel | undefined;
  showContextMenu: (event: TriggerEvent, params?: Pick<ContextMenuParams, 'id' | 'props' | 'position'> | undefined) => void;
  chatRef: React.RefObject<HTMLDivElement>;
  hideName: boolean;
  index: number;
}) => {
  const userInfo = channel?.getUserInfo(chat.sender);

  return (
    <>
      <div
        className={'chat'}
        data-id={chat.logId.toString()}
        data-index={index}
        onContextMenu={(e) => {
          e.preventDefault();
          showContextMenu(e);
        }}
        ref={chatRef}
      >
        <div className={'profile'} style={profileStyle(userInfo?.profileURL, hideName)} />
        <div className={'text'}>
          {!hideName && <div className={'name'}>{userInfo?.nickname ?? '(알 수 없음)'}</div>}
          <div className={'message error'}>
            <div className={'line'}>
              <div className={'error'}>
                <AlertCircle size={18} stroke={'#838383'} strokeWidth={1.7} />
              </div>
              <div className={'content'}>표시할 수 없는 메시지입니다.</div>
            </div>
            <span className={'msgType'}>
              메시지 타입: {KnownChatType[chat.type]} ({chat.type})
              <br />
              피드 타입: {KnownFeedType[feed.feedType]} ({feed.feedType})
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Unsupported;
