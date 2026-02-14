import { useState, useEffect } from 'react';

export function useResponsiveCellSize(defaultSize: number = 25) {
   const [cellSize, setCellSize] = useState(defaultSize);

   useEffect(() => {
      const updateCellSize = () => {
         const width = window.innerWidth;

         if (width < 640) {
            setCellSize(18);
         } else if (width < 768) {
            setCellSize(22);
         } else if (width < 1024) {
            setCellSize(25);
         } else if (width < 1280) {
            setCellSize(25);
         } else {
            setCellSize(26);
         }
      };

      updateCellSize();
      window.addEventListener('resize', updateCellSize);

      return () => window.removeEventListener('resize', updateCellSize);
   }, []);

   return cellSize;
}