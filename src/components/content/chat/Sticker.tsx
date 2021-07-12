import React from 'react';
import { Attachment, Chatlog, EmoticonAttachment, TalkChannel } from 'node-kakao';
import { ContextMenuParams, TriggerEvent } from 'react-contexify';
import { autolink, profileStyle } from '../../../utils';

const Sticker = ({
  chat,
  channel,
  showContextMenu,
  chatRef,
  hideName,
  measure,
  index,
}: {
  chat: Chatlog;
  channel: TalkChannel | undefined;
  showContextMenu: (event: TriggerEvent, params?: Pick<ContextMenuParams, 'id' | 'props' | 'position'> | undefined) => void;
  chatRef: React.RefObject<HTMLDivElement>;
  hideName: boolean;
  measure: () => void;
  index: number;
}) => {
  const userInfo = channel?.getUserInfo(chat.sender);
  const emoticon = chat.attachment as EmoticonAttachment;

  const playSound = async () => {
    if (emoticon.sound) await new Audio(`http://item-kr.talk.kakao.co.kr/dw/${emoticon.sound}`).play();
  };

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
          <img
            className={'emoticon'}
            src={`http://item-kr.talk.kakao.co.kr/dw/${emoticon.path}`}
            alt={'Emoticon'}
            height={160}
            onClick={playSound}
            onLoad={() => {
              measure();
              playSound();
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Sticker;
