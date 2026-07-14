import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/axios";
import CourseSections from "../components/CourseSections/CourseSections";
import LessonPlayer from "../components/LessonPlayer/LessonPlayer";
import "./Lesson.css";

export default function Lesson() {
  const { id, lessonId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [completedLessonIds, setCompletedLessonIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);

  const fetchCourseAndSections = async () => {
  try {
    setLoading(true);

    const courseRes = await API.get(`/courses/${id}`);
    setCourse(courseRes.data.course);

    // Check if user is enrolled in the course
    try {
      const enrollmentRes = await API.get(`/enrollments/check/${id}`);
      setEnrolled(enrollmentRes.data.enrolled || false);
    } catch (err) {
      console.log("Enrollment check failed:", err);
      setEnrolled(false);
    }

    const sectionsRes = await API.get(`/sections/${id}`);

    const sectionList = sectionsRes.data.sections || [];

    // Fetch lessons for every section
    const sectionsWithLessons = await Promise.all(
      sectionList.map(async (section) => {
        const lessonRes = await API.get(`/lessons/${section._id}`);

        return {
          ...section,
          lessons: lessonRes.data.lessons || [],
        };
      })
    );

    setSections(sectionsWithLessons);

    const progressRes = await API.get(`/progress/${id}`);
    const completedIds = new Set(
      (progressRes.data.progress || []).map((item) =>
        item.lesson?._id || item.lesson
      )
    );
    setCompletedLessonIds(completedIds);

    // Select first lesson
    const allLessons = sectionsWithLessons.flatMap(
      (section) => section.lessons
    );

    if (allLessons.length > 0) {
      const current =
        allLessons.find((lesson) => lesson._id === lessonId) ||
        allLessons[0];

      setSelectedLesson(current);
    }

  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchCourseAndSections();
  }, [id, lessonId]);

  const handleLessonSelect = (lesson) => {
    if (!lesson) return;
    navigate(`/course/${id}/watch/${lesson._id}`);
    setSelectedLesson(lesson);
  };

  const handleMarkCompleted = async () => {
    if (!selectedLesson) return;

    try {
      await API.post("/progress/complete", {
        courseId: id,
        lessonId: selectedLesson._id,
      });

      setCompletedLessonIds((prev) => new Set(prev).add(selectedLesson._id));
    } catch (err) {
      console.error("Failed to mark lesson complete:", err);
    }
  };

  const handlePreviousLesson = () => {
    const lessons = sections.flatMap((section) => section.lessons || []);
    const index = lessons.findIndex((lesson) => lesson._id === selectedLesson?._id);

    if (index > 0) {
      const previous = lessons[index - 1];
      navigate(`/course/${id}/watch/${previous._id}`);
      setSelectedLesson(previous);
    }
  };

  const handleNextLesson = () => {
    const lessons = sections.flatMap((section) => section.lessons || []);
    const index = lessons.findIndex((lesson) => lesson._id === selectedLesson?._id);

    if (index >= 0 && index < lessons.length - 1) {
      const next = lessons[index + 1];
      navigate(`/course/${id}/watch/${next._id}`);
      setSelectedLesson(next);
    }
  };

  if (loading) {
    return <div className="course-loading">Loading lesson...</div>;
  }

  return (
    <div className="lesson-page">
      <div className="lesson-layout">
        <div className="lesson-left">
          <div className="lesson-title">
            {course?.title || "Course"}
          </div>
          <LessonPlayer
            lesson={selectedLesson}
            enrolled={enrolled}
            completed={completedLessonIds.has(selectedLesson?._id)}
            onComplete={handleMarkCompleted}
            previousLesson={handlePreviousLesson}
            nextLesson={handleNextLesson}
          />
        </div>

        <div className="lesson-right">
          <CourseSections sections={sections} onLessonSelect={handleLessonSelect} />
        </div>
      </div>
    </div>
  );
}
