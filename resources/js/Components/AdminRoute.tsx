import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface AdminRouteProps {
  children: ReactNode;
}

// ReactNode est le type standard d’un enfant (children) en React.
const AdminRoute = ({ children } : AdminRouteProps) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!user.roles?.includes("admin")) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};
export default AdminRoute;
