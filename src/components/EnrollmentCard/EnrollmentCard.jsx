import "./EnrollmentCard.css";
import {
  FaPlayCircle,
  FaInfinity,
  FaMobileAlt,
  FaCertificate,
  FaDownload,
  FaLock,
} from "react-icons/fa";

export default function EnrollmentCard({
  course,
  enrolled,
  onEnroll,
}) {
  if (!course) return null;

  return (
    <div className="enrollment-card">

      <img
        src={course.thumbnail}
        alt={course.title}
        className="enrollment-image"
      />

      <div className="price-box">

        <h2>
          ₹{course.price}
        </h2>

        <span className="old-price">
          ₹{course.originalPrice}
        </span>

        <span className="discount">
          {course.discount}% OFF
        </span>

      </div>

      {enrolled ? (

        <button className="enrolled-btn">
          Already Enrolled
        </button>

      ) : (

        <button
          className="enroll-btn"
          onClick={onEnroll}
        >
          Enroll Now
        </button>

      )}

      <h3>This course includes</h3>

      <ul>

        <li>
          <FaPlayCircle />
          Full Lifetime Access
        </li>

        <li>
          <FaInfinity />
          Unlimited Access
        </li>

        <li>
          <FaMobileAlt />
          Mobile & TV
        </li>

        <li>
          <FaDownload />
          Download Resources
        </li>

        <li>
          <FaCertificate />
          Certificate
        </li>

        <li>
          <FaLock />
          Secure Access
        </li>

      </ul>

    </div>
  );
}