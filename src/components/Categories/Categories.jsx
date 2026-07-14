import "./Categories.css";
import { motion } from "framer-motion";
import {
  FaCode,
  FaRobot,
  FaMobileAlt,
  FaDatabase,
  FaCloud,
  FaShieldAlt,
  FaPalette,
  FaChartLine,
} from "react-icons/fa";

const categories = [
  {
    icon: <FaCode />,
    title: "Web Development",
    courses: "25 Courses",
  },
  {
    icon: <FaRobot />,
    title: "Artificial Intelligence",
    courses: "18 Courses",
  },
  {
    icon: <FaMobileAlt />,
    title: "Mobile Development",
    courses: "14 Courses",
  },
  {
    icon: <FaDatabase />,
    title: "Database",
    courses: "10 Courses",
  },
  {
    icon: <FaCloud />,
    title: "Cloud Computing",
    courses: "12 Courses",
  },
  {
    icon: <FaShieldAlt />,
    title: "Cyber Security",
    courses: "16 Courses",
  },
  {
    icon: <FaPalette />,
    title: "UI / UX Design",
    courses: "8 Courses",
  },
  {
    icon: <FaChartLine />,
    title: "Data Science",
    courses: "15 Courses",
  },
];

export default function Categories() {
  return (
    <section className="categories">

      <div className="section-title">
        <h2>Popular Categories</h2>
        <p>Choose your favorite learning path.</p>
      </div>

      <div className="category-grid">

        {categories.map((item, index) => (

          <motion.div
            key={index}
            className="category-card"
            whileHover={{
              y: -10,
              scale: 1.03,
            }}
          >

            <div className="category-icon">

              {item.icon}

            </div>

            <h3>{item.title}</h3>

            <p>{item.courses}</p>

          </motion.div>

        ))}

      </div>

    </section>
  );
}