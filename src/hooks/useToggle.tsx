import { useCallback, useState } from 'react';

const useToggle = (initialState: boolean = false) => {
  const [toggle, setToggle] = useState(initialState);

  return [toggle, useCallback(() => setToggle((state) => !state), [])];
};

export default useToggle;
