import { NavLink } from "react-router-dom";
import {
FaHome,
FaBook,
FaUsers,
FaChartBar,
FaPlus,
FaLayerGroup,
FaVideo,
FaCertificate
} from "react-icons/fa";

import "./Sidebar.css";

export default function Sidebar(){

return(

<div className="sidebar">

<h2>Admin Controls</h2>

<NavLink to="/">

<FaHome/>

Home

</NavLink>

<NavLink to="/admin/courses/new">

<FaPlus/>

Create Course

</NavLink>

<NavLink to="/admin/sections">

<FaLayerGroup/>

Sections

</NavLink>

<NavLink to="/admin/lessons">

<FaVideo/>

Lessons

</NavLink>

<NavLink to="/admin/quizzes">

<FaBook/>

Quizzes

</NavLink>

<NavLink to="/admin/certificates">

<FaCertificate/>

Certificates

</NavLink>

<NavLink to="/admin/users">

<FaUsers/>

Users

</NavLink>

<NavLink to="/admin/courses/progress">

<FaChartBar/>

Course Progress

</NavLink>

<NavLink to="/admin/analytics">

<FaChartBar/>

Analytics

</NavLink>

</div>

);

}