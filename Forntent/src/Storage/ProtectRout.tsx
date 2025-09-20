import { Navigate } from "react-router";


export default function ProtectRout({children}:any) {
  const access = localStorage.getItem("access");
  const refresh = localStorage.getItem("refresh");
  const isLoggedIn = !!access;

  return isLoggedIn ? children : <Navigate to="/login" />;
}

