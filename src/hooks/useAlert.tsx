import React, { useState } from 'react';

const useAlert = (): [(content: string) => void, JSX.Element] => {
  const [alertJSX, setAlertJSX] = useState(<></>);
  const [showAlert, setShowAlert] = useState(false);

  const alert = (content: string) => {
    setShowAlert(true);
    setAlertJSX(
      <div className={'alert'} style={{ display: showAlert ? 'inherit' : 'none' }}>
        <div className={'content'}>{content}</div>
        <button className={'close'} onClick={() => setShowAlert(false)}>
          확인
        </button>
      </div>
    );
  };

  return [alert, alertJSX];
};

export default useAlert;
