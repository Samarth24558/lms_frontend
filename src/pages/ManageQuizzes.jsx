import { useEffect, useState } from "react";
import API from "../services/axios";
import "./AdminPages.css";

export default function ManageQuizzes() {
  const [lessons, setLessons] = useState([]);
  const [lessonId, setLessonId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [passingMarks, setPassingMarks] = useState(60);
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctAnswer: 0, marks: 1 },
  ]);
  const [quizzes, setQuizzes] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const fetchLessons = async () => {
    try {
      const { data } = await API.get("/lessons");
      setLessons(data.lessons || []);
      if (!lessonId && data.lessons?.length > 0) {
        setLessonId(data.lessons[0]._id);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load lessons.");
    }
  };

  const fetchQuizzes = async () => {
    try {
      const { data } = await API.get("/quizzes");
      setQuizzes(data.quizzes || []);
      console.log("Fetched quizzes:", data.quizzes);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load quizzes.");
    }
  };

  useEffect(() => {
    fetchLessons();
    fetchQuizzes();
  }, []);


  const handleQuestionChange = (index, field, value) => {
    setQuestions((prev) =>
      prev.map((question, qIndex) =>
        qIndex === index
          ? { ...question, [field]: value }
          : question
      )
    );
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    setQuestions((prev) =>
      prev.map((question, qIndex) => {
        if (qIndex !== questionIndex) return question;
        const options = [...question.options];
        options[optionIndex] = value;
        return { ...question, options };
      })
    );
  };

  const addQuestion = () => {
    setQuestions((prev) => [...prev, { question: "", options: ["", "", "", ""], correctAnswer: 0, marks: 1 }]);
  };

  const removeQuestion = (index) => {
    setQuestions((prev) => prev.filter((_, qIndex) => qIndex !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const quizPayload = {
      lessonId,
      title,
      description,
      passingMarks,
      questions,
    };

    try {
      const { data } = await API.post("/quizzes", quizPayload);
      setMessage(data.message || "Quiz created successfully.");
      setTitle("");
      setDescription("");
      setPassingMarks(60);
      setQuestions([{ question: "", options: ["", "", "", ""], correctAnswer: 0, marks: 1 }]);
      fetchQuizzes();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create quiz.");
    }
  };

  const handleDelete = async (quizId) => {
    if (!window.confirm("Delete this quiz?")) return;
    try {
      setDeletingId(quizId);
      setError("");
      setMessage("");
      const { data } = await API.delete(`/quizzes/${quizId}`);
      setMessage(data.message || "Quiz deleted successfully.");
      setQuizzes((prev) => prev.filter((quiz) => quiz._id !== quizId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete quiz.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="admin-page">
      <h1>Manage Quizzes</h1>

   

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="lessonId">Lesson</label>
            <select
              id="lessonId"
              value={lessonId}
              onChange={(e) => setLessonId(e.target.value)}
              required
            >
              {lessons.map((lesson) => (
                <option key={lesson._id} value={lesson._id}>
                  {lesson.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="title">Quiz Title</label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="passingMarks">Passing Marks</label>
            <input
              id="passingMarks"
              type="number"
              value={passingMarks}
              onChange={(e) => setPassingMarks(Number(e.target.value))}
              min="0"
              max="100"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="admin-card">
          <h2>Questions</h2>
          {questions.map((question, qIndex) => (
            <div key={qIndex} className="admin-card" style={{ marginBottom: 16 }}>
              <div className="form-group">
                <label>Question {qIndex + 1}</label>
                <input
                  value={question.question}
                  onChange={(e) => handleQuestionChange(qIndex, "question", e.target.value)}
                  required
                />
              </div>

              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="form-group">
                  <label>Option {optionIndex + 1}</label>
                  <input
                    value={option}
                    onChange={(e) => handleOptionChange(qIndex, optionIndex, e.target.value)}
                    required
                  />
                </div>
              ))}

              <div className="form-grid">
                <div className="form-group">
                  <label>Correct Answer</label>
                  <select
                    value={question.correctAnswer}
                    onChange={(e) => handleQuestionChange(qIndex, "correctAnswer", Number(e.target.value))}
                  >
                    {question.options.map((_, optionIndex) => (
                      <option key={optionIndex} value={optionIndex}>
                        Option {optionIndex + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Marks</label>
                  <input
                    type="number"
                    min="1"
                    value={question.marks}
                    onChange={(e) => handleQuestionChange(qIndex, "marks", Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              <button type="button" className="button-secondary" onClick={() => removeQuestion(qIndex)}>
                Remove Question
              </button>
            </div>
          ))}

          <button type="button" className="button-primary" onClick={addQuestion}>
            Add Question
          </button>
        </div>

        <div className="button-row">
          <button type="submit" className="button-primary">
            Create Quiz
          </button>
        </div>

        {message && <div className="admin-alert">{message}</div>}
        {error && <div className="admin-alert" style={{ background: "#fee2e2", color: "#991b1b" }}>{error}</div>}
      </form>

      <section className="admin-card">
        <h2>Existing Quizzes</h2>
        {quizzes.length === 0 ? (
          <p>No quizzes created yet.</p>
        ) : (
          <ul>
            {quizzes.map((quiz) => (
              <li key={quiz._id}>
                <div>
                  <strong>{quiz.title}</strong>
                  <div>
                    <span>{quiz.lessonId?.title || "No lesson"}</span> • <span>{quiz.questions.length} questions</span>
                  </div>
                </div>
                <button
                  className="button-danger"
                  onClick={() => handleDelete(quiz._id)}
                  disabled={deletingId === quiz._id}
                >
                  {deletingId === quiz._id ? "Deleting..." : "Delete"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
