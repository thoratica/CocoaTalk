import React from 'react';
import { Chatlog, ReplyAttachment, TalkChannel } from 'node-kakao';
import { ContextMenuParams, TriggerEvent } from 'react-contexify';
import { autolink, profileStyle } from '../../../utils';
import { chatList as _chatList } from '../../../store';

const Reply = ({
  chat,
  channel,
  showContextMenu,
  chatRef,
  hideName,
  scrollTo,
  index,
}: {
  chat: Chatlog;
  channel: TalkChannel | undefined;
  showContextMenu: (event: TriggerEvent, params?: Pick<ContextMenuParams, 'id' | 'props' | 'position'> | undefined) => void;
  chatRef: React.RefObject<HTMLDivElement>;
  hideName: boolean;
  scrollTo: (i: number) => void;
  index: number;
}) => {
  const userInfo = channel?.getUserInfo(chat.sender);
  const reply = chat.attachment as ReplyAttachment;

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
          <div className={'message'}>
            <div
              className={'reply'}
              onClick={() => {
                const chatList = _chatList.get(channel!.channelId.toString())!;
                const index = chatList.findIndex((chat) => chat.logId.toString() === reply.src_logId.toString());

                console.log(index);

                scrollTo(index);

                setTimeout(() => {
                  const target: HTMLDivElement | undefined | null = chatRef.current?.parentNode?.parentNode?.querySelector(
                    `.chat[data-id='${reply.src_logId.toString()}']`
                  );

                  target?.classList.add('focus');
                  setTimeout(() => target?.classList.remove('focus'), 1000);
                }, 100);
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
