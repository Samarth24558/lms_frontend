import { useEffect, useState } from "react";
import API from "../services/axios";
import "./AdminPages.css";

export default function ManageSections() {
  const [courseId, setCourseId] = useState("");
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState(1);
  const [sections, setSections] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchCourses = async () => {
    try {
      const { data } = await API.get("/courses");
      const courseList = data.courses || [];
      setCourses(courseList);
      if (!courseId && courseList.length > 0) {
        setCourseId(courseList[0]._id);
      }
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  };

  const fetchSections = async () => {
    if (!courseId) return;

    try {
      const { data } = await API.get(`/sections/${courseId}`);
      setSections(data.sections || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (courseId) {
      fetchSections();
    } else {
      setSections([]);
    }
  }, [courseId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      const { data } = await API.post("/sections", {
        courseId,
        title,
        description,
        order,
      });

      setMessage(data.message || "Section created successfully.");
      setTitle("");
      setDescription("");
      setOrder(1);
      fetchSections();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create section.");
    }
  };

  return (
    <div className="admin-page">
      <h1>Manage Sections</h1>

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="courseId">Course</label>
            <select
              id="courseId"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              required
            >
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="title">Section Title</label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="order">Order</label>
            <input
              id="order"
              type="number"
              min="1"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
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

        <div className="button-row">
          <button type="submit" className="button-primary">
            Create Section
          </button>
        </div>

        {message && <div className="admin-alert">{message}</div>}
        {error && <div className="admin-alert" style={{ background: "#fee2e2", color: "#991b1b" }}>{error}</div>}
      </form>

      {sections.length > 0 && (
        <div className="admin-card">
            {courses.map((course) => (
              course._id === courseId && (
                <h2>Sections for {course.title} Course</h2>
              )
            ))}
          <ul>
            {sections.map((section) => (
              <li key={section._id}>
                <strong>{section.title}</strong>
                <span>Order: {section.order}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
