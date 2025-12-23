import {RefObject, useEffect} from 'react';

export const useOutsideClick = (ref: RefObject<HTMLElement>, handler: () => void) => {
  useEffect(() => {
    let isMounted = true;
    const handleClick = (event: MouseEvent) => {
      if (
        isMounted
        && ref.current
        && ref.current.isConnected
        && event.target instanceof Element && event.target.isConnected
        && !ref.current.contains(event.target)
      ) {
        handler();
      }
    };
    document.body.addEventListener('click', handleClick);
    return () => {
      isMounted = false;
      document.body.removeEventListener('click', handleClick);
    };
  }, [ref, handler]);
};

