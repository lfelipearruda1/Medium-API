"use client";

import { createContext, useState, useEffect } from "react";

interface ContextProps {
  children: React.ReactNode;
}

interface UserState {
  id: number;
  email: string;
  username: string;
  userImg: string;
  bgImg: string;
}

interface UserContextType {
  user: UserState | undefined;
  setUser: (newState: UserState | undefined) => void;
}

const initialValue: UserContextType = {
  user: undefined,
  setUser: () => {},
};

export const UserContext = createContext<UserContextType>(initialValue);

export const UserContextProvider = ({ children }: ContextProps) => {
  const [user, setUser] = useState<UserState | undefined>(undefined);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userJSON = localStorage.getItem("medium-api:user");
      if (userJSON) {
        setUser(JSON.parse(userJSON));
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
