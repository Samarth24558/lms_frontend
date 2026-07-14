import "./Pagination.css";

export default function Pagination({
  page,
  totalPages,
  setPage,
}) {

  if (totalPages <= 1) return null;

  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  const changePage = (number) => {
    setPage(number);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="pagination">

      <button
        disabled={page === 1}
        onClick={() => changePage(page - 1)}
      >
        Previous
      </button>

      {pages.map((number) => (

        <button
          key={number}
          className={
            page === number ? "active" : ""
          }
          onClick={() => changePage(number)}
        >
          {number}
        </button>

      ))}

      <button
        disabled={page === totalPages}
        onClick={() => changePage(page + 1)}
      >
        Next
      </button>

    </div>
  );
}