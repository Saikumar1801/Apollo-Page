// frontend/components/Pagination.tsx
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pageNumbers = [];
  const maxPagesToShow = 5; // Show 5 page numbers at a time
  let startPage, endPage;

  if (totalPages <= maxPagesToShow) {
      startPage = 1;
      endPage = totalPages;
  } else {
      if (currentPage <= Math.ceil(maxPagesToShow / 2)) {
          startPage = 1;
          endPage = maxPagesToShow;
      } else if (currentPage + Math.floor(maxPagesToShow / 2) >= totalPages) {
          startPage = totalPages - maxPagesToShow + 1;
          endPage = totalPages;
      } else {
          startPage = currentPage - Math.floor(maxPagesToShow / 2);
          endPage = currentPage + Math.floor(maxPagesToShow / 2);
      }
  }

  for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
  }

  return (
    <nav className="mt-8 flex justify-center items-center space-x-2" aria-label="Pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      {startPage > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100">1</button>
          {startPage > 2 && <span className="px-3 py-1">...</span>}
        </>
      )}

      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-3 py-1 border rounded-md text-sm
            ${currentPage === number
              ? 'bg-apollo_primary text-white border-apollo_primary'
              : 'border-gray-300 hover:bg-gray-100'
            }`}
        >
          {number}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages -1 && <span className="px-3 py-1">...</span>}
          <button onClick={() => onPageChange(totalPages)} className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100">{totalPages}</button>
        </>
      )}


      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </nav>
  );
};

export default Pagination;