import "./FeaturedCourses.css";
import { useEffect,useState } from "react";
import API from "../../services/axios";
import CourseCard from "../CourseCard/CourseCard";

export default function FeaturedCourses(){

const[courses,setCourses]=useState([]);

const[loading,setLoading]=useState(true);

useEffect(()=>{

loadCourses();

},[]);

const loadCourses=async()=>{

try{

const res=await API.get("/courses");

setCourses(res.data.courses.slice(0,6));

}

catch(err){

console.log(err);

}

finally{

setLoading(false);

}

};

return(

<section className="featured">

<h2>

Featured Courses

</h2>

<p>

Explore our most popular free courses.

</p>

<div className="course-grid">

{

loading?

<h3>Loading...</h3>

:

courses.map(course=>(

<CourseCard

key={course._id}

course={course}

/>

))

}

</div>

</section>

);

}