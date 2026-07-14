import "./CourseCard.css";
import { Link } from "react-router-dom";
import { FaClock, FaStar } from "react-icons/fa";

export default function CourseCard({course}){

return(

<div className="course-card">

<img
src={course.thumbnail}
alt={course.title}
/>

<div className="course-content">

<span className="category">

{course.category}

</span>

<h3>

{course.title}

</h3>



<Link
to={`/course/${course._id}`}
className="course-btn"
>

View Course

</Link>

</div>

</div>

);

}