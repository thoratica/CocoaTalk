// import React from 'react';

// const Chat = ({ info: { name, profileImage, message } }: { info: { name: string; profileImage: string; message: string | undefined } }) => {
//   return (
//     <div className={'chat'}>
//       <div className={'profile'} style={{ backgroundImage: `url('${profileImage}')` }} />
//       <div className={'name'}>{name}</div>
//       <div className={'message'}>
//         <div className={'content'}>{message}</div>
//       </div>
//     </div>
//   );
// };

// export default Chat;

import React, { Suspense, useEffect, useRef, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
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
} from 'node-kakao';
import { client, ReadersModalInfoAtom } from '../../store';

const ChatroomItem = ({
  info: { text, author, type, hideName, readers, attachment, channelId, profileImage, key, isFirstChat, date },
  scrollTo,
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
  };
  scrollTo: (index: number) => void;
}) => {
  const setReadersModalInfo = useSetRecoilState(ReadersModalInfoAtom);
  const [width, setWidth] = useState(0);
  const [canExpand, setCanExpand] = useState(false);

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

  const byMe = client.clientUser.userId.toString() === author?.userId.toString();

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

  switch (type) {
    // case KnownChatType.FEED:
    //   const feed = JSON.parse(text ?? '{}');

    //   switch (feed.feedType) {
    //     case KnownFeedType.INVITE:
    //       return (
    //         <>
    //           {isFirstChat ? <DateFeed /> : <></>}
    //           <li className={'ChatroomItem feed invite'}>
    //             <div className={'text'}>
    //               <div className={'msg'}>
    //                 <span className={'inviter'}>{feed.inviter.nickName}</span>님이{' '}
    //                 <span className={'invited'}>{feed.members.map(({ nickName }: { nickName: string }) => nickName).join(', ')}</span>님을
    //                 초대했습니다.
    //               </div>
    //             </div>
    //           </li>
    //         </>
    //       );
    //     case KnownFeedType.DELETE_TO_ALL:
    //       return <span style={{ height: 1, display: 'block' }}>&nbsp;</span>;
    //     default:
    //       return (
    //         <>
    //           {isFirstChat ? <DateFeed /> : <></>}
    //           <li className={`ChatroomItem unavailable${byMe ? ' me' : ''}`}>
    //             {byMe ? <></> : <div className={'profile'} style={!hideName ? { backgroundImage: `url('${profileImage}')` } : { height: 1 }} />}
    //             <div className={'text'}>
    //               <div className={`name${hideName ? ' hide' : ''}`}>{author?.nickname ?? '(알 수 없음)'}</div>
    //               <div className={`msg${!hideName ? ' top' : ''}`}>
    //                 <span className={'content error'}>
    //                   <span className={'error'} />
    //                   표시할 수 없는 메시지입니다.
    //                 </span>
    //                 <span className={'msgType'}>
    //                   메시지 타입: {KnownChatType[type]} ({type})
    //                   <br />
    //                   피드 타입: {KnownFeedType[feed.feedType]} ({feed.feedType})
    //                 </span>
    //               </div>
    //             </div>
    //           </li>
    //         </>
    //       );
    //   }
    case KnownChatType.TEXT:
      return (
        <>
          <div className={'chat'}>
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
    // case KnownChatType.PHOTO:
    //   const maxWidth = (width - 395.2) * 0.9;
    //   const maxHeight = 320;
    //   const img = attachment as PhotoAttachment;

    //   const [w, h] = (() => {
    //     if (img.w <= maxWidth && img.h <= maxHeight) return [img.w, img.h];
    //     if (img.w * (maxHeight / img.h) > maxWidth) return [maxWidth, img.h * (maxWidth / img.w)];
    //     else return [img.w * (maxHeight / img.h), maxHeight];
    //   })();

    //   return (
    //     <>
    //       {isFirstChat ? <DateFeed /> : <></>}
    //       <li className={`ChatroomItem${client.clientUser.userId.toString() === author?.userId.toString() ? ' me' : ''}`}>
    //         {byMe ? (
    //           <div className={'readers'} onClick={() => setReadersModalInfo({ visible: true, data: readers })}>
    //             &#xE000; {readers.length}
    //           </div>
    //         ) : (
    //           <div className={'profile'} style={!hideName ? { backgroundImage: `url('${profileImage}')` } : { height: 1 }} />
    //         )}
    //         <div className={'text'}>
    //           <div className={`name${hideName ? ' hide' : ''}`} style={{ maxWidth: (width - 355.2) * 0.8 }}>
    //             {author?.nickname ?? '(알 수 없음)'}
    //           </div>
    //           <Suspense fallback={<div className={'imageLoading'} style={{ height: h, width: w }} />}>
    //             <img src={attachment.url as string} height={h} width={w} />
    //           </Suspense>
    //         </div>
    //         {!byMe ? (
    //           <div className={'readers'} onClick={() => setReadersModalInfo({ visible: true, data: readers })}>
    //             {readers.length} &#xE001;
    //           </div>
    //         ) : (
    //           <></>
    //         )}
    //       </li>
    //     </>
    //   );
    // case KnownChatType.REPLY:
    //   return (
    //     <>
    //       {isFirstChat ? <DateFeed /> : <></>}
    //       <li
    //         className={`ChatroomItem${client.clientUser.userId.toString() === author?.userId.toString() ? ' me' : ''}${
    //           expand ? ' expanded' : ''
    //         }`}
    //       >
    //         {byMe ? (
    //           <div className={'readers'} onClick={() => setReadersModalInfo({ visible: true, data: readers })}>
    //             &#xE000; {readers.length}
    //           </div>
    //         ) : (
    //           <div className={'profile'} style={!hideName ? { backgroundImage: `url('${profileImage}')` } : { height: 1 }} />
    //         )}
    //         <div className={'text'}>
    //           <div className={`name${hideName ? ' hide' : ''}`} style={{ maxWidth: (width - 355.2) * 0.8 }}>
    //             {author?.nickname ?? '(알 수 없음)'}
    //           </div>
    //           <div className={`msg${!hideName ? ' top' : ''}`} style={{ maxWidth: (width - 355.2) * 0.8 }}>
    //             {/* @ts-ignore */}
    //             <div
    //               className={'original'}
    //               onClick={() =>
    //                 scrollTo(
    //                   chatList[channelId.toString()]
    //                     .filter(
    //                       (chat) =>
    //                         !(chat.type === KnownChatType.FEED && JSON.parse(chat.text ?? '{}')?.feedType === KnownFeedType.DELETE_TO_ALL)
    //                     )
    //                     .findIndex((chat) => chat.logId.toString() === (attachment as ReplyAttachment).src_logId.toString()) ?? -1
    //                 )
    //               }
    //             >
    //               <span className={'info'}>
    //                 <span className={'name'}>
    //                   {client.channelList.get(channelId)?.getUserInfo({ userId: (attachment as ReplyAttachment).src_userId })?.nickname ??
    //                     '(알 수 없음)'}
    //                 </span>
    //                 에게 답장
    //               </span>
    //               {(attachment as ReplyAttachment).src_message}
    //             </div>
    //             <span
    //               className={'content'}
    //               dangerouslySetInnerHTML={{
    //                 __html: autolink((text ?? '').replace(/</gi, '&lt;').replace(/>/gi, '&gt;').replace('\n', '<br />')),
    //               }}
    //             />
    //             {canExpand ? (
    //               <span className={'expand'} onClick={() => setExpand(!expand)}>
    //                 <span className={'expandIcon'} />
    //                 {expand ? '닫기' : '전체보기'}
    //               </span>
    //             ) : (
    //               <></>
    //             )}
    //           </div>
    //           {/* {includesURL(text ?? '') ? <Opengraph url={getFirstURL(text ?? '')} /> : <></>} */}
    //         </div>
    //         {!byMe ? (
    //           <div className={'readers'} onClick={() => setReadersModalInfo({ visible: true, data: readers })}>
    //             {readers.length} &#xE001;
    //           </div>
    //         ) : (
    //           <></>
    //         )}
    //       </li>
    //     </>
    //   );
    // case KnownChatType.STICKER:
    //   const emoticon = attachment as EmoticonAttachment;

    //   console.log(emoticon.path);

    //   const playSound = async () => {
    //     if (emoticon.sound) {
    //       const url = `http://item-kr.talk.kakao.co.kr/dw/${emoticon.sound}`;
    //       // @ts-ignore
    //       const sound = new Audio(url);

    //       await sound.play();
    //     }
    //   };

    //   return (
    //     <>
    //       {isFirstChat ? <DateFeed /> : <></>}
    //       <li className={`ChatroomItem${client.clientUser.userId.toString() === author?.userId.toString() ? ' me' : ''}`}>
    //         {byMe ? (
    //           <div className={'readers'} onClick={() => setReadersModalInfo({ visible: true, data: readers })}>
    //             &#xE000; {readers.length}
    //           </div>
    //         ) : (
    //           <div className={'profile'} style={!hideName ? { backgroundImage: `url('${profileImage}')` } : { height: 1 }} />
    //         )}
    //         <div className={'text'}>
    //           <div className={`name${hideName ? ' hide' : ''}`} style={{ maxWidth: (width - 355.2) * 0.8 }}>
    //             {author?.nickname ?? '(알 수 없음)'}
    //           </div>
    //           <img
    //             className={'emoticon'}
    //             src={`http://item-kr.talk.kakao.co.kr/dw/${emoticon.path}`}
    //             alt={'Emoticon'}
    //             height={160}
    //             onClick={playSound}
    //             onLoad={playSound}
    //           />
    //         </div>
    //         {!byMe ? (
    //           <div className={'readers'} onClick={() => setReadersModalInfo({ visible: true, data: readers })}>
    //             {readers.length} &#xE001;
    //           </div>
    //         ) : (
    //           <></>
    //         )}
    //       </li>
    //     </>
    //   );
    // case DELETED_MESSAGE_OFFSET + 1:
    // return (
    //   <>
    //     {isFirstChat ? <DateFeed /> : <></>}
    //     <li className={`ChatroomItem deleted${byMe ? ' me' : ''}`}>
    //       {byMe ? <></> : <div className={'profile'} style={!hideName ? { backgroundImage: `url('${profileImage}')` } : { height: 1 }} />}
    //       <div className={'text'}>
    //         <div className={`name${hideName ? ' hide' : ''}`}>{author?.nickname ?? '(알 수 없음)'}</div>
    //         <div className={`msg${!hideName ? ' top' : ''}`}>
    //           <span className={'content error'}>
    //             <span className={'error'} />
    //             삭제된 메시지입니다.
    //           </span>
    //         </div>
    //       </div>
    //     </li>
    //   </>
    // );
    default:
      return (
        <>
          <div className={'chat'}>
            <div className={'profile'} style={profileStyle} />
            <div className={'text'}>
              {!hideName && <div className={'name'}>{author?.nickname ?? '(알 수 없음)'}</div>}
              <div className={'message'}>
                <div className={'content'}>표시할 수 없는 메시지입니다.</div>
                <span className={'msgType'}>
                  메시지 타입: {KnownChatType[type]} ({type})
                </span>
              </div>
            </div>
          </div>
        </>
      );
  }
};

export default ChatroomItem;
