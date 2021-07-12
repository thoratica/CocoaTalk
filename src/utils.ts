import React from 'react';

export const autolink = (text: string) => {
  const regexp = /(?![^<]*>|[^<>]*<\/)((https?:)\/\/[a-z0-9&#=.\/\-?_]+)/gi;
  return text.replace(regexp, '<a onclick="window.openExternal(`$1`)">$1</a>');
};

export const profileStyle = (profileImage: string | undefined, hideName: boolean): React.CSSProperties => ({
  backgroundImage: hideName
    ? undefined
    : `url('${profileImage === '' ? 'https://i.ibb.co/qrDqbNM/profile.png' : profileImage ?? 'https://i.ibb.co/qrDqbNM/profile.png'}')`,
  height: hideName ? 0 : undefined,
});

export const includesURL = (text: string) => {
  const regexp = /https?:\/\/(www\.)?[-a-zA-Z0-9ㄱ-ㅎ가-힣@:%._\+~#=]{1,256}\.[a-zA-Z0-9ㄱ-ㅎ가-힣()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
  return regexp.test(text);
};

export const getFirstURL = (text: string) => {
  const regexp = /https?:\/\/(www\.)?[-a-zA-Z0-9ㄱ-ㅎ가-힣@:%._\+~#=]{1,256}\.[a-zA-Z0-9ㄱ-ㅎ가-힣()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
  return (text.match(regexp) ?? [''])[0];
};
