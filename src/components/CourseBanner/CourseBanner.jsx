import "./CourseBanner.css";

import {
FaStar,
FaUserGraduate,
FaClock,
FaGlobe,
FaCalendarAlt
} from "react-icons/fa";

export default function CourseBanner({ course }) {

return (

<section className="banner">

<div className="banner-overlay">

<div className="banner-left">

<div className="badges">

<span>{course.category}</span>

<span>{course.level}</span>

</div>

<h2>

{course.title}

</h2>

<p className="subtitle">

{course.subtitle || course.description}

</p>

<div className="banner-meta">

<div>

</div>

<div>

<FaUserGraduate />

<span>

{course.students}

Students

</span>

</div>

<div>

<FaClock />

<span>

{course.duration}

</span>

</div>

<div>

<FaGlobe />

<span>

{course.language}

</span>

</div>

<div>

<FaCalendarAlt />

<span>

Updated

{" "}

{new Date(course.updatedAt).toLocaleDateString()}

</span>

</div>

</div>

<div className="instructor">



<div>
    <p>

Instructor:  <strong>{course.instructor?.name}</strong>

</p>

</div>

</div>

</div>

<div className="banner-right">

<img

src={course.thumbnail}

alt={course.title}

/>

</div>

</div>

</section>

);

}