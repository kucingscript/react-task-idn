import { isTokenValid } from "@/lib/token";
import { useAuthStore } from "@/store/auth";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "sonner";

const ProtectedRoute = () => {
  const { token, user, logout } = useAuthStore();

  if (!isTokenValid(token)) {
    if (useAuthStore.getState().isLoggedIn) {
      toast.error("Sesi Anda telah berakhir, silakan login kembali.");
      logout();
    }

    return <Navigate to="/login" replace />;
  }

  const isAdmin = user?.level?.toLowerCase() === "admin";
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
