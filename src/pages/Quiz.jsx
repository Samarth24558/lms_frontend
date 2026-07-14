import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/axios";
import "./Quiz.css";

export default function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");   
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [eligible, setEligible] = useState(false);
  const [completionInfo, setCompletionInfo] = useState({ completedLessons: 0, totalLessons: 0, percent: 0 });

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/quizzes/${id}`);
        setQuiz(data.quiz);
        setEligible(Boolean(data.eligible));
        setCompletionInfo({
          completedLessons: Number(data.completedLessons) || 0,
          totalLessons: Number(data.totalLessons) || 0,
          percent: Number(data.percent) || 0,
        });
        setAnswers(Array(data.quiz.questions.length).fill(null));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load quiz.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleAnswer = (index, value) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = Number(value);
      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setResult(null);

    try {
      setSubmitting(true);
      const { data } = await API.post(`/quizzes/${id}/submit`, { answers });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="quiz-page">Loading quiz...</div>;
  }

  if (error) {
    return <div className="quiz-page quiz-error">{error}</div>;
  }

  if (!quiz) {
    return <div className="quiz-page">Quiz not found.</div>;
  }

  return (
    <div className="quiz-page">
      <div className="quiz-header">
        <div>
          <h1>{quiz.title}</h1>
          <p>{quiz.description}</p>
          <p className="quiz-meta">
            Lesson: {quiz.lessonId?.title || "Unknown"} • Passing: {quiz.passingMarks}%
          </p>
          <p className="quiz-eligibility">
            Course completion: {completionInfo.completedLessons}/{completionInfo.totalLessons} lessons completed ({completionInfo.percent}%)
          </p>
        </div>
        <button className="quiz-back" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>

      {result ? (
        <div className={`quiz-result ${result.passed ? "passed" : "failed"}`}>
          <h2>{result.passed ? "Quiz completed" : "Quiz failed"}</h2>
          <p>
            Score: {result.score} / {result.totalMarks} ({result.percentage.toFixed(1)}%)
          </p>
          <p>{result.passed ? "Congratulations!" : "Review the answers and try again."}</p>
        </div>
      ) : !eligible ? (
        <div className="quiz-locked">
          <h2>Quiz locked</h2>
          <p>You must complete the full course before attempting this quiz.</p>
          <p>
            Completed {completionInfo.completedLessons} out of {completionInfo.totalLessons} lessons.
          </p>
          <button className="quiz-back" onClick={() => navigate(`/course/${quiz.lessonId?.courseId}/watch`)}>
            Continue Course
          </button>
        </div>
      ) : (
        <form className="quiz-form" onSubmit={handleSubmit}>
          {quiz.questions.map((question, qIndex) => (
            <div key={qIndex} className="quiz-question-card">
              <h3>
                {qIndex + 1}. {question.question}
              </h3>
              <div className="quiz-options">
                {question.options.map((option, optionIndex) => (
                  <label key={optionIndex} className="quiz-option">
                    <input
                      type="radio"
                      name={`question-${qIndex}`}
                      value={optionIndex}
                      checked={answers[qIndex] === optionIndex}
                      onChange={(e) => handleAnswer(qIndex, e.target.value)}
                      required
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          {error && <div className="quiz-error-message">{error}</div>}

          <button className="quiz-submit-btn" type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Quiz"}
          </button>
        </form>
      )}
    </div>
  );
}
