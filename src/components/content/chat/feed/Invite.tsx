import React from 'react';
import { Chatlog, InviteFeed, TalkChannel } from 'node-kakao';
import { ContextMenuParams, TriggerEvent } from 'react-contexify';
import { profileStyle } from '../../../../utils';

const Invite = ({
  chat,
  feed,
  channel,
  showContextMenu,
  chatRef,
  hideName,
  index,
}: {
  chat: Chatlog;
  feed: InviteFeed;
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
        <div className={'text invite'}>
          <div className={'message'}>
            <span className={'inviter'}>{feed.inviter.nickName}</span>님이{' '}
            <span className={'invited'}>{feed.members.map(({ nickName }: { nickName: string }) => nickName).join(', ')}</span>
            님을 초대했습니다.
          </div>
        </div>
      </div>
    </>
  );
};

export default Invite;
