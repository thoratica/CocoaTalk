import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AttachmentApi, ChatBuilder, FileAttachment, KnownChatType, PhotoAttachment, TalkChatData } from 'node-kakao';
import { useRecoilValue } from 'recoil';
import toast from 'react-hot-toast';
import { Paperclip, Send } from 'react-feather';
import { createHash } from 'crypto';
import { List } from 'react-virtualized';

// fileInfo
import { fromFile } from 'file-type';
import { readFileSync } from 'fs';
import slash from 'slash';
import sizeOf from 'image-size';

import VirtualScroll from './VirtualScroll';
import { chatList as _chatList, client, SelectedAtom } from '../../store';
import Input from '../common/Input';
import Chat from './Chat';
import './Chatroom.scss';

const getDay = (date: Date) => `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;
let lastRenderedMsgAuthor = '';

const Chatroom = () => {
  const selected = useRecoilValue(SelectedAtom);
  const channel = Array.from(client.channelList.all()).find((channel) => channel.channelId.toString() === selected.id.toString());

  const [name, setName] = useState(channel?.getDisplayName() ?? '(알 수 없음)');
  const [useAutoScroll, setUseAutoScroll] = useState(true);
  const [disabled, setDisabled] = useState(true);
  const [s, updateState] = useState({});
  const [listHeight, setListHeight] = useState(0);

  const listParentRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<List>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const updateHeight = useCallback(() => setListHeight(listParentRef.current?.offsetHeight ?? 0), []);
  const forceUpdate = useCallback(() => updateState({}), []);
  const chatList = _chatList.get(selected.id.toString()) ?? [];

  useEffect(() => {
    window.addEventListener('resize', () => updateHeight());
    client.on('chat', () => forceUpdate());
    client.on('chat_deleted', () => forceUpdate());

    updateHeight();

    chatList
      .filter((chat) => chat.type === KnownChatType.PHOTO)
      .reverse()
      .map((chat) => {
        const img = document.createElement('img');
        img.src = (chat.attachment as { url: string }).url;
        img.onload = () => console.log(img.src);
      });

    return () => {
      window.addEventListener('resize', () => updateHeight());
      client.on('chat', () => forceUpdate());
      client.on('chat_deleted', () => forceUpdate());
    };
  }, []);
  useEffect(() => {
    setName(channel?.getDisplayName() ?? '(알 수 없음)');
  }, [selected]);
  useEffect(() => void useAutoScroll, [s]);

  const items =
    chatList.map((chat, key) => {
      if (chatList === undefined || chat === undefined) return () => <></>;

      const hideName = key !== 0 && lastRenderedMsgAuthor === chat.sender.userId.toString();
      lastRenderedMsgAuthor = chat.sender.userId.toString();

      return ({ measure }: { measure: () => void }) => (
        <Chat
          chat={chat}
          channel={channel}
          hideName={hideName}
          key={key}
          measure={measure}
          scrollTo={(i: number) => void listRef.current?.scrollToRow(i)}
          index={key}
        />
      );
    }) ?? [];

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = inputRef.current!.value;
    if (message.trim() === '') return;

    const sendChatRes = await channel?.sendChat(message);
    if (!sendChatRes?.success) return toast.error(`메시지 전송 실패: ${sendChatRes?.status}`);

    chatList.push(sendChatRes.result);
    inputRef.current!.value = '';
    setDisabled(true);
    forceUpdate();
  };

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  return (
    <div className={'chatroom'}>
      <div className={'roomName'}>
        <span className={'text'} onClick={() => setName('wa')}>
          {name}
        </span>
      </div>
      <div className={'chatList'} ref={listParentRef}>
        <VirtualScroll items={items} height={listHeight - 0.5} listRef={listRef} reRender={selected} />
      </div>
      <form className={'form'} onSubmit={onSubmit}>
        <label className={'file'}>
          <div className={'button'}>
            <Paperclip size={18} strokeWidth={1.7} />
          </div>
          <input type={'file'} multiple={true} onChange={uploadFile} />
        </label>
        <Input
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
          onSubmit={onSubmit}
          multiline
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
