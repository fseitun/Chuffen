import { useEffect, useState } from 'react';

export function useAuth() {
  const [loggedUser, setLoggedUser] = useState(() => {
    const localStorageLoggedUserInfo = localStorage.getItem('loggedUserInfo');
    return localStorageLoggedUserInfo ? JSON.parse(localStorageLoggedUserInfo) : null;
  });
  useEffect(() => {
    localStorage.setItem('loggedUserInfo', JSON.stringify(loggedUser));
  }, [loggedUser]);

  return { loggedUser, setLoggedUser };
}
