import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authSlice";
import { logoutUser } from "../../services/authService";
import {
FaGraduationCap,
FaBars,
FaTimes
} from "react-icons/fa";

import "./Navbar.css";

export default function Navbar(){

const [menu,setMenu]=useState(false);
const dispatch = useDispatch();
const navigate = useNavigate();
const authState = useSelector((state) => state.auth);
const token = authState.token || localStorage.getItem("token");
const role = (authState.role || localStorage.getItem("role") || "").toString().trim().toLowerCase();
const isAdmin = Boolean(token) && role === "admin";

const handleLogout = async () => {
  try {
    await logoutUser();
  } catch (error) {
    console.warn("Logout API failed", error);
  }

  dispatch(logout());
  navigate("/login");
};

return(

<nav className="navbar">

<div className="logo">

<FaGraduationCap/>

<span>LMS Pro</span>

</div>

<ul className={menu?"nav-links active":"nav-links"}>

<li>

<Link to="/">Home</Link>

</li>

<li>

<Link to="/courses">Courses</Link>

</li>

<li>

<Link to="/my-learning">My Learning</Link>

</li>

{
token?

<>

<li>

<Link to="/dashboard">

Dashboard

</Link>

</li>

{isAdmin && (
  <>
    <li>
      <Link to="/admin">Admin</Link>
    </li>
  </>
)}

<li>
  <Link to="/quizzes">Quizzes</Link>
</li>

<li>
  <Link to="/certificate">Certificate</Link>
</li>

<li>

<button className="logout-button" onClick={handleLogout}>

Logout

</button>

</li>

</>

:

<>

<li>

<Link to="/login">

Login

</Link>

</li>

<li>

<Link to="/register">

Register

</Link>

</li>

</>

}

</ul>

<div
className="mobile-menu"
onClick={()=>setMenu(!menu)}
>

{

menu?

<FaTimes/>

:

<FaBars/>

}

</div>

</nav>

);

}