import React from 'react';
import { Chatlog, TalkChannel } from 'node-kakao';
import { ContextMenuParams, TriggerEvent } from 'react-contexify';
import { autolink, profileStyle } from '../../../utils';

const Text = ({
  chat,
  channel,
  showContextMenu,
  chatRef,
  hideName,
}: {
  chat: Chatlog;
  channel: TalkChannel | undefined;
  showContextMenu: (event: TriggerEvent, params?: Pick<ContextMenuParams, 'id' | 'props' | 'position'> | undefined) => void;
  chatRef: React.RefObject<HTMLDivElement>;
  hideName: boolean;
}) => {
  const userInfo = channel?.getUserInfo(chat.sender);

  return (
    <>
      <div
        className={'chat'}
        data-id={chat.logId.toString()}
        onContextMenu={(e) => {
          e.preventDefault();
          showContextMenu(e);
        }}
        ref={chatRef}
      >
        <div className={'profile'} style={profileStyle(userInfo?.profileURL, hideName)} />
        <div className={'text'}>
          {!hideName && <div className={'name'}>{userInfo?.nickname ?? '(알 수 없음)'}</div>}
          <div className={'message'}>
            <div
              className={'content'}
              dangerouslySetInnerHTML={{
                __html: autolink((chat.text ?? '').replace(/</gi, '&lt;').replace(/>/gi, '&gt;')).replace('\n', '<br />'),
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Text;
