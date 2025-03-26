"use client";

import { createContext, useState, useEffect } from "react";

interface ContextProps {
  children: React.ReactNode;
}

interface UserType {
  id: number;
  email: string;
  username: string;
  userImg: string;
  bgImg: string;
}

interface UserContextType {
  user: UserType | undefined;
  setUser: (newState: UserType | undefined) => void;
}

const initialValue: UserContextType = {
  user: undefined,
  setUser: () => {},
};

export const UserContext = createContext<UserContextType>(initialValue);

export const UserContextProvider = ({ children }: ContextProps) => {
  const [user, setUser] = useState<UserType | undefined>(undefined);

  useEffect(() => {
    const UserJSON = localStorage.getItem("medium-api:user");
    if (UserJSON) {
      setUser(JSON.parse(UserJSON));
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
