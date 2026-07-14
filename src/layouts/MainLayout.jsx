import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

function MainLayout() {
    const location = useLocation();
    const hideNavbar = ["/login", "/register","/Register","/Login"].includes(location.pathname);

    return (
        <>
            {!hideNavbar && <Navbar />}

            <main className="container">
                <Outlet />
            </main>

            <Footer />
        </>
    );
}

export default MainLayout;