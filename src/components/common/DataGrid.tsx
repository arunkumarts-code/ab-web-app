import React from "react";

export interface DataGridColumn {
   id?: string;
   key: string;
   label: string;
   width?: string;
   render?: (value: any, row: any, column: DataGridColumn) => React.ReactNode;
   sortable?: boolean;
   align?: "left" | "center" | "right";
   textSize?: string;
}

export interface DataGridAction {
   id: string;
   label: string;
   icon: React.ReactNode;
   className: string;
   onClick: (row: any) => void;
   show?: (row: any) => boolean;
}

interface DataGridProps {
   columns: DataGridColumn[];
   rows: any[];
   loading: boolean;
   error: string | null;
   actions?: DataGridAction[];
   onRowClick?: (row: any) => void;
   containerHeight?: string;
   noDataMessage?: string;
   rowClassName?: string;
   expandedRowIds?: Array<string | number> | Set<string | number>;
   expandedRowRender?: (row: any) => React.ReactNode;
}

export default function DataGrid({
   columns,
   rows,
   loading,
   error,
   actions = [],
   onRowClick,
   containerHeight = "flex-1",
   noDataMessage = "No data",
   rowClassName = "hover:bg-background/50 transition-colors",
   expandedRowIds,
   expandedRowRender,
}: DataGridProps) {
   const isRowExpanded = (rowId: string | number) => {
      if (!expandedRowIds) return false;
      if (Array.isArray(expandedRowIds)) return expandedRowIds.includes(rowId);
      return expandedRowIds.has(rowId);
   };

   return (
      <div className={`overflow-x-auto overflow-y-auto min-h-0 ${containerHeight}`}>
         <table className="w-full text-left text-xs md:text-sm">
            <thead className="bg-background border-b border-border text-xs uppercase text-muted font-bold sticky top-0 z-10">
               <tr>
                  {columns.map((column) => (
                     <th
                        key={column.key}
                        className={`px-3 md:px-6 py-3 md:py-4 font-bold whitespace-nowrap text-${column.align || "left"}`}
                        style={column.width ? { width: column.width } : undefined}
                     >
                        {column.label}
                     </th>
                  ))}
                  {actions.length > 0 && (
                     <th className="px-3 md:px-6 py-3 md:py-4 text-right font-bold whitespace-nowrap">
                        ACTIONS
                     </th>
                  )}
               </tr>
            </thead>
            <tbody className="divide-y divide-border">
               {error && !loading && (
                  <tr>
                     <td
                        className="px-3 md:px-6 py-4 text-red-600 text-xs md:text-sm"
                        colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                     >
                        {error}
                     </td>
                  </tr>
               )}
               {!loading && !error && (!rows || rows.length === 0) && (
                  <tr>
                     <td
                        className="px-3 md:px-6 py-6 text-muted text-xs md:text-sm"
                        colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                     >
                        {noDataMessage}
                     </td>
                  </tr>
               )}
               {!loading &&
                  !error &&
                  rows &&
                  rows.length > 0 &&
                  rows.map((row, idx) => {
                     const rowId = row.id || idx;
                     const expanded = isRowExpanded(rowId);

                     return (
                        <React.Fragment key={rowId}>
                           <tr
                              className={rowClassName}
                              onClick={() => onRowClick?.(row)}
                           >
                              {columns.map((column) => (
                                 <td
                                    key={`${rowId}-${column.key}`}
                                    className={`px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-${column.align || "left"}`}
                                 >
                                    {column.render
                                       ? column.render(row[column.key], row, column)
                                       : row[column.key]}
                                 </td>
                              ))}
                              {actions.length > 0 && (
                                 <td className="px-3 md:px-6 py-3 md:py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                       {actions
                                          .filter((action) => !action.show || action.show(row))
                                          .map((action) => (
                                             <button
                                                key={action.id}
                                                onClick={(e) => {
                                                   e.stopPropagation();
                                                   action.onClick(row);
                                                }}
                                                className={`p-2 rounded-lg transition-colors cursor-pointer flex-shrink-0 ${action.className}`}
                                                title={action.label}
                                             >
                                                {action.icon}
                                             </button>
                                          ))}
                                    </div>
                                 </td>
                              )}
                           </tr>
                           {expandedRowRender && expanded && (
                              <tr className="bg-background/40">
                                 <td
                                    className="px-3 md:px-6 py-4"
                                    colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                                 >
                                    {expandedRowRender(row)}
                                 </td>
                              </tr>
                           )}
                        </React.Fragment>
                     );
                  })}
            </tbody>
         </table>
      </div>
   );
}
