import React from 'react';
import {  Chatlog, TalkChannel } from 'node-kakao';
import { ContextMenuParams, TriggerEvent } from 'react-contexify';
import { profileStyle } from '../../../utils';
import Image from 'react-imgp';
import sizeOf from 'image-size'

const Photo = ({
  chat,
  channel,
  showContextMenu,
  chatRef,
  hideName,
  width,
  measure,
}: {
  chat: Chatlog;
  channel: TalkChannel | undefined;
  showContextMenu: (event: TriggerEvent, params?: Pick<ContextMenuParams, 'id' | 'props' | 'position'> | undefined) => void;
  chatRef: React.RefObject<HTMLDivElement>;
  hideName: boolean;
  width: number;
  measure: () => void;
}) => {
  const userInfo = channel?.getUserInfo(chat.sender);

  const maxWidth = (width - 395.2) * 0.9;
  const maxHeight = 320;
  const img = (chat.attachment ?? { h: 100, w: 100, url: undefined }) as { h: number; w: number; url: string | undefined };

  const [w, h] = (() => {
    if (img.w <= maxWidth && img.h <= maxHeight) return [img.w, img.h];
    if (img.w * (maxHeight / img.h) > maxWidth) return [maxWidth, img.h * (maxWidth / img.w)];
    else return [img.w * (maxHeight / img.h), maxHeight];
  })();

  sizeOf()

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
          <Image
            className={'image'}
            src={img.url}
            height={Number.isNaN(Number(h <= 0 ? 100 : h)) ? 100 : h <= 0 ? 100 : h}
            width={Number.isNaN(Number(w <= 0 ? 100 : w)) ? 100 : w <= 0 ? 100 : w}
            onLoad={measure}
            loader={<div style={{height: }}></div>}
          />
        </div>
      </div>
    </>
  );
};

export default Photo;
