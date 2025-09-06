import { useAuthStore } from "@/store/auth";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const { isLoggedIn } = useAuthStore();

  if (isLoggedIn) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
