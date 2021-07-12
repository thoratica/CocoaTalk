import React from 'react';
import { Chatlog, TalkChannel } from 'node-kakao';
import { ContextMenuParams, TriggerEvent } from 'react-contexify';
import { autolink, profileStyle } from '../../../utils';
import { AlertCircle } from 'react-feather';

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
          <div className={'message error'}>
            <div className={'line'}>
              <div className={'error'}>
                <AlertCircle size={18} stroke={'#838383'} strokeWidth={1.7} />
              </div>
              <div className={'content'}>삭제된 메시지입니다.</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Text;
