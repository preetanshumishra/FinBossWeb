import '../styles/Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
}: PaginationProps) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className="pagination">
      <button
        className="pagination-btn pagination-prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrev || disabled}
        aria-label="Previous page"
      >
        ← Previous
      </button>

      <div className="pagination-pages">
        {pages.map((page, index) => (
          <button
            key={index}
            className={`pagination-page ${
              page === currentPage ? 'active' : ''
            } ${page === '...' ? 'ellipsis' : ''}`}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...' || disabled}
            aria-label={
              typeof page === 'number'
                ? `Page ${page}`
                : 'More pages'
            }
          >
            {page}
          </button>
        ))}
      </div>

      <button
        className="pagination-btn pagination-next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext || disabled}
        aria-label="Next page"
      >
        Next →
      </button>

      <div className="pagination-info">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};
