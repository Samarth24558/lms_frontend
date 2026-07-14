import "./CTA.css";
import { Link } from "react-router-dom";

export default function CTA(){

return(

<section className="cta">

<h2>

Ready to Start Your Learning Journey?

</h2>

<p>

Join thousands of students learning with LMS Pro.

</p>

<Link
to="/courses"
className="cta-btn"
>

Explore Courses

</Link>

</section>

);

}