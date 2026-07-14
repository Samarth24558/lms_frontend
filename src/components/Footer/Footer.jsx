import "./Footer.css";
import {
FaFacebook,
FaInstagram,
FaLinkedin,
FaGithub
} from "react-icons/fa";

export default function Footer(){

return(

<footer className="footer">

<div className="footer-grid">

<div>

<h2>LMS Pro</h2>

<p>

Learn modern technologies through high-quality courses.

</p>

</div>

<div>

<h3>Quick Links</h3>

<a href="/">Home</a>

<a href="/courses">Courses</a>

<a href="/login">Login</a>

<a href="/register">Register</a>

</div>

<div>

<h3>Categories</h3>

<p>Web Development</p>

<p>Artificial Intelligence</p>

<p>Cloud Computing</p>

<p>Cyber Security</p>

</div>

<div>

<h3>Follow Us</h3>

<div className="social">

<FaFacebook/>

<FaInstagram/>

<FaLinkedin/>

<FaGithub/>

</div>

</div>

</div>

<hr/>

<p className="copyright">

© 2026 LMS Pro. All Rights Reserved.

</p>

</footer>

);

}