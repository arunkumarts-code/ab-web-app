"use client";

import { ReactNode } from "react";

interface RoadGridProps {
  rows: number;
  cellSize: number;
  columns: number;     
  dataLength: number;      
  children: ReactNode;       
}

export default function RoadGrid({
  rows = 6,
  cellSize = 32,
  columns=20,
  dataLength,
  children,
}: RoadGridProps) {

  const totalColumns = Math.max(dataLength ?? 0, Math.ceil(columns / cellSize));

  return (
    <div className="w-full box-border bg-surface">
      <div
        // className=" scrollbar-custom overflow-y-hidden"
        className="overflow-x-auto hideScrollbar-custom overflow-y-hidden"
      >
        <div
          className="relative grid box-border"
          style={{
            gridTemplateColumns: `repeat(${totalColumns}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
          }}
        >
          {/* Background grid */}
          {Array.from({ length: totalColumns * rows }).map((_, i) => (
            <div
              key={i}
              className="border-1 border-border box-border"
              style={{
                marginRight: '-1px',
                marginBottom: '-1px',
              }}
            />
          ))}

          {/* Overlay layer */}
          {children}
        </div>
      </div>
    </div>
  );
}
