import { JSX, useEffect, useState } from "react";
import { Navigate } from "react-router";
import LogKed from "../helpers/LogKed";
import { LoadingScreen } from "../context/LoadingScreen";

const GuestOnly = ({ children }: { children: JSX.Element }) => {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      LogKed(token!).then((res) => setAuthorized(Boolean(res)));
    };
    checkToken();
  }, []);

  if (authorized === null) {
    return <LoadingScreen />;
  }

  if (authorized) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default GuestOnly;
