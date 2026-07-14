import { useEffect, useState } from "react";
import API from "../services/axios";
import "./AdminPages.css";

export default function AdminCertificates() {
  const [template, setTemplate] = useState(null);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [inputKey, setInputKey] = useState(Date.now());

  useEffect(() => {
    const loadTemplate = async () => {
      try {
        const { data } = await API.get("/certificate-templates/active");
        setTemplate(data.template);
      } catch (err) {
        setTemplate(null);
      }
    };

    loadTemplate();
  }, []);

  const handleUpload = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!file) {
      setError("Please select a blank certificate image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("template", file);

    try {
      setUploading(true);
      const { data } = await API.post("/certificate-templates", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setTemplate(data.template);
      setMessage(data.message || "Certificate template uploaded successfully.");
      setFile(null);
      setInputKey(Date.now());
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload certificate template.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-page">
      <h1>Certificate Templates</h1>
      <p>
        Upload a blank certificate image with placeholder fields for student name, course name, issued date,
        and certificate number. This image will be used when students generate certificates.
      </p>

      <form className="admin-form" onSubmit={handleUpload}>
        <div className="form-group">
          <label htmlFor="template">Blank Certificate Image</label>
          <input
            id="template"
            key={inputKey}
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          {file && <p style={{ marginTop: 8 }}>Selected file: {file.name}</p>}
        </div>

        <div className="form-group">
          <label>Recommended certificate fields</label>
          <ul className="admin-list">
            <li>Student Name</li>
            <li>Course Title</li>
            <li>Issued Date</li>
            <li>Certificate Number</li>
          </ul>
        </div>

        <div className="button-row">
          <button type="submit" className="button-primary" disabled={uploading}>
            {uploading ? "Uploading template..." : "Upload Template"}
          </button>
        </div>

        {message && <div className="admin-alert">{message}</div>}
        {error && (
          <div className="admin-alert" style={{ background: "#fee2e2", color: "#991b1b" }}>
            {error}
          </div>
        )}
      </form>

      <section className="admin-card" style={{ marginTop: 24 }}>
        <h2>Current Blank Template</h2>
        {template ? (
          <img
            src={template.imageUrl}
            alt="Certificate template preview"
            style={{ width: "100%", maxWidth: 720, borderRadius: 16, marginTop: 16 }}
          />
        ) : (
          <p style={{ color: "#cbd5e1", marginTop: 12 }}>
            No certificate template uploaded yet. Upload a blank image to enable student certificates.
          </p>
        )}
      </section>
    </div>
  );
}
