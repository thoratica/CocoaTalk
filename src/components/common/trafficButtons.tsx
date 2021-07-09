import React from 'react';
import styled from 'styled-components';
import type { BrowserWindow } from 'electron';

const win: BrowserWindow = window.require('@electron/remote').getCurrentWindow();

const StyledTrafficButton = styled.button<{ role: 'CLOSE' | 'MINIMIZE' | 'MAXIMIZE' }>`
  height: 0.8rem;
  width: 0.8rem;
  display: inline-flex;
  margin: 0.7rem 0.15rem;
  border: 0;
  border-radius: 1rem;
  -webkit-app-region: no-drag;
  background-color: ${(props) => (props.role === 'CLOSE' ? '#ff5c5c' : props.role === 'MINIMIZE' ? '#ffbd4c' : '#00ca56')};

  &:first-child {
    margin-left: 0.8rem;
  }
`;

const TrafficButtons = () => {
  return (
    <div className={'trafficButtons'} style={{ position: 'fixed' }}>
      <StyledTrafficButton role={'CLOSE'} onClick={() => win.close()} />
      <StyledTrafficButton role={'MINIMIZE'} onClick={() => win.minimize()} />
      <StyledTrafficButton role={'MAXIMIZE'} onClick={() => (!win.isMaximized() ? win.maximize() : win.unmaximize())} />
    </div>
  );
};

export default TrafficButtons;
