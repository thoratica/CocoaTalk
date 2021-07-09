import { ChannelUserInfo } from 'node-kakao';
import React from 'react';

const ChatroomProfile = ({ members }: { members: ChannelUserInfo[] }) =>
  members.length === 0 ? (
    <></>
  ) : members.length === 1 ? (
    <div
      className={'profile'}
      style={{ backgroundImage: `url('${members[0].profileURL === '' ? 'https://i.ibb.co/qrDqbNM/profile.png' : members[0].profileURL}')` }}
    />
  ) : members.length === 2 ? (
    <table className={'profileWrapper profile-2'}>
      <thead>
        <tr>
          <th>
            <div
              className={'profile'}
              style={{ backgroundImage: `url('${members[0].profileURL === '' ? 'https://i.ibb.co/qrDqbNM/profile.png' : members[0].profileURL}')` }}
            />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <div
              className={'profile'}
              style={{ backgroundImage: `url('${members[1].profileURL === '' ? 'https://i.ibb.co/qrDqbNM/profile.png' : members[1].profileURL}')` }}
            />
          </td>
        </tr>
      </tbody>
    </table>
  ) : members.length === 3 ? (
    <table className={'profileWrapper profile-3'}>
      <thead>
        <tr>
          <th>
            <div
              className={'profile'}
              style={{ backgroundImage: `url('${members[0].profileURL === '' ? 'https://i.ibb.co/qrDqbNM/profile.png' : members[0].profileURL}')` }}
            />
          </th>
          <th>
            <div
              className={'profile'}
              style={{ backgroundImage: `url('${members[1].profileURL === '' ? 'https://i.ibb.co/qrDqbNM/profile.png' : members[1].profileURL}')` }}
            />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <div
              className={'profile'}
              style={{ backgroundImage: `url('${members[2].profileURL === '' ? 'https://i.ibb.co/qrDqbNM/profile.png' : members[2].profileURL}')` }}
            />
          </td>
        </tr>
      </tbody>
    </table>
  ) : (
    <table className={'profileWrapper profile-4'}>
      <thead>
        <tr>
          <th>
            <div
              className={'profile'}
              style={{ backgroundImage: `url('${members[0].profileURL === '' ? 'https://i.ibb.co/qrDqbNM/profile.png' : members[0].profileURL}')` }}
            />
          </th>
          <th>
            <div
              className={'profile'}
              style={{ backgroundImage: `url('${members[1].profileURL === '' ? 'https://i.ibb.co/qrDqbNM/profile.png' : members[1].profileURL}')` }}
            />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <div
              className={'profile'}
              style={{ backgroundImage: `url('${members[2].profileURL === '' ? 'https://i.ibb.co/qrDqbNM/profile.png' : members[2].profileURL}')` }}
            />
          </td>
          <td>
            <div
              className={'profile'}
              style={{ backgroundImage: `url('${members[3].profileURL === '' ? 'https://i.ibb.co/qrDqbNM/profile.png' : members[3].profileURL}')` }}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );

export default ChatroomProfile;
