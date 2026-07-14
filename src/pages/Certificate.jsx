import { useEffect, useState } from "react";
import API from "../services/axios";
import "./Certificate.css";

export default function Certificate() {
  const [certificates, setCertificates] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(null);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [certRes, enrollRes] = await Promise.all([
          API.get("/certificates/my"),
          API.get("/enrollments/my-courses"),
        ]);
        setCertificates(certRes.data.certificates || []);
        setCourses(enrollRes.data.courses || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load certificates.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleGenerate = async (courseId) => {
    setMessage("");
    setError("");
    setGenerating(courseId);

    try {
      const { data } = await API.post("/certificates/generate", { courseId });
      setCertificates((prev) => [...prev, data.certificate]);
      setMessage(data.message || "Certificate generated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate certificate.");
    } finally {
      setGenerating(null);
    }
  };

  const handleDownload = async (certificateId) => {
    setError("");
    setMessage("");
    setDownloading(certificateId);

    try {
      const response = await API.get(`/certificates/${certificateId}/download`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `certificate-${certificateId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to download certificate.");
    } finally {
      setDownloading(null);
    }
  };

  const hasCertificate = (courseId) =>
    certificates.some((cert) => cert.course?._id === courseId);

  if (loading) {
    return <div className="certificate-page">Loading certificates...</div>;
  }

  return (
    <div className="certificate-page">
      <div className="certificate-header">
        <h1>Certificates</h1>
        <p>Generate your certificate after completing lessons and passing all quizzes.</p>
      </div>

      {message && <div className="certificate-success">{message}</div>}
      {error && <div className="certificate-error">{error}</div>}

      <section className="certificate-section">
        <h2>My Certificates</h2>
        {certificates.length === 0 ? (
          <div className="certificate-empty">No certificates earned yet.</div>
        ) : (
          <div className="certificate-list">
            {certificates.map((certificate) => (
              <div key={certificate._id} className="certificate-card">
                <div>
                  <h3>LMS Pro - {certificate.course?.title || "Course"}</h3>
                  <p>Certificate number: {certificate.certificateNumber}</p>
                  <p>Issued: {new Date(certificate.createdAt).toLocaleDateString()}</p>
                </div>
                <button
                  className="certificate-button"
                  onClick={() => handleDownload(certificate._id)}
                  disabled={downloading === certificate._id}
                >
                  {downloading === certificate._id ? "Downloading..." : "Download PDF"}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="certificate-section">
        <h2>Eligible Courses</h2>
        {courses.length === 0 ? (
          <div className="certificate-empty">Enroll in a course to unlock certificates.</div>
        ) : (
          <div className="course-list">
            {courses.map((course) => (
              <div key={course._id} className="course-card">
                <div>
                  <h3>{course.title}</h3>
                  <p>Progress: {course.progress ?? 0}%</p>
                </div>
                <button
                  className="certificate-button"
                  onClick={() => handleGenerate(course._id)}
                  disabled={generating === course._id || hasCertificate(course._id)}
                >
                  {hasCertificate(course._id) ? "Certificate Generated" : generating === course._id ? "Generating..." : "Get Certificate"}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
