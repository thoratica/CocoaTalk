import { useRef, useEffect } from 'react';

const usePrevious = (value: any) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = JSON.parse(JSON.stringify(value));
  });

  return ref.current;
};

export default usePrevious;
