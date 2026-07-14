import "./Courses.css";
import { useEffect, useState } from "react";
import API from "../services/axios";

import SearchBar from "../components/SearchBar/SearchBar";
import CourseGrid from "../components/CourseGrid/CourseGrid";
import Pagination from "../components/Pagination/Pagination";
import CourseSections from "../components/CourseSections/CourseSections";

export default function Courses() {

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("");

  const [level, setLevel] = useState("");

  const [rating, setRating] = useState("");

  const [duration, setDuration] = useState("");

  const [sort, setSort] = useState("newest");

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {

    fetchCourses();

  }, [
    page,
    search,
    category,
    level,
    rating,
    duration,
    sort
  ]);

  const fetchCourses = async () => {

    try {

      setLoading(true);

      const res = await API.get("/courses", {

        params: {

          page,

          limit: 9,

          search,

          category,

          level,

          rating,

          duration,

          sort

        }

      });

      setCourses(res.data.courses);

      setTotalPages(res.data.totalPages);

    }

    catch (err) {

      console.log(err);

    }

    finally {

      setLoading(false);

    }

  };

  

  return (

    <div className="courses-page">

      <div className="courses-header">

        <h1>

          Explore Free Courses

        </h1>


      </div>

      <SearchBar

        search={search}

        setSearch={setSearch}

      />

     

      <CourseGrid

        courses={courses}

        loading={loading}

      />

      <Pagination

        page={page}

        totalPages={totalPages}

        setPage={setPage}

      />

    </div>

  );

}