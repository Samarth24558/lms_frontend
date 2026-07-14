import "./StudentCourseCard.css";
import { Link } from "react-router-dom";
import {
  FaPlayCircle,
  FaClock,
  FaCheckCircle
} from "react-icons/fa";

export default function StudentCourseCard({ course = {} }) {

  if (!course || !course._id) {
    return null;
  }

  const progress = course.progress || 0;

  return (
    <div className="student-course-card">

      <div className="course-image">

        <img
          src={course.thumbnail}
          alt={course.title}
        />

      </div>

      <div className="course-content">

        <h2>{course.title}</h2>

        <p className="instructor">
          By {course.instructor?.name || "Instructor"}
        </p>

        <div className="course-meta">

          <span>
            <FaClock />
            {course.duration || "0 Hours"}
          </span>

          <span>
            <FaCheckCircle />
            {progress}% Completed
          </span>

        </div>

        <div className="progress-container">

          <div
            className="progress-bar"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

        <Link
          className="continue-btn"
          to={`/course/${course._id}/watch`}
        >
          <FaPlayCircle />

          Continue Learning

        </Link>

      </div>

    </div>
  );
}