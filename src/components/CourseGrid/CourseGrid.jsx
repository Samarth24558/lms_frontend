import "./CourseGrid.css";
import CourseCard from "../CourseCard/CourseCard";
import SkeletonCourse from "../Skeleton/SkeletonCourse";
import EmptyState from "../EmptyState/EmptyState";

export default function CourseGrid({ courses, loading }) {

  if (loading) {
    return (
      <div className="course-grid">
        {Array.from({ length: 9 }).map((_, index) => (
          <SkeletonCourse key={index} />
        ))}
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="course-grid">

      {courses.map(course => (

        <CourseCard

          key={course._id}

          course={course}

        />

      ))}

    </div>
  );
}