import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { token, user } = useAuth();

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  if (user?.role === "admin") {
    return children;
  }

  if (user?.role === "student") {
    return children;
  }

  return <Navigate to="/auth/login" replace />;
};

export default PrivateRoute;
