import { useEffect, useState } from 'react';

export function useAuth() {
  const [loggedUser, setLoggedUser] = useState(() => {
    const auxiliaryState = localStorage.getItem('loggedUserInfo');
    return auxiliaryState ? JSON.parse(auxiliaryState) : null;
  });
  useEffect(() => {
    localStorage.setItem('loggedUserInfo', JSON.stringify(loggedUser));
  }, [loggedUser]);

  return { loggedUser, setLoggedUser };
}
