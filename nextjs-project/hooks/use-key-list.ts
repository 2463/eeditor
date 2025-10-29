import { useState, useMemo } from 'react';

function useKeyList(initialString) {
  const [value, setValue] = useState(initialString);
  const dollarPosition = useMemo(() => value.indexOf('$'), [value]);

  return {
    value,
    dollarPosition,
    setValue,
  };
}

export default useKeyList;