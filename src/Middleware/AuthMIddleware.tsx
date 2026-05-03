import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import LogKed from "../helpers/LogKed";
import { LoadingScreen } from "../context/LoadingScreen";

export default function AuthMiddleware() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      LogKed(token!).then((res) => setAuthorized(Boolean(res)));
    };

    checkToken();
  }, []);

  if (authorized === null) {
    return <LoadingScreen />
  }

  if (!authorized) {
    return <Navigate to="/auth/signin" replace />;
  }
  return <Outlet />;
}
