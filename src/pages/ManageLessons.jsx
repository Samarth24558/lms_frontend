import { useEffect, useState } from "react";
import API from "../services/axios";
import "./AdminPages.css";

export default function ManageLessons() {
  const [courseId, setCourseId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [order, setOrder] = useState(1);
  const [isPreview, setIsPreview] = useState(false);
  const [video, setVideo] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [deletingIds, setDeletingIds] = useState([]);
  const [currentSection, setCurrentSection] = useState(null);

  const fetchCourses = async () => {
    try {
      const { data } = await API.get("/courses");
      const list = data.courses || [];
      setCourses(list);
      if (!courseId && list.length > 0) setCourseId(list[0]._id);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  };

  const fetchSectionsForCourse = async (cId) => {
    if (!cId) return;
    try {
      const { data } = await API.get(`/sections/${cId}`);
      const list = data.sections || [];
      setSections(list);
      // If the currently selected section doesn't belong to the newly
      // loaded sections, pick the first section from this course so
      // lessons refresh correctly when switching courses.
      if (list.length > 0 && !list.some((s) => s._id === sectionId)) {
        setSectionId(list[0]._id);
      }
    } catch (err) {
      console.error("Failed to fetch sections:", err);
      setSections([]);
    }
  };

  const fetchSections = async () => {
    try {
      const { data } = await API.get("/sections");
      const sectionList = data.sections || [];
      setSections(sectionList);
      if (!sectionId && sectionList.length > 0) {
        setSectionId(sectionList[0]._id);
      }
    } catch (err) {
      console.error("Failed to fetch sections:", err);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchLessons = async () => {
    if (!sectionId) return;

    try {
      const { data } = await API.get(`/lessons/${sectionId}`);
      setLessons(data.lessons || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lesson and its media? This cannot be undone.")) return;
    if (uploading) return;

    try {
      setDeletingIds((s) => [...s, id]);
      await API.delete(`/lessons/${id}`);
      setLessons((prev) => prev.filter((l) => l._id !== id));
      setMessage("Lesson deleted successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete lesson.");
    } finally {
      setDeletingIds((s) => s.filter((x) => x !== id));
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (courseId) {
      fetchSectionsForCourse(courseId);
    } else {
      setSections([]);
      setSectionId("");
    }
  }, [courseId]);

  useEffect(() => {
    if (sectionId) {
      fetchLessons();
      const found = sections.find((s) => s._id === sectionId);
      setCurrentSection(found || null);
    } else {
      setLessons([]);
      setCurrentSection(null);
    }
  }, [sectionId, sections]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (uploading) {
      setError("Upload in progress. Please wait until it finishes.");
      return;
    }

    setError("");
    setMessage("");
    setUploadProgress(0);
    setUploading(true);

    const formData = new FormData();
    formData.append("courseId", courseId);
    formData.append("sectionId", sectionId);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("duration", duration);
    formData.append("order", order);
    formData.append("isPreview", isPreview);

    if (video) {
      formData.append("video", video);
    }

    if (pdf) {
      formData.append("pdf", pdf);
    }

    try {
      const { data } = await API.post("/lessons", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) return;
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });

      setMessage(data.message || "Lesson created successfully.");
      setTitle("");
      setDescription("");
      setDuration("");
      setOrder(1);
      setIsPreview(false);
      setVideo(null);
      setPdf(null);
      fetchLessons();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create lesson.");
    } finally {
      setUploading(false);
      // keep progress at 100 briefly then reset
      setTimeout(() => setUploadProgress(0), 800);
    }
  };

  return (
    <div className="admin-page">
      <h1>Manage Lessons</h1>

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
            <label htmlFor="sectionId">Section</label>
            <select
              id="sectionId"
              value={sectionId}
              onChange={(e) => setSectionId(e.target.value)}
              required
            >
              {sections.map((sec) => (
                <option key={sec._id} value={sec._id}>
                  {sec.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="title">Lesson Title</label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="duration">Duration</label>
            <input
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
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

          <div className="form-group">
            <label htmlFor="video">Video File</label>
            <input
              id="video"
              type="file"
              accept="video/*"
              onChange={(e) => setVideo(e.target.files[0])}
              disabled={uploading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="pdf">PDF File</label>
            <input
              id="pdf"
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdf(e.target.files[0])}
              disabled={uploading}
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

        <div className="checkbox-row">
          <input
            id="isPreview"
            type="checkbox"
            checked={isPreview}
            onChange={(e) => setIsPreview(e.target.checked)}
          />
          <label htmlFor="isPreview">Make this lesson previewable</label>
        </div>

        <div className="button-row">
          <button type="submit" className="button-primary" disabled={uploading}>
            {uploading ? `Uploading... ${uploadProgress}%` : "Create Lesson"}
          </button>
        </div>

        {uploading && (
          <div style={{ marginTop: 12 }}>
            <div style={{ height: 8, background: "#e5e7eb", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: `${uploadProgress}%`, height: "100%", background: "#3b82f6", transition: "width 200ms" }} />
            </div>
            <div style={{ fontSize: 12, color: "#374151", marginTop: 6 }}>{uploadProgress}%</div>
          </div>
        )}

        {message && <div className="admin-alert">{message}</div>}
        {error && <div className="admin-alert" style={{ background: "#fee2e2", color: "#991b1b" }}>{error}</div>}
      </form>

      {lessons.length > 0 && (
        <div className="admin-card">
          {currentSection && <h2>Lessons in section {currentSection.title}</h2>}
          <ul>
            {lessons.map((lesson) => (
              <li key={lesson._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <strong>{lesson.title}</strong>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>Duration: {lesson.duration}</div>
                </div>
                <div>
                  <button
                    className="button-danger"
                    onClick={() => handleDelete(lesson._id)}
                    disabled={uploading || deletingIds.includes(lesson._id)}
                  >
                    {deletingIds.includes(lesson._id) ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
