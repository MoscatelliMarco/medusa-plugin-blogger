import { useState, useEffect } from 'react';

const useTimedState = (initialValue: any, delay: number) => {
  const [state, setState] = useState(initialValue);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (state !== null) {
      if (timer) {
        clearTimeout(timer);
      }

      const newTimer = setTimeout(() => {
        setState(null);
      }, delay);

      setTimer(newTimer);
    }

    // Cleanup the timer on unmount or when state changes
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [state, delay]);

  return [state, setState] as const;
};

export default useTimedState;