import React from 'react';
import { Chatlog, MultiPhotoAttachment, TalkChannel } from 'node-kakao';
import { ContextMenuParams, TriggerEvent } from 'react-contexify';
import { profileStyle } from '../../../utils';
import Image from 'react-imgp';
import sizeOf from 'image-size';
import { useEffect } from 'react';
import { get } from 'http';

const Photo = ({
  attachment,
  width,
  measure,
}: {
  attachment: { h: number | undefined; w: number | undefined; url: string | undefined };
  width: number;
  measure: () => void;
}) => {
  const maxWidth = (width - 464) * 0.9;
  const maxHeight = 320;
  const img = (attachment ?? { h: 100, w: 100, url: undefined }) as { h: number; w: number; url: string | undefined };

  const [w, h] = (() => {
    if (img.w <= maxWidth && img.h <= maxHeight) return [img.w, img.h];
    if (img.w * (maxHeight / img.h) > maxWidth) return [maxWidth, img.h * (maxWidth / img.w)];
    else return [img.w * (maxHeight / img.h), maxHeight];
  })();

  return (
    <Image
      className={'image'}
      src={img.url}
      height={Number.isNaN(Number(h <= 0 ? 100 : h)) ? 100 : h <= 0 ? 100 : h}
      width={Number.isNaN(Number(w <= 0 ? 100 : w)) ? 100 : w <= 0 ? 100 : w}
      onLoad={measure}
      loader={<div style={{ height: h <= 0 ? 100 : h, width: w <= 0 ? 100 : w }}></div>}
    />
  );
};

const MultiPhoto = ({
  chat,
  channel,
  showContextMenu,
  chatRef,
  hideName,
  width,
  measure,
  index,
}: {
  chat: Chatlog;
  channel: TalkChannel | undefined;
  showContextMenu: (event: TriggerEvent, params?: Pick<ContextMenuParams, 'id' | 'props' | 'position'> | undefined) => void;
  chatRef: React.RefObject<HTMLDivElement>;
  hideName: boolean;
  width: number;
  measure: () => void;
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
          {(chat.attachment as MultiPhotoAttachment).imageUrls.map((url, i) => (
            <>
              {i !== 0 && <div className={'space'} />}
              <Photo
                attachment={{ h: (chat.attachment as MultiPhotoAttachment).hl[i], w: (chat.attachment as MultiPhotoAttachment).wl[i], url }}
                width={width}
                measure={measure}
              />
            </>
          ))}
        </div>
      </div>
    </>
  );
};

export default MultiPhoto;
