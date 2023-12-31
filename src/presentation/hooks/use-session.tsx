import React from "react";
import { useStorageState } from "./use-storage";
import { IUser } from "@/domain/models";

const AuthContext = React.createContext<{
  setCurrentAccount: (account) => void;
  session?: IUser | null;
  isLoading: boolean;
} | null>(null);

// This hook can be used to access the user info.
export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider(props) {
  const [[isLoading, session], setSession] = useStorageState<IUser>("session");
  return (
    <AuthContext.Provider
      value={{
        setCurrentAccount: (account) => {
          setSession(account);
        },
        session,
        isLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
