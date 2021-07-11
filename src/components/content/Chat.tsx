import React, { useEffect, useState, RefObject } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Menu, Item, Separator, Submenu, useContextMenu } from 'react-contexify';
import {
  Attachment,
  ChannelUserInfo,
  DELETED_MESSAGE_OFFSET,
  EmoticonAttachment,
  KnownChatType,
  KnownFeedType,
  Long,
  PhotoAttachment,
  ReplyAttachment,
  TypedChatlog,
} from 'node-kakao';
import { AlertCircle } from 'react-feather';
import Scrollbars from 'react-custom-scrollbars-2';
import toast from 'react-hot-toast';
import copy from 'copy-text-to-clipboard';
import omit from 'object.omit';
import { chatList, client, ReadersModalInfoAtom } from '../../store';
import 'react-contexify/dist/ReactContexify.css';
import { useRef } from 'react';

const ChatroomItem = ({
  info: { text, author, type, hideName, readers, attachment, channelId, profileImage, key, isFirstChat, date, logId, byMe },
  scrollTo,
  parentRef,
}: {
  info: {
    text: string | undefined;
    author: ChannelUserInfo | undefined;
    type: number;
    hideName: boolean;
    readers: ChannelUserInfo[];
    attachment: Attachment;
    channelId: Long;
    profileImage: string;
    key: number;
    isFirstChat: boolean;
    date: Date;
    logId: Long;
    byMe: boolean;
  };
  scrollTo: (index: number) => void;
  parentRef: RefObject<Scrollbars>;
}) => {
  const setReadersModalInfo = useSetRecoilState(ReadersModalInfoAtom);
  const [width, setWidth] = useState(0);
  const [canExpand, setCanExpand] = useState(false);
  const { show } = useContextMenu({ id: logId.toString() });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setWidth(window.innerWidth);
    window.addEventListener('resize', () => setWidth(window.innerWidth));

    const isOverflow = () => {
      const el = document.querySelector(`div[data-index="${key}"] .ChatroomItem .text .msg .content`);

      return (el?.scrollHeight ?? 0) > (el?.clientHeight ?? 0);
    };
    setTimeout(() => {
      if (isOverflow()) setCanExpand(true);
    }, 100);
  }, []);

  const autolink = (text: string) => {
    const regexp = /(?![^<]*>|[^<>]*<\/)((https?:)\/\/[a-z0-9&#=.\/\-?_]+)/gi;
    return text.replace(regexp, '<a onclick="window.openExternal(`$1`)">$1</a>');
  };

  const includesURL = (text: string) => {
    const regexp =
      /https?:\/\/(www\.)?[-a-zA-Z0-9ㄱ-ㅎ가-힣@:%._\+~#=]{1,256}\.[a-zA-Z0-9ㄱ-ㅎ가-힣()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
    return regexp.test(text);
  };

  const getFirstURL = (text: string) => {
    const regexp =
      /https?:\/\/(www\.)?[-a-zA-Z0-9ㄱ-ㅎ가-힣@:%._\+~#=]{1,256}\.[a-zA-Z0-9ㄱ-ㅎ가-힣()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
    return (text.match(regexp) ?? [''])[0];
  };

  const DateFeed = () => (
    <li className={'ChatroomItem feed invite'}>
      <div className={'text'}>
        <div className={'msg'}>
          {date.getFullYear()}년 {date.getMonth() + 1}월 {date.getDate()}일
        </div>
      </div>
    </li>
  );

  const profileStyle: React.CSSProperties = {
    backgroundImage: hideName ? undefined : `url('${profileImage === '' ? 'https://i.ibb.co/qrDqbNM/profile.png' : profileImage}')`,
    height: hideName ? 0 : undefined,
  };

  return (
    <>
      <Menu id={logId.toString()}>
        {type !== KnownChatType.PHOTO ? (
          <Item onClick={() => copy(text ?? '')}>텍스트 복사</Item>
        ) : (
          <Item onClick={() => copy((attachment?.url as string | undefined) ?? '')}>이미지 주소 복사</Item>
        )}
        {byMe && type < DELETED_MESSAGE_OFFSET && (
          <Item
            onClick={async () => {
              const channel = client.channelList.get(channelId)!;
              const deleteChatRes = await channel.deleteChat({ logId });
              if (!deleteChatRes.success) return toast.error(`메시지 삭제 실패: ${deleteChatRes.status.toString()}`);

              client.emit('chat_deleted', {} as Readonly<TypedChatlog<KnownChatType.FEED>>, channel, {
                feedType: KnownFeedType.DELETE_TO_ALL,
                logId,
              });
            }}
          >
            삭제
          </Item>
        )}
      </Menu>
      {(() => {
        switch (type) {
          case KnownChatType.FEED:
            const feed = JSON.parse(text ?? '{}');

            switch (feed.feedType) {
              case KnownFeedType.INVITE:
                return (
                  <div
                    className={'chat'}
                    data-id={logId.toString()}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      show(e);
                    }}
                    ref={ref}
                  >
                    <div className={'text invite'}>
                      <div className={'message'}>
                        <span className={'inviter'}>{feed.inviter.nickName}</span>님이{' '}
                        <span className={'invited'}>{feed.members.map(({ nickName }: { nickName: string }) => nickName).join(', ')}</span>
                        님을 초대했습니다.
                      </div>
                    </div>
                  </div>
                );
              case KnownFeedType.DELETE_TO_ALL:
                // ref.current!.remove();
                return <></>;
              default:
                return (
                  <>
                    <div
                      className={'chat'}
                      data-id={logId.toString()}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        show(e);
                      }}
                      ref={ref}
                    >
                      <div className={'profile'} style={profileStyle} />
                      <div className={'text'}>
                        {!hideName && <div className={'name'}>{author?.nickname ?? '(알 수 없음)'}</div>}
                        <div className={'message error'}>
                          <div className={'line'}>
                            <div className={'error'}>
                              <AlertCircle size={18} stroke={'#838383'} strokeWidth={1.7} />
                            </div>
                            <div className={'content'}>표시할 수 없는 메시지입니다.</div>
                          </div>
                          <span className={'msgType'}>
                            메시지 타입: {KnownChatType[type]} ({type})
                            <br />
                            피드 타입: {KnownFeedType[feed.feedType]} ({feed.feedType})
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                );
            }
          case KnownChatType.TEXT:
            return (
              <>
                <div
                  className={'chat'}
                  data-id={logId.toString()}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    show(e);
                  }}
                  ref={ref}
                >
                  <div className={'profile'} style={profileStyle} />
                  <div className={'text'}>
                    {!hideName && <div className={'name'}>{author?.nickname ?? '(알 수 없음)'}</div>}
                    <div className={'message'}>
                      <div
                        className={'content'}
                        dangerouslySetInnerHTML={{
                          __html: autolink((text ?? '').replace(/</gi, '&lt;').replace(/>/gi, '&gt;')).replace('\n', '<br />'),
                        }}
                      />
                    </div>
                  </div>
                </div>
              </>
            );
          case KnownChatType.PHOTO:
            const maxWidth = (width - 395.2) * 0.9;
            const maxHeight = 320;
            const img = attachment as PhotoAttachment;

            const [w, h] = (() => {
              if (img.w <= maxWidth && img.h <= maxHeight) return [img.w, img.h];
              if (img.w * (maxHeight / img.h) > maxWidth) return [maxWidth, img.h * (maxWidth / img.w)];
              else return [img.w * (maxHeight / img.h), maxHeight];
            })();

            return (
              <>
                <div
                  className={'chat'}
                  data-id={logId.toString()}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    show(e);
                  }}
                  ref={ref}
                >
                  <div className={'profile'} style={profileStyle} />
                  <div className={'text'}>
                    {!hideName && <div className={'name'}>{author?.nickname ?? '(알 수 없음)'}</div>}
                    <img
                      className={'image'}
                      src={attachment.url as string}
                      height={Number.isNaN(Number(h <= 0 ? 100 : h)) ? 100 : h <= 0 ? 100 : h}
                      width={Number.isNaN(Number(w <= 0 ? 100 : w)) ? 100 : w <= 0 ? 100 : w}
                    />
                  </div>
                </div>
              </>
            );
          case KnownChatType.REPLY:
            const reply = attachment as ReplyAttachment;

            return (
              <>
                <div
                  className={'chat'}
                  data-id={logId.toString()}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    show(e);
                  }}
                  ref={ref}
                >
                  <div className={'profile'} style={profileStyle} />
                  <div className={'text'}>
                    {!hideName && <div className={'name'}>{author?.nickname ?? '(알 수 없음)'}</div>}
                    <div className={'message'}>
                      <div
                        className={'reply'}
                        onClick={() => {
                          const target: HTMLDivElement | null = parentRef.current!.container.querySelector(
                            `.chat[data-id='${reply.src_logId.toString()}']`
                          );
                          if (target === null) return toast.error('대상 메시지를 찾을 수 없습니다!');

                          parentRef.current!.scrollTop(target.offsetTop - parentRef.current!.getClientHeight() / 2 + target.clientHeight / 2);
                          target.classList.add('focus');
                          setTimeout(() => target.classList.remove('focus'), 1000);
                        }}
                      >
                        <span className={'label'}>
                          {client.channelList.get(channelId)?.getUserInfo({ userId: reply.src_userId })?.nickname ?? '(알 수 없음)'}에게 답장
                        </span>
                        {reply.src_message}
                      </div>
                      <div
                        className={'content'}
                        dangerouslySetInnerHTML={{
                          __html: autolink((text ?? '').replace(/</gi, '&lt;').replace(/>/gi, '&gt;')).replace('\n', '<br />'),
                        }}
                      />
                    </div>
                  </div>
                </div>
              </>
            );
          case KnownChatType.STICKER:
            const emoticon = attachment as EmoticonAttachment;

            console.log(emoticon.path);

            const playSound = async () => {
              if (emoticon.sound) await new Audio(`http://item-kr.talk.kakao.co.kr/dw/${emoticon.sound}`).play();
            };

            return (
              <>
                <div
                  className={'chat'}
                  data-id={logId.toString()}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    show(e);
                  }}
                  ref={ref}
                >
                  <div className={'profile'} style={profileStyle} />
                  <div className={'text'}>
                    {!hideName && <div className={'name'}>{author?.nickname ?? '(알 수 없음)'}</div>}
                    <img
                      className={'emoticon'}
                      src={`http://item-kr.talk.kakao.co.kr/dw/${emoticon.path}`}
                      alt={'Emoticon'}
                      height={160}
                      onClick={playSound}
                      onLoad={playSound}
                    />
                  </div>
                </div>
              </>
            );
          default:
            if (type >= DELETED_MESSAGE_OFFSET)
              return (
                <>
                  <div
                    className={'chat'}
                    data-id={logId.toString()}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      show(e);
                    }}
                    ref={ref}
                  >
                    <div className={'profile'} style={profileStyle} />
                    <div className={'text'}>
                      {!hideName && <div className={'name'}>{author?.nickname ?? '(알 수 없음)'}</div>}
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

            return (
              <>
                <div
                  className={'chat'}
                  data-id={logId.toString()}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    show(e);
                  }}
                  ref={ref}
                >
                  <div className={'profile'} style={profileStyle} />
                  <div className={'text'}>
                    {!hideName && <div className={'name'}>{author?.nickname ?? '(알 수 없음)'}</div>}
                    <div className={'message error'}>
                      <div className={'line'}>
                        <div className={'error'}>
                          <AlertCircle size={18} stroke={'#838383'} strokeWidth={1.7} />
                        </div>
                        <div className={'content'}>표시할 수 없는 메시지입니다.</div>
                      </div>
                      <span className={'msgType'}>
                        메시지 타입: {KnownChatType[type]} ({type})
                      </span>
                    </div>
                  </div>
                </div>
              </>
            );
        }
      })()}
    </>
  );
};

export default ChatroomItem;
