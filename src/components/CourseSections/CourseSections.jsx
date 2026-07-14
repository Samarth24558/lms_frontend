import "./CourseSections.css";
import { useState, useRef, useEffect } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaLock,
  FaPlayCircle,
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
    url = url.replace(/(\.\w+)\1+(?=\?|$)/g, "$1");
  }

  return url;
};

export default function CourseSections({
  sections = [],
  onLessonSelect,
}) {
  const [openSection, setOpenSection] = useState(null);
  const videoEls = useRef({});

  const toggleSection = (sectionId) => {
    setOpenSection(openSection === sectionId ? null : sectionId);
  };

  // Play previews for lessons in the opened section automatically
  // Pause previews in other sections
  const playPreviewsForSection = (sectionId) => {
    sections.forEach((sec) => {
      (sec.lessons || []).forEach((lesson) => {
        const el = videoEls.current[lesson._id];
        if (!el) return;
        if (sec._id === sectionId) {
          try {
            el.muted = true;
            el.play().catch(() => {});
          } catch (e) {}
        } else {
          try {
            el.pause();
            el.currentTime = 0;
          } catch (e) {}
        }
      });
    });
  };

  useEffect(() => {
    playPreviewsForSection(openSection);
  }, [openSection, sections]);

  return (
    <div className="sections">
      <h2>Course Content</h2>

      {sections.length === 0 ? (
        <div className="no-sections">
          No sections available.
        </div>
      ) : (
        sections.map((section) => (
          <div
            key={section._id}
            className="section-card"
          >
            <div
              className="section-header"
              onClick={() => toggleSection(section._id)}
            >
              <div>
                <h3>{section.title}</h3>

                <small>
                  {section.lessons?.length || 0} Lessons
                </small>
              </div>

              {openSection === section._id ? (
                <FaChevronUp />
              ) : (
                <FaChevronDown />
              )}
            </div>

            {openSection === section._id && (
              <div className="lesson-list">
                <div className="lesson-list-title">Lessons in {section.title}</div>

                {(section.lessons || []).length === 0 ? (
                  <p className="empty-lessons">
                    No lessons available.
                  </p>
                ) : (
                  section.lessons.map((lesson, lessonIndex) => {
                    const thumb = normalizeMediaUrl(lesson.thumbnail || lesson.thumbnailUrl || lesson.image || lesson.videoUrl);
                    const videoSrc = normalizeMediaUrl(lesson.videoUrl || lesson.video || lesson.video_url);
                    return (
                      <div
                        key={lesson._id}
                        className="lesson-item"
                        onClick={() => onLessonSelect?.(lesson)}
                      >
                        <div className="lesson-number">{lessonIndex + 1}</div>
                        <div className="lesson-thumb">
                          {thumb ? (
                            <img src={thumb} alt={lesson.title} onError={(e) => { e.target.style.display = 'none'; }} />
                          ) : (
                            <div className="thumb-fallback" />
                          )}

                          {videoSrc && (
                            <>
                              <video
                                ref={(el) => (videoEls.current[lesson._id] = el)}
                                className="thumb-video"
                                src={videoSrc}
                                preload="metadata"
                                muted
                                loop
                                autoPlay
                                playsInline
                                aria-hidden
                              />
                              <div className="video-title-overlay">{lesson.title}</div>
                              <div className="play-overlay">
                                <FaPlayCircle />
                              </div>
                            </>
                          )}
                        </div>

                        <div className="lesson-meta">                    
                          <h4>{lesson.title}</h4>
                          <div className="meta-sub">{lesson.description ? lesson.description.slice(0, 80) + (lesson.description.length > 80 ? '...' : '') : ''}</div>
                        </div>

                        <div className="lesson-right">
                          <div className="duration">{lesson.duration}</div>
                        </div>
                      </div>
                    );
                  })
                )}

              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}