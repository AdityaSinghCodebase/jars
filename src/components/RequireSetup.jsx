import { Navigate, Outlet } from "react-router-dom";
import useAppData from "../hooks/useAppData";

function RequireSetup() {
  const { onboarded } = useAppData();

  if (!onboarded) return <Navigate to="/setup" replace />;

  return <Outlet />;
}

export default RequireSetup;
