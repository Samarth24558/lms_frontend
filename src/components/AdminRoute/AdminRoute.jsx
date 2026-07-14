import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute() {

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
        return <Navigate to="/login" />;
    }

    return role === "admin"
        ? <Outlet />
        : <Navigate to="/" />;
}