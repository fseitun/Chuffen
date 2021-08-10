import { useEffect, useState } from 'react';

export function useAuth() {
  const [isAuth, setIsAuth] = useState(() => localStorage.getItem('loggedIn'));
  console.log(isAuth);
  useEffect(() => {
    isAuth === null && localStorage.removeItem('loggedIn');
    isAuth !== null && localStorage.setItem('loggedIn', isAuth);
  }, [isAuth]);
  return { setIsAuth, isAuth };
}
