import { useEffect, useState } from "react";
import API from "../services/axios";
import "./AdminPages.css";

export default function CreateCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [language, setLanguage] = useState("English");
  const [duration, setDuration] = useState("");
  const [isFree, setIsFree] = useState(true);
  const [thumbnail, setThumbnail] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const loadCourses = async () => {
    try {
      setLoadingCourses(true);
      const { data } = await API.get("/courses");
      setCourses(data.courses || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load courses.");
    } finally {
      setLoadingCourses(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("level", level);
    formData.append("language", language);
    formData.append("duration", duration);
    formData.append("isFree", isFree);

    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    try {
      setUploadProgress(1);

      const { data } = await API.post("/courses", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 1;
          setUploadProgress(Math.max(1, Math.min(100, percent)));
        },
      });

      setMessage(data.message || "Course created successfully.");
      setTitle("");
      setDescription("");
      setCategory("");
      setLevel("Beginner");
      setLanguage("English");
      setDuration("");
      setIsFree(true);
      setThumbnail(null);
      await loadCourses();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create course.");
    } finally {
      setUploadProgress(0);
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm("Delete this course and its thumbnail?")) {
      return;
    }

    try {
      setDeletingId(courseId);
      setError("");
      setMessage("");
      const { data } = await API.delete(`/courses/${courseId}`);
      setMessage(data.message || "Course deleted successfully.");
      await loadCourses();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete course.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="admin-page">
      <h1>Create Course</h1>

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="level">Level</label>
            <select
              id="level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="language">Language</label>
            <input
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="duration">Duration</label>
            <input
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="thumbnail">Course Thumbnail</label>
            <input
              id="thumbnail"
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files[0])}
            />
          </div>

          <div className="form-group">
            <label htmlFor="isFree">Free Course</label>
            <div className="checkbox-row">
              <input
                id="isFree"
                type="checkbox"
                checked={isFree}
                onChange={(e) => setIsFree(e.target.checked)}
              />
              <span>Allow free enrollment</span>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="button-row">
          <button type="submit" className="button-primary">
            Create Course
          </button>
        </div>

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="upload-progress">
            <div className="upload-progress__bar" style={{ width: `${uploadProgress}%` }} />
            <span>{uploadProgress}%</span>
          </div>
        )}

        {message && <div className="admin-alert">{message}</div>}
        {error && <div className="admin-alert" style={{ background: "#fee2e2", color: "#991b1b" }}>{error}</div>}
      </form>

      <section className="admin-card">
        <h2>Existing Courses</h2>

        {loadingCourses ? (
          <p>Loading courses...</p>
        ) : courses.length === 0 ? (
          <p>No courses created yet.</p>
        ) : (
          <ul>
            {courses.map((course) => (
              <li key={course._id}>
                <div>
                  <strong>{course.title}</strong>
                  <div>
                    <span>{course.category}</span> • <span>{course.level}</span>
                  </div>
                </div>
                <button
                  className="button-danger"
                  onClick={() => handleDelete(course._id)}
                  disabled={deletingId === course._id}
                >
                  {deletingId === course._id ? "Deleting..." : "Delete"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
