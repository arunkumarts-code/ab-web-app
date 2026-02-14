
interface GridPaginationProps {
   currentPage: number;
   totalPages: number;
   pageSize: number;
   totalRecords: number;
   pageSizeOptions: number[];
   onPageChange: (page: number) => void;
   onPageSizeChange: (size: number) => void;
}

export default function GridPagination({
   currentPage,
   totalPages,
   pageSize,
   totalRecords,
   pageSizeOptions,
   onPageChange,
   onPageSizeChange,
}: GridPaginationProps) {

   const startIndex = totalRecords > 0 ? (currentPage - 1) * pageSize + 1 : 0;
   const endIndex = Math.min(currentPage * pageSize, totalRecords);

   // Calculate page range to show - centered around current page
   const getVisiblePageRange = () => {
      const maxVisiblePages = 5;
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      // Adjust start if we're near the end
      if (endPage - startPage + 1 < maxVisiblePages) {
         startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      return { startPage, endPage };
   };

   const { startPage, endPage } = getVisiblePageRange();

   return (
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 md:p-6 border-t border-border bg-background">
         {/* Left Section: Page Size Select + Records Info */}
         <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto order-2 md:order-1">
            <div className="flex items-center gap-2">
               <label className="text-xs md:text-sm text-muted whitespace-nowrap">Show:</label>
               <select
                  value={pageSize}
                  onChange={(e) => onPageSizeChange(Number(e.target.value))}
                  className="appearance-none bg-background border border-border rounded-lg pl-3 pr-8 py-1.5 text-xs md:text-sm text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer"
               >
                  {pageSizeOptions.map((size) => (
                     <option key={size} value={size}>
                        {size}
                     </option>
                  ))}
               </select>
            </div>
            <div className="text-xs md:text-sm text-muted whitespace-nowrap">
               Showing {startIndex} to {endIndex} of {totalRecords} records
            </div>
         </div>

         {/* Right Section: Pagination Controls */}
         <div className="flex items-center gap-1 md:gap-2 overflow-x-auto order-1 md:order-2">
            <button
               onClick={() => onPageChange(Math.max(1, currentPage - 1))}
               disabled={currentPage === 1}
               className="px-2 md:px-4 py-2 border border-border rounded-lg text-xs md:text-sm font-medium text-foreground hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
            >
               Prev
            </button>

            <div className="flex items-center gap-1">
               {/* Show first page if not in visible range */}
               {startPage > 1 && (
                  <>
                     <button
                        onClick={() => onPageChange(1)}
                        className={`w-8 h-8 rounded-lg text-xs md:text-sm font-medium transition-colors cursor-pointer flex-shrink-0 ${1 === currentPage
                              ? "bg-primary text-white"
                              : "border border-border text-foreground hover:bg-surface"
                           }`}
                     >
                        1
                     </button>
                     {startPage > 2 && (
                        <span className="px-2 text-muted/70 text-xs md:text-sm">...</span>
                     )}
                  </>
               )}

               {/* Show pages in visible range */}
               {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(
                  (page) => (
                     <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`w-8 h-8 rounded-lg text-xs md:text-sm font-medium transition-colors cursor-pointer flex-shrink-0 ${page === currentPage
                              ? "bg-primary text-white"
                              : "border border-border text-foreground hover:bg-surface"
                           }`}
                     >
                        {page}
                     </button>
                  )
               )}

               {/* Show last page if not in visible range */}
               {endPage < totalPages && (
                  <>
                     {endPage < totalPages - 1 && (
                        <span className="px-2 text-muted/70 text-xs md:text-sm">...</span>
                     )}
                     <button
                        onClick={() => onPageChange(totalPages)}
                        className={`w-8 h-8 rounded-lg text-xs md:text-sm font-medium transition-colors cursor-pointer flex-shrink-0 ${totalPages === currentPage
                              ? "bg-primary text-white"
                              : "border border-border text-foreground hover:bg-surface"
                           }`}
                     >
                        {totalPages}
                     </button>
                  </>
               )}
            </div>

            <button
               onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
               disabled={currentPage === totalPages}
               className="px-2 md:px-4 py-2 border border-border rounded-lg text-xs md:text-sm font-medium text-foreground hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
            >
               Next
            </button>
         </div>
      </div>
   );
}
