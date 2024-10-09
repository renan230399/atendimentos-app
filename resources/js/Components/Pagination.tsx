import React from 'react';
import ReactPaginate from 'react-paginate';

interface PaginationProps {
  pageCount: number;
  onPageChange: (selectedItem: { selected: number }) => void;
}

const Pagination: React.FC<PaginationProps> = ({ pageCount, onPageChange }) => {
  return (
    <div className="flex justify-center">
      <ReactPaginate
        previousLabel={'← Anterior'}
        nextLabel={'Próxima →'}
        pageCount={pageCount}
        onPageChange={onPageChange}
        containerClassName={'pagination flex flex-wrap space-x-2 justify-center'}
        activeClassName={'active bg-blue-500 text-white px-3 py-1 rounded-md'}
        pageClassName={'page-item px-3 py-1 border rounded-md text-sm'}
        previousClassName={'page-item px-3 py-1 border rounded-md text-sm'}
        nextClassName={'page-item px-3 py-1 border rounded-md text-sm'}
        disabledClassName={'disabled opacity-50 cursor-not-allowed'}
      />
    </div>
  );
};

export default Pagination;
