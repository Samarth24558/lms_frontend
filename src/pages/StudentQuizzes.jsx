import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/axios";
import "./StudentQuizzes.css";

export default function StudentQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const { data } = await API.get("/quizzes/student");
        setQuizzes(data.quizzes || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load quizzes.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) {
    return <div className="student-quizzes-page">Loading quizzes...</div>;
  }

  if (error) {
    return <div className="student-quizzes-page student-quizzes-error">{error}</div>;
  }

  return (
    <div className="student-quizzes-page">
      <div className="student-quizzes-header">
        <div>
          <h1>Quizzes</h1>
          <p>Attempt quizzes for the courses you are enrolled in.</p>
        </div>
      </div>

      {quizzes.length === 0 ? (
        <div className="student-quizzes-empty">
          <h2>No quizzes available</h2>
          <p>Enroll in a course to see assigned quizzes.</p>
        </div>
      ) : (
        <div className="student-quizzes-grid">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="student-quiz-card">
              <div className="student-quiz-card-top">
                <div>
                  <h2>{quiz.title}</h2>
                  <p>{quiz.description || "No description provided."}</p>
                </div>
              </div>
              <div className="student-quiz-card-meta">
                <span>Course: {quiz.lessonId?.courseId?.title || "Unknown"}</span>
                <span>Lesson: {quiz.lessonId?.title || "Unknown"}</span>
                <span>Passing: {quiz.passingMarks}%</span>
              </div>
              <button
                className="student-quiz-button"
                onClick={() => navigate(`/quiz/${quiz._id}`)}
              >
                Take Quiz
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
