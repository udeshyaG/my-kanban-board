import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

const AuthContextProvider = (props) => {
  const [auth, setAuth] = useState(() => {
    const localdata = localStorage.getItem('auth');

    return localdata
      ? JSON.parse(localdata)
      : { user: null, isLoggedIn: false };
  });

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
