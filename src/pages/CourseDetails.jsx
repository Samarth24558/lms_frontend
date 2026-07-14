import "./CourseDetails.css";

import { Link, useParams } from "react-router-dom";

import { useEffect, useState } from "react";
import CourseBanner from "../components/CourseBanner/CourseBanner";
import EnrollmentCard from "../components/EnrollmentCard/EnrollmentCard";

import API from "../services/axios";

export default function CourseDetails(){

    const { id } = useParams();

    const [course,setCourse] = useState(null);

    const [loading,setLoading] = useState(true);

    const [error,setError] = useState("");
    
    const [enrolled, setEnrolled] = useState(false);


    const fetchCourse = async()=>{

        try{

            setLoading(true);

            const res = await API.get(`/courses/${id}`);

            setCourse(res.data.course);

        }

        catch(err){

            setError(
                err.response?.data?.message ||
                "Failed to load course."
            );

        }

        finally{

            setLoading(false);

        }

    };

const checkEnrollment = async () => {
    try {
        const res = await API.get(`/enrollments/check/${id}`);
        setEnrolled(res.data.enrolled);
    } catch (error) {
        console.error("Error checking enrollment:", error);
        setEnrolled(false);
    }
};

const handleEnroll = async () => {
    try {

        const res = await API.post("/enrollments", {
            courseId: id,
        });

        console.log(res.data);

        setEnrolled(true);

    } catch (error) {

         if (error.response) {
      alert(error.response.data.message);
    } else {
      alert("Something went wrong.");
    }

    }
};

useEffect(() => {
    fetchCourse();
    checkEnrollment();
}, [id]);

    if(loading){

        return(

            <div className="course-loading">

                Loading Course...

            </div>

        );

    }

    if(error){

        return(

            <div className="course-error">

                {error}

            </div>

        );

    }

    return(
      <>
        <div className="course-page">

    <CourseBanner
        course={course}
    />

    <div className="course-layout">

        <div className="course-main">

            <section className="course-description">

                <h2>About this Course</h2>

                <p>{course.description}</p>

                {enrolled ? (
                    <Link to={`/course/${id}/watch`} className="watch-course-btn">
                        Watch Course
                    </Link>
                ) : (
                    <div className="course-locked-message">
                        <p>Enroll in this course to start watching.</p>
                    </div>
                )}

            </section>

        </div>

        <EnrollmentCard
            course={course}
            onEnroll={handleEnroll}
        />

    </div>

</div>

        </>

    );

}