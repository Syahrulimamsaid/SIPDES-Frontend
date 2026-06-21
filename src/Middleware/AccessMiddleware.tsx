import { ReactNode } from "react";
import { Navigate } from "react-router";

interface AccessMiddlewareProps {
  children: ReactNode;
  access: string;
}

export default function AccessMiddleware({ children, access }: AccessMiddlewareProps) {
  const role = localStorage.getItem("role");
  if (role?.toLowerCase() !== access.toLowerCase()) {
    const userRole = role?.toLowerCase();
    const to = userRole === "admin" ? "/admin" : userRole === "operator" ? "/operator" : "/";
    return <Navigate to={to} replace />;
  }

  return <>{children}</>;
}
