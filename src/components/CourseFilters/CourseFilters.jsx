import "./CourseFilters.css";

export default function CourseFilters({

  category,
  setCategory,

  level,
  setLevel,

  rating,
  setRating,

  duration,
  setDuration,

  sort,
  setSort

}) {

  const resetFilters = () => {

    setCategory("");

    setLevel("");

    setRating("");

    setDuration("");

    setSort("newest");

  };

  return (

    <div className="filters">

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >

        <option value="">All Categories</option>

        <option value="Web Development">
          Web Development
        </option>

        <option value="Mobile Development">
          Mobile Development
        </option>

        <option value="Artificial Intelligence">
          Artificial Intelligence
        </option>

        <option value="Machine Learning">
          Machine Learning
        </option>

        <option value="Cloud Computing">
          Cloud Computing
        </option>

        <option value="Cyber Security">
          Cyber Security
        </option>

        <option value="Data Science">
          Data Science
        </option>

        <option value="UI/UX">
          UI / UX
        </option>

      </select>

      <select
        value={level}
        onChange={(e) => setLevel(e.target.value)}
      >

        <option value="">All Levels</option>

        <option value="Beginner">
          Beginner
        </option>

        <option value="Intermediate">
          Intermediate
        </option>

        <option value="Advanced">
          Advanced
        </option>

      </select>

      <select
        value={rating}
        onChange={(e) => setRating(e.target.value)}
      >

        <option value="">
          All Ratings
        </option>

        <option value="4">
          4★ & Above
        </option>

        <option value="3">
          3★ & Above
        </option>

        <option value="2">
          2★ & Above
        </option>

      </select>

      <select
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      >

        <option value="">
          All Duration
        </option>

        <option value="1-5">
          1 - 5 Hours
        </option>

        <option value="5-10">
          5 - 10 Hours
        </option>

        <option value="10+">
          10+ Hours
        </option>

      </select>

      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
      >

        <option value="newest">
          Newest
        </option>

        <option value="oldest">
          Oldest
        </option>

        <option value="rating">
          Highest Rated
        </option>

        <option value="title">
          A - Z
        </option>

      </select>

      <button
        className="reset-btn"
        onClick={resetFilters}
      >

        Reset

      </button>

    </div>

  );

}