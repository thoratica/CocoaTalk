import React from 'react';

const useForceUpdate = (): (() => void) => React.useReducer(() => ({}), {})[1] as () => void;

export default useForceUpdate;
