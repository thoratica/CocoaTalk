import React from 'react';
import { Chatlog, ReplyAttachment, TalkChannel } from 'node-kakao';
import { ContextMenuParams, TriggerEvent } from 'react-contexify';
import { autolink, profileStyle } from '../../../utils';

const Reply = ({
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
  const reply = chat.attachment as ReplyAttachment;

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
              className={'reply'}
              onClick={() => {
                // const target: HTMLDivElement | null = parentRef.current!.container.querySelector(
                //   `.chat[data-id='${reply.src_logId.toString()}']`
                // );
                // if (target === null) return toast.error('대상 메시지를 찾을 수 없습니다!');
                // parentRef.current!.scrollTop(target.offsetTop - parentRef.current!.getClientHeight() / 2 + target.clientHeight / 2);
                // target.classList.add('focus');
                // setTimeout(() => target.classList.remove('focus'), 1000);
              }}
            >
              <span className={'label'}>{channel?.getUserInfo({ userId: reply.src_userId })?.nickname ?? '(알 수 없음)'}에게 답장</span>
              {reply.src_message}
            </div>
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

export default Reply;
