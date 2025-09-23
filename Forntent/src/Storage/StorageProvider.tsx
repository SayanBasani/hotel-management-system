import { createContext, useContext, useState } from "react";

export const AllStorage = createContext<any>(null);

export function StorageProvider({ children }: { children: React.ReactNode }) {
  const [Dark, setDark] = useState(() => {
    // console.log(document.documentElement.classList.contains("dark"));
    return document.documentElement.classList.contains("dark");
  });

  const getStorage = () => {
    const storageData = localStorage.getItem("appStorage");
    return storageData ? JSON.parse(storageData) : {};
  };

  const setStorage = (data: any) => {
    localStorage.setItem("appStorage", JSON.stringify(data));
  };

  const [error, setError] = useState<string | null>(null);
  const [permissionList, setPermissionList] = useState<string[]>([]);
  const [users, setUsers] = useState<any>([]);
  return (
    <AllStorage.Provider
      value={{
        getStorage,
        setStorage,
        Dark,
        setDark,
        error,
        setError,
        permissionList,
        setPermissionList,
        users,
        setUsers,
      }}>
      {children}
    </AllStorage.Provider>
  );
}

export function useStorage() {
  const context = useContext(AllStorage);
  return context;
}
