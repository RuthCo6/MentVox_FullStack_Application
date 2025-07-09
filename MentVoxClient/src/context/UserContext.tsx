 // ניהול מצב המשתמשים (כמו לוגין)
 import React, { createContext, useContext, useState,ReactNode  } from 'react';

 const UserContext = createContext<any>(null);

export function useUser() {
  return useContext(UserContext);
}

interface UserProviderProps {
  children: ReactNode; // הגדרת טיפוס עבור children
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<any>(null); 

  const login = (userInfo: React.SetStateAction<null>) => {
    setUser(userInfo);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
