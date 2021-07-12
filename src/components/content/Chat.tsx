import React, { useEffect, useState } from 'react';
import { Menu, Item, useContextMenu } from 'react-contexify';
import { Chatlog, DELETED_MESSAGE_OFFSET, KnownChatType, KnownFeedType, TalkChannel, TypedChatlog } from 'node-kakao';
import toast from 'react-hot-toast';
import copy from 'copy-text-to-clipboard';
import 'react-contexify/dist/ReactContexify.css';
import { useRef } from 'react';
import { client } from '../../store';

import Text from './chat/Text';
import Photo from './chat/Photo';
import Reply from './chat/Reply';
import Sticker from './chat/Sticker';
import UnsupportedChat from './chat/Unsupported';
import UnsupportedFeed from './chat/feed/Unsupported';
import Deleted from './chat/Deleted';
import Invite from './chat/feed/Invite';

const ChatroomItem = ({ chat, channel, hideName }: { chat: Chatlog; channel: TalkChannel | undefined; hideName: boolean }) => {
  const userInfo = channel?.getUserInfo(chat.sender);
  const [width, setWidth] = useState(0);
  const { show: showContextMenu } = useContextMenu({ id: chat.logId.toString() });
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setWidth(window.innerWidth);
    window.addEventListener('resize', () => setWidth(window.innerWidth));
  }, []);

  const props = { chat, channel, showContextMenu, chatRef, hideName };

  return (
    <>
      <Menu id={chat.logId.toString()}>
        {chat.type !== KnownChatType.PHOTO ? (
          <Item onClick={() => copy(chat.text ?? '')}>텍스트 복사</Item>
        ) : (
          <Item onClick={() => copy((chat.attachment?.url as string | undefined) ?? '')}>이미지 주소 복사</Item>
        )}
        {userInfo?.userId.toString() === client.clientUser.userId.toString() && chat.type < DELETED_MESSAGE_OFFSET && (
          <Item
            onClick={async () => {
              const deleteChatRes = await channel!.deleteChat({ logId: chat.logId });
              if (!deleteChatRes.success) return toast.error(`메시지 삭제 실패: ${deleteChatRes.status.toString()}`);

              client.emit('chat_deleted', {} as Readonly<TypedChatlog<KnownChatType.FEED>>, channel!, {
                feedType: KnownFeedType.DELETE_TO_ALL,
                logId: chat.logId,
              });
            }}
          >
            삭제
          </Item>
        )}
      </Menu>
      {(() => {
        switch (chat.type) {
          case KnownChatType.FEED:
            const feed = JSON.parse(chat.text ?? '{}');

            switch (feed.feedType) {
              case KnownFeedType.INVITE:
                return <Invite {...props} feed={feed} />;
              case KnownFeedType.DELETE_TO_ALL:
                return <></>;
              default:
                return <UnsupportedFeed {...props} feed={feed} />;
            }
          case KnownChatType.TEXT:
            return <Text {...props} />;
          case KnownChatType.PHOTO:
            return <Photo {...props} width={width} />;
          case KnownChatType.REPLY:
            return <Reply {...props} />;
          case KnownChatType.STICKER:
            return <Sticker {...props} />;
          default:
            if (chat.type >= DELETED_MESSAGE_OFFSET) return <Deleted {...props} />;

            return <UnsupportedChat {...props} />;
        }
      })()}
    </>
  );
};

export default ChatroomItem;
