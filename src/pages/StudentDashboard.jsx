import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

import API from "../services/axios";
import StudentCourseCard from "../components/StudentCourseCard/StudentCourseCard";
import "./StudentDashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

export default function StudentDashboard() {

  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [studentQuizzes, setStudentQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  

  const fetchCourses = async () => {
    try {
      const [enrolledRes, allRes, quizzesRes] = await Promise.all([
        API.get("/enrollments/my-courses"),
        API.get("/courses"),
        API.get("/quizzes/student"),
      ]);

      setEnrolledCourses(enrolledRes.data.courses || []);
      setAllCourses(allRes.data.courses || []);
      setStudentQuizzes(quizzesRes.data.quizzes || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredCourses = useMemo(
    () =>
      enrolledCourses.filter((course) =>
        course.title.toLowerCase().includes(search.toLowerCase())
      ),
    [enrolledCourses, search]
  );

  const enrolledIds = useMemo(
    () => new Set(enrolledCourses.map((course) => course._id)),
    [enrolledCourses]
  );

  const notEnrolledCourses = useMemo(
    () => allCourses.filter((course) => !enrolledIds.has(course._id)),
    [allCourses, enrolledIds]
  );

  const completedCoursesCount = useMemo(
    () => enrolledCourses.filter((course) => course.progress >= 100).length,
    [enrolledCourses]
  );

  const inProgressCount = useMemo(
    () =>
      enrolledCourses.filter(
        (course) => course.progress > 0 && course.progress < 100
      ).length,
    [enrolledCourses]
  );

  const notStartedCount = useMemo(
    () => allCourses.length - completedCoursesCount - inProgressCount,
    [allCourses.length, completedCoursesCount, inProgressCount]
  );

  const enrollmentOverviewData = {
    labels: ["Enrolled", "Not Enrolled"],
    datasets: [
      {
        data: [enrolledCourses.length, notEnrolledCourses.length],
        backgroundColor: ["#6366f1", "#f97316"],
      },
    ],
  };

  const progressData = {
    labels: ["Completed", "In Progress", "Not Started"],
    datasets: [
      {
        label: "Course Progress",
        data: [completedCoursesCount, inProgressCount, notStartedCount],
        backgroundColor: ["#22c55e", "#38bdf8", "#f59e0b"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.4,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: false,
      },
    },
  };

  if (loading) {
    return <h2 className="loading">Loading...</h2>;
  }

  return (
    <div className="student-dashboard">

      <div className="dashboard-header">

        <div>
          <h1>My Learning</h1>
          <p className="dashboard-subtitle">
            Progress and completion statistics now account for all courses,
            not only enrolled ones.
          </p>
        </div>

        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      <div className="dashboard-metrics">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Courses</h3>
            <p>{allCourses.length}</p>
          </div>
          <div className="stat-card">
            <h3>Enrolled Courses</h3>
            <p>{enrolledCourses.length}</p>
          </div>
          <div className="stat-card">
            <h3>Completed Courses</h3>
            <p>{completedCoursesCount}</p>
          </div>
          <div className="stat-card">
            <h3>Not Enrolled</h3>
            <p>{notEnrolledCourses.length}</p>
          </div>
        </div>

        <div className="dashboard-charts">
          <div className="chart-card">
            <h3>Enrollment Overview</h3>
            <Doughnut data={enrollmentOverviewData} options={chartOptions} />
          </div>
          <div className="chart-card">
            <h3>Progress Distribution</h3>
            <Bar data={progressData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>My Quizzes</h2>

        {studentQuizzes.length === 0 ? (
          <div className="empty-dashboard">
            <h2>No quizzes available</h2>
            <p>Complete courses to unlock quizzes assigned by your instructors.</p>
          </div>
        ) : (
          <div className="quiz-grid">
            {studentQuizzes.map((quiz) => (
              <div key={quiz._id} className="quiz-card">
                <h3>{quiz.title}</h3>
                <p>{quiz.description || "No description provided."}</p>
                <p className="quiz-course">
                  Course: {quiz.lessonId?.courseId?.title || "Unknown"}
                </p>
                <p className="quiz-lesson">
                  Lesson: {quiz.lessonId?.title || "Unknown"}
                </p>
                <p className="quiz-passing">Passing Score: {quiz.passingMarks}%</p>
                <button
                  className="quiz-start-button"
                  onClick={() => navigate(`/quiz/${quiz._id}`)}
                >
                  Take Quiz
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="dashboard-section">
        <h2>My Courses</h2>

        {filteredCourses.length === 0 ? (

          <div className="empty-dashboard">

            <h2>No enrolled courses</h2>

            <p>Enroll in a course to start learning.</p>

          </div>

        ) : (

          <div className="dashboard-grid">

            {filteredCourses.map((course) => (

              <StudentCourseCard
                key={course._id}
                course={course}
              />

            ))}

          </div>

        )}

      </div>

    </div>
  );
}
