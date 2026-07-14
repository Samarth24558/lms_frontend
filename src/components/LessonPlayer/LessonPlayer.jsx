import "./LessonPlayer.css";
import {
  FaFilePdf,
  FaArrowLeft,
  FaArrowRight,
  FaLock,
} from "react-icons/fa";

const normalizeMediaUrl = (value) => {
  if (!value) return "";

  let url = "";

  if (typeof value === "string") {
    url = value.trim();
  } else if (typeof value === "object") {
    url = value.secure_url || value.url || value.path || value.src || value.link || "";
  }

  if (url) {
    // Remove duplicate extensions (e.g., .mp4.mp4 -> .mp4)
    url = url.replace(/(\.\w+)\1+(?=\?|$)/g, "$1");
  }

  return url;
};

const handlePdfDownload = async (url, fileName = "lesson-notes.pdf") => {
  if (!url) return;
  
  try {
    // Fetch the PDF file
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error("Failed to fetch PDF:", response.status);
      return;
    }
    
    // Get the file as a blob with proper MIME type
    const blob = await response.blob();
    const pdfBlob = new Blob([blob], { type: "application/pdf" });
    
    // Create a temporary URL for the blob
    const blobUrl = window.URL.createObjectURL(pdfBlob);
    
    // Create a temporary link element and trigger download
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Error downloading PDF:", error);
    // Fallback: try direct download
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
  }
};

const getVideoMimeType = (url) => {
  if (!url) return "video/mp4";

  const lowerUrl = url.toLowerCase();

  if (lowerUrl.endsWith(".webm")) return "video/webm";
  if (lowerUrl.endsWith(".ogg") || lowerUrl.endsWith(".ogv")) return "video/ogg";
  if (lowerUrl.includes("m3u8") || lowerUrl.endsWith(".m3u8")) return "application/x-mpegURL";

  return "video/mp4";
};

export default function LessonPlayer({
  lesson,
  enrolled,
  completed,
  onComplete,
  previousLesson,
  nextLesson,
}) {
  if (!lesson)
    return (
      <div className="lesson-placeholder">
        Select a lesson to start learning.
      </div>
    );

  const canAccess = enrolled || lesson.isPreview;
  const videoUrl = normalizeMediaUrl(lesson.videoUrl || lesson.video || lesson.video_url);
  const pdfUrl = normalizeMediaUrl(lesson.pdfUrl || lesson.pdf || lesson.pdf_url);

  return (
    <div className="lesson-player">
      <h2>{lesson.title}</h2>

      {!canAccess ? (
        <div className="lesson-locked">
          <FaLock size={45} />

          <h3>This lesson is locked.</h3>

          <p>Enroll in the course to unlock this lesson.</p>
        </div>
      ) : (
        <>
          {videoUrl && (
            <video
              className="video-player"
              controls
              controlsList="nodownload"
              preload="metadata"
              playsInline
            >
              <source src={videoUrl} type={getVideoMimeType(videoUrl)} />
              Your browser does not support the video tag.
            </video>
          )}

          <p className="lesson-description">
            {lesson.description}
          </p>

          {pdfUrl && (
            <button
              onClick={() => handlePdfDownload(pdfUrl, "lesson-notes.pdf")}
              className="pdf-btn"
              style={{ border: "none", background: "rgba(253, 36, 36, 0.86)", cursor: "pointer" }}
            >
              <FaFilePdf />
              Download PDF Notes of this lesson
            </button>
          )}

          <div className="lesson-actions">
            {completed ? (
              <span className="lesson-completed">Lesson completed</span>
            ) : (
              enrolled && (
                <button className="complete-btn" onClick={onComplete}>
                  Mark as Completed
                </button>
              )
            )}
          </div>

          <div className="lesson-navigation">
            <button onClick={previousLesson}>
              <FaArrowLeft />
              Previous
            </button>

            <button onClick={nextLesson}>
              Next
              <FaArrowRight />
            </button>
          </div>
        </>
      )}
    </div>
  );
}