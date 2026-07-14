import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/axios";
import "./AdminPages.css";

export default function AdminCourseProgress() {
  const { courseId } = useParams();
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [coursesError, setCoursesError] = useState("");
  const [progressError, setProgressError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoadingCourses(true);
        setCoursesError("");
        const courseRes = await API.get("/courses");
        setCourses(courseRes.data.courses || []);
      } catch (err) {
        setCoursesError(err.response?.data?.message || "Failed to load courses.");
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    if (!courseId) {
      setCourse(null);
      setProgress(null);
      setProgressError("");
      return;
    }

    const fetchProgress = async () => {
      try {
        setLoadingProgress(true);
        setProgressError("");

        const courseRes = await API.get(`/courses/${courseId}`);
        setCourse(courseRes.data.course);

        const progressRes = await API.get(`/admin/courses/${courseId}/progress`);
        setProgress(progressRes.data);
      } catch (err) {
        console.error("Admin course progress error:", err.response?.data || err.message || err);
        setProgress(null);
        setProgressError(
          err.response?.data?.message || err.message || "Failed to load course progress."
        );
      } finally {
        setLoadingProgress(false);
      }
    };

    fetchProgress();
  }, [courseId]);

  useEffect(() => {
    if (!courseId && !loadingCourses && courses.length > 0) {
      navigate(`/admin/courses/progress/${courses[0]._id}`);
    }
  }, [courseId, courses, loadingCourses, navigate]);

  const handleCourseSelect = (event) => {
    const selectedId = event.target.value;
    navigate(selectedId ? `/admin/courses/progress/${selectedId}` : "/admin/courses/progress");
  };

  if (loadingCourses) return <h2 className="loading">Loading courses...</h2>;

  return (
    <div className="admin-page">
      <h1>Course Progress</h1>

      <div className="admin-card">
        {coursesError ? (
          <p>{coursesError}</p>
        ) : (
          <>
            <label htmlFor="course-select">Select course</label>
            <select id="course-select" value={courseId || ""} onChange={handleCourseSelect}>
              <option value="">Choose a course</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title}
                </option>
              ))}
            </select>
          </>
        )}
      </div>

      {progressError && (
        <div className="admin-card">
          <p>{progressError}</p>
        </div>
      )}

      {loadingProgress && <h2 className="loading">Loading progress...</h2>}

      {course && progress && !progressError && (
        <>
          <div className="admin-card">
            <h2>{course.title}</h2>
            <p>{course.description}</p>
          </div>

          <div className="admin-card">
            <h3>Students Progress</h3>
            <p>Total lessons: {progress.totalLessons}</p>
            {progress.students.length === 0 ? (
              <p>No students enrolled in this course yet.</p>
            ) : (
              <ul>
                {progress.students.map((item) => (
                  <li key={item.student._id}>
                    <div>
                      <strong>{item.student.name}</strong>
                      <span>{item.student.email}</span>
                    </div>
                    <div>
                      <span>{item.completedLessons} lessons completed</span>
                      <strong>{item.percent}%</strong>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
