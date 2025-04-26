import { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
  const [authuser, setAuthUser] = useState(() => {
    return localStorage.getItem("token") || Cookies.get("jwt") || null;
  });
  return (
    <AuthContext.Provider value={[authuser, setAuthUser]}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
