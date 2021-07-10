import { fromFile } from 'file-type';
import { readFileSync } from 'fs';
import { AttachmentApi, ChatBuilder, FileAttachment, KnownChatType, Long, PhotoAttachment, TalkChatData } from 'node-kakao';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { Paperclip, Send } from 'react-feather';
import toast from 'react-hot-toast';
import { useRecoilValue } from 'recoil';
import slash from 'slash';
import sizeOf from 'image-size';
import { chatList, client, SelectedAtom } from '../../store';
import Input from '../common/Input';
import Chat from './Chat';
import './Chatroom.scss';
import { createHash } from 'crypto';

const getDay = (date: Date) => `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;
let lastRenderedMsgType = 0;
let lastRenderedMsgAuthor = '';

const Chatroom = () => {
  const selected = useRecoilValue(SelectedAtom);
  const channel = Array.from(client.channelList.all()).find((channel) => channel.channelId.toString() === selected.id.toString());
  const [name, setName] = useState(channel?.getDisplayName() ?? '(알 수 없음)');
  const [useAutoScroll, setUseAutoScroll] = useState(true);
  const [disabled, setDisabled] = useState(true);
  const ref = useRef<Scrollbars>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [s, updateState] = useState({});
  const forceUpdate = useCallback(() => updateState({}), []);

  useEffect(() => {
    (ref.current!.container.querySelector('div[style]')! as HTMLDivElement).style.padding = '0.5rem 0.9rem';
    client.on('chat', () => forceUpdate());
    client.on('chat_deleted', () => forceUpdate());
  }, []);
  useEffect(() => {
    setName(channel?.getDisplayName() ?? '(알 수 없음)');
    ref.current!.scrollToBottom();
  }, [selected]);
  useEffect(() => void (useAutoScroll && ref.current!.scrollToBottom()), [s]);

  return (
    <div className={'chatroom'}>
      <div className={'roomName'}>
        <span className={'text'} onClick={() => setName('wa')}>
          {name}
        </span>
      </div>
      <div className={'chatList'}>
        <Scrollbars
          ref={ref}
          onScroll={() => {
            const canAutoScroll = ref.current!.getScrollHeight() - ref.current!.getClientHeight() - ref.current!.getScrollTop() <= 100;

            if (useAutoScroll) {
              if (!canAutoScroll) setUseAutoScroll(false);
            } else {
              if (canAutoScroll) setUseAutoScroll(true);
            }
          }}
        >
          {chatList.get(selected.id.toString())?.map((chat, key) => {
            if (chatList === undefined || chat === undefined) return null;
            const userInfo = channel?.getUserInfo(chat.sender);
            const prevChatlog = (chatList.get(channel?.channelId.toString() ?? '') ?? [])[(key === 0 ? 1 : key) - 1];
            if (prevChatlog === undefined) return null;
            const prevUserInfo = channel?.getUserInfo(prevChatlog.sender);
            if (prevUserInfo === undefined) return null;

            const info = {
              profileImage: userInfo?.profileURL ?? 'https://i.ibb.co/qrDqbNM/profile.png',
              attachment: chat.attachment ?? {},
              author: userInfo,
              channelId: channel?.channelId ?? Long.fromNumber(0),
              hideName: key !== 0 && lastRenderedMsgAuthor === chat.sender.userId.toString(),
              readers: channel?.getReaders(chat) ?? [],
              isFirstChat:
                getDay(new Date(prevChatlog.sendAt < 1000000000000 ? prevChatlog.sendAt * 1000 : prevChatlog.sendAt)) !==
                getDay(new Date(chat.sendAt < 1000000000000 ? chat.sendAt * 1000 : chat.sendAt)),
              date: new Date(chat.sendAt < 1000000000000 ? chat.sendAt * 1000 : chat.sendAt),
              key,
              text: chat.text,
              type: chat.type,
              logId: chat.logId,
              byMe: chat.sender.userId.toString() === client.clientUser.userId.toString(),
            };

            lastRenderedMsgType = chat.type;
            lastRenderedMsgAuthor = chat.sender.userId.toString();

            return (
              <Chat
                parentRef={ref}
                info={info}
                scrollTo={(index: number) => (index === -1 ? alert('이동할 수 없는 메시지입니다.') : ref.current!.scrollToBottom())}
                key={key}
              />
            );
          })}
        </Scrollbars>
      </div>
      <form
        className={'form'}
        onSubmit={async (e) => {
          e.preventDefault();
          const message = inputRef.current!.value;
          if (message.trim() === '') return;

          const sendChatRes = await channel?.sendChat(message);
          if (!sendChatRes?.success) return toast.error(`메시지 전송 실패: ${sendChatRes?.status}`);

          chatList.get(selected.id.toString())?.push(sendChatRes.result);
          inputRef.current!.value = '';
          forceUpdate();
        }}
      >
        <label className={'file'}>
          <Paperclip size={18} strokeWidth={1.7} />
          <input
            type={'file'}
            multiple={true}
            onChange={async (e) => {
              const tmpFileList: File[] = Array.from((e.target as any).files);

              tmpFileList.forEach(async (file) => {
                const path = slash((file as any).path);
                const content = readFileSync(path);
                const mime = (await fromFile(path))?.mime ?? '';
                const type = mime.includes('image') ? KnownChatType.PHOTO : mime.includes('video') ? KnownChatType.VIDEO : KnownChatType.FILE;
                const attachRes = await AttachmentApi.upload(type, file.name, content);

                if (!attachRes.success) return;

                const attachment = attachRes.result;

                const chat = new ChatBuilder();

                if (type === KnownChatType.PHOTO) {
                  const dimensions = sizeOf(content);

                  chat.attachment(attachment).attachment({
                    cs: (() => {
                      const checksum = createHash('sha1');
                      checksum.update(content);
                      return checksum.digest('hex');
                    })(),
                    h: dimensions.height,
                    w: dimensions.width,
                    mt: mime,
                    thumbnailHeight: dimensions.height,
                    thumbnailWidth: dimensions.width,
                    thumbnailUrl: attachment.path,
                  } as PhotoAttachment);
                } else {
                  chat.attachment(attachment).attachment({
                    name: file.name,
                    expire: (() => {
                      const tmp = new Date();
                      tmp.setDate(tmp.getDate() + 14);
                      return tmp.valueOf();
                    })(),
                    cs: (() => {
                      const checksum = createHash('sha1');
                      checksum.update(content);
                      return checksum.digest('hex');
                    })(),
                    size: file.size,
                  } as FileAttachment);
                }

                const sendChatRes = await channel?.sendChat(chat.build(type));
                if (sendChatRes === undefined) return;
                if (sendChatRes.success) client.emit('chat', new TalkChatData(sendChatRes.result), channel!);
              });
              (e.target as any).value = [];
            }}
          />
        </label>
        <Input
          type={'text'}
          placeholder={'메시지를 입력하세요...'}
          inputRef={inputRef}
          onChange={(e) => {
            const value = e.target.value.trim();

            if (disabled) {
              if (value !== '') setDisabled(false);
            } else {
              if (value === '') setDisabled(true);
            }
          }}
        />
        <label>
          <Input type={'submit'} />
          <button role={'form'} className={disabled ? 'disabled' : undefined}>
            <Send size={18} strokeWidth={1.7} />
          </button>
        </label>
      </form>
    </div>
  );
};

export default Chatroom;
