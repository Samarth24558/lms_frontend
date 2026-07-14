import { useEffect, useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import "./SearchBar.css";

export default function SearchBar({ search, setSearch }) {
  const [value, setValue] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(value);
    }, 500);

    return () => clearTimeout(timer);
  }, [value, setSearch]);

  return (
    <div className="search-container">

      <FaSearch className="search-icon" />

      <input
        type="text"
        placeholder="Search courses..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      {value && (
        <button
          className="clear-btn"
          onClick={() => {
            setValue("");
            setSearch("");
          }}
        >
          <FaTimes />
        </button>
      )}

    </div>
  );
}