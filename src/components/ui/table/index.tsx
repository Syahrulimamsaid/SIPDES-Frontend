import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

// Props for Table
interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: ReactNode; // Table content (thead, tbody, etc.)
  className?: string; // Optional className for styling
}

// Props for TableHeader
interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode; // Header row(s)
  className?: string; // Optional className for styling
}

// Props for TableBody
interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode; // Body row(s)
  className?: string; // Optional className for styling
}

// Props for TableRow
interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode; // Cells (th or td)
  className?: string; // Optional className for styling
}

// Props for TableCell
interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode; // Cell content
  isHeader?: boolean; // If true, renders as <th>, otherwise <td>
  className?: string; // Optional className for styling
}

// Props for TablePagination
interface TablePaginationProps<T> {
  data: T[];
  defaultItemsPerPage?: number;
  onPageDataChange: (paginatedData: T[]) => void;
  className?: string;
}

// Table Component
const Table: React.FC<TableProps> = ({ children, className, ...props }) => {
  return <table className={`min-w-full  ${className}`} {...props}>{children}</table>;
};

// TableHeader Component
const TableHeader: React.FC<TableHeaderProps> = ({ children, className, ...props }) => {
  return <thead className={className} {...props}>{children}</thead>;
};

// TableBody Component
const TableBody: React.FC<TableBodyProps> = ({ children, className, ...props }) => {
  return <tbody className={className} {...props}>{children}</tbody>;
};

// TableRow Component
const TableRow: React.FC<TableRowProps> = ({ children, className, ...props }) => {
  return <tr className={className} {...props}>{children}</tr>;
};

// TableCell Component
const TableCell: React.FC<TableCellProps> = ({
  children,
  isHeader = false,
  className,
  ...props
}) => {
  const CellTag = isHeader ? "th" : "td";
  return (
    <CellTag className={` ${className}`} {...props}>
      {children}
    </CellTag>
  );
};

// TablePagination Component
const TablePagination: React.FC<TablePaginationProps<any>> = ({
  data,
  defaultItemsPerPage = 5,
  onPageDataChange,
  className = "",
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(defaultItemsPerPage);

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedData = useMemo(() => {
    return data.slice(startIndex, endIndex);
  }, [data, startIndex, endIndex]);

  useEffect(() => {
    onPageDataChange(paginatedData);
  }, [paginatedData, onPageDataChange]);

  const handleMove = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }

  useEffect(() => {
    if (data.length > 0) {
      handleMove(1);
    }
  }, [data]);

  
  return (
    <div className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 ${className}`}>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Menampilkan <span className="font-semibold text-gray-900 dark:text-white">{startIndex + 1}</span>
        {' '}-{' '}
        <span className="font-semibold text-gray-900 dark:text-white">{Math.min(endIndex, totalItems)}</span> dari{" "}
        <span className="font-semibold text-gray-900 dark:text-white">{totalItems}</span> baris
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">Baris per halaman:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="h-9 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent px-2 text-sm text-gray-700 dark:text-gray-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none dark:bg-gray-950 cursor-pointer"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => handleMove(1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-150 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronsLeft size={16} />
          </button>
          <button
            onClick={() => handleMove(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-150 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) => {
              return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
            })
            .map((page, index, array) => {
              const isEllipsis = index > 0 && page - array[index - 1] > 1;
              return (
                <div key={page} className="flex items-center">
                  {isEllipsis && (
                    <span className="px-2 text-gray-400 dark:text-gray-500">...</span>
                  )}
                  <button
                    onClick={() => handleMove(page)}
                    className={`min-w-8 h-8 px-2.5 rounded-lg text-sm font-semibold transition-colors ${currentPage === page
                      ? "bg-brand-500 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      }`}
                  >
                    {page}
                  </button>
                </div>
              );
            })}

          <button
            onClick={() => handleMove(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-2 rounded-lg border border-gray-150 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronRight size={16} />
          </button>
          <button
            onClick={() => handleMove(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-2 rounded-lg border border-gray-150 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export { Table, TableHeader, TableBody, TableRow, TableCell, TablePagination };

