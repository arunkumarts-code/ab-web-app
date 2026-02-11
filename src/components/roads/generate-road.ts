const ERoadType = {
   Big: 0,
   BigEye: 1,
   SmallEye: 2,
   Dish: 3,
   Cockroach: 4,
};

const EResultType = {
   None: 0,
   Banker: 1,
   Player: 2,
   Draw: 3,
};

const CONFIG = {
   [ERoadType.Big]: { row: 6, column: 150 },
   [ERoadType.BigEye]: { row: 6, column: 150 },
   [ERoadType.SmallEye]: { row: 6, column: 150 },
   [ERoadType.Cockroach]: { row: 6, column: 150 },
   [ERoadType.Dish]: { row: 6, column: 150 },
};

type EyeRoadValue = 1 | 2 | null;
type EyeRoadQuad = EyeRoadValue[];

function makeBoard(cols: number, rows: number): (any | null)[][] {
   const arr = new Array(cols);
   for (let c = 0; c < cols; c++) {
      arr[c] = new Array(rows).fill(null);
   }
   return arr;
}

function updateBoard(board: any, colDataArr: any, config: any ) {
   const colLimit = config.column;
   const rowLimit = config.row;
   let colStarterIndex = -1;
   let colIndex = -1;
   let rowIndex = -1;

   colDataArr.forEach((colDatas : any) => {
      // move to next column starter (i.e., start a new Big Road column)
      colStarterIndex++;
      colIndex = colStarterIndex;
      rowIndex = -1;

      colDatas.colDatas.forEach((data: any) => {
         // compute next target (down if possible; else move right; if rowIndex==0 and blocked, advance starter)
         let isNotOver = colIndex < colLimit && rowIndex < rowLimit;
         if (!isNotOver) {
            return; // out of visual range
         } else if (rowIndex + 1 < rowLimit) {
            const isBlocked = board[colIndex][rowIndex + 1] != null;
            if (isBlocked) {
               colIndex++;
               if (rowIndex === 0) {
                  colStarterIndex++;
               }
            } else {
               rowIndex++;
            }
         } else {
            colIndex++;
         }

         isNotOver = colIndex < colLimit && rowIndex < rowLimit;
         if (!isNotOver) {
            return;
         }
         board[colIndex][rowIndex] = data;
      });
   });
   return board;
}

export function updateBigRoad(raw: any[]) {
   const config = CONFIG[ERoadType.Big] || {
      column: (raw || []).length || 30,
      row: CONFIG[ERoadType.Big].row,
   };
   const board = makeBoard(config.column, config.row);

   const tempBigRoad: any[] = [];
   let bigRoadCounter = -1;
   let prevType = EResultType.None;

   // group raw into Big Road entries (merge draws into current cell)
   raw.forEach(({ resultType, isBankerPair, isPlayerPair }) => {
      if (
         resultType === EResultType.Banker ||
         resultType === EResultType.Player
      ) {
         if (
            bigRoadCounter !== -1 &&
            tempBigRoad[bigRoadCounter].resultType === EResultType.Draw
         ) {
            // fill the initial draw with actual result
            tempBigRoad[bigRoadCounter].resultType = resultType;
            tempBigRoad[bigRoadCounter].isBankerPair = !!isBankerPair;
            tempBigRoad[bigRoadCounter].isPlayerPair = !!isPlayerPair;
         } else {
            tempBigRoad.push({
               resultType,
               drawCounter: 0,
               isBankerPair: !!isBankerPair,
               isPlayerPair: !!isPlayerPair,
            });
            bigRoadCounter++;
         }
      } else if (resultType === EResultType.Draw) {
         if (bigRoadCounter === -1) {
            tempBigRoad.push({
               resultType: EResultType.Draw,
               drawCounter: 1,
               isBankerPair: false,
               isPlayerPair: false,
            });
            bigRoadCounter++;
         } else {
            tempBigRoad[bigRoadCounter].drawCounter += 1;
         }
      }
   });

   // convert to column groups (split on color change; draws travel with their cell)
   const bigCols: any[] = []; // IColDatas<IBigRoadData>[]
   tempBigRoad.forEach((data) => {
      if (prevType !== data.resultType && data.resultType !== EResultType.Draw) {
         prevType = data.resultType;
         bigCols.push({ colDatas: [] });
      }
      // only push non-draws; drawCounter stored inside
      if (data.resultType !== EResultType.Draw) {
         bigCols[bigCols.length - 1].colDatas.push(data);
      }
   });

   const data = bigCols;
   // paint
   for (let c = 0; c < board.length; c++) {
      for (let r = 0; r < board[c].length; r++) {
         board[c][r] = null;
      }
   }
   const tmpBoard = updateBoard(board, bigCols, config);
   const compactColumns = bigCols.map((col) =>
      col.colDatas.map((c: any) => c.resultType)
   );

   return {
      board: tmpBoard.filter((p: any) => p.filter((r: any) => r !== null).length > 0),
      data,
      compactColumns,
   };
}

export function updateDishRoad(raw: any[]) {
   const cfg = CONFIG[ERoadType.Dish] || {
      column: (raw || []).length || 30,
      row: CONFIG[ERoadType.Big].row,
   };
   const board = makeBoard(cfg.column, cfg.row);
   const rowLimit = cfg.row;

   // clear
   for (let c = 0; c < board.length; c++) {
      for (let r = 0; r < board[c].length; r++) {
         board[c][r] = null;
      }
   }

   raw.forEach((data, index) => {
      const colIndex = Math.floor(index / rowLimit);
      const rowIndex = index % rowLimit;

      if (colIndex < cfg.column) {
         board[colIndex][rowIndex] = data;
      }
   });

   return board
      .map((innerArray) => innerArray.map((obj) => obj?.resultType || null))
      .filter((p) => p.filter((r) => r !== null).length > 0);
}

function checkPreviousLineEqual(bigCols: any[], colIndex: number, prevOne: number, prevTwo: number) {
   if (colIndex < Math.max(prevOne, prevTwo)) return false;
   return (
      (bigCols[colIndex - prevOne]?.colDatas.length || 0) ===
      (bigCols[colIndex - prevTwo]?.colDatas.length || 0)
   );
}
function checkPreviousDotExist(bigCols: any[], colIndex: number, rowIndex: number, prevCount: number) {
   if (colIndex < prevCount) return false;
   return (bigCols[colIndex - prevCount]?.colDatas.length || 0) > rowIndex;
}
function checkStraightFall(bigCols: any[], colIndex: number, rowIndex: number, prevCount: number) {
   if (colIndex < prevCount) return false;
   const len = bigCols[colIndex - prevCount]?.colDatas.length || 0;
   return rowIndex >= len + 1;
}

export function updateEyeRoad(raw: any[], type: number) {
   let prevOne = 1,
      prevTwo = 2,
      prevCount = 1;
   let startCol = 1,
      startRow = 1; // defaults for Big Eye

   const big = updateBigRoad(raw);
   const bigCols = big?.data || [];

   if (type === ERoadType.BigEye) {
      prevOne = 1;
      prevTwo = 2;
      prevCount = 1;
      startCol = 1;
      startRow = 1;
   } else if (type === ERoadType.SmallEye) {
      prevOne = 1;
      prevTwo = 3;
      prevCount = 2;
      startCol = 2;
      startRow = 1;
   } else if (type === ERoadType.Cockroach) {
      prevOne = 1;
      prevTwo = 4;
      prevCount = 3;
      startCol = 3;
      startRow = 1;
   }

   const eyeCols: any = []; // IColDatas<EResultType>[]
   let prevType = EResultType.Draw; // sentinel

   bigCols.forEach((col, cIdx) => {
      col.colDatas.forEach((_: any, rIdx: any) => {
         if (cIdx < startCol || (cIdx === startCol && rIdx < startRow)) return;

         let t;
         if (rIdx === 0) {
            const equal = checkPreviousLineEqual(bigCols, cIdx, prevOne, prevTwo);
            t = equal ? EResultType.Banker : EResultType.Player;
         } else {
            const exists = checkPreviousDotExist(bigCols, cIdx, rIdx, prevCount);
            const straight = checkStraightFall(bigCols, cIdx, rIdx, prevCount);
            t = straight || exists ? EResultType.Banker : EResultType.Player;
         }

         if (t !== prevType) {
            eyeCols.push({ colDatas: [] });
            prevType = t;
         }
         eyeCols[eyeCols.length - 1].colDatas.push(t);
      });
   });

   const compactColumns = eyeCols.map((col: any) => col.colDatas);
   const cfg = {
      column:
         (compactColumns || []).length < 30 ? 30 : (compactColumns || []).length,
      row: 6,
   };
   const board = makeBoard(cfg.column, cfg.row);
   const tmpBoard = updateBoard(board, eyeCols, cfg);

   return {
      board: tmpBoard.filter((p: any) => p.filter((r: any) => r !== null).length > 0),
      data: eyeCols,
      compactColumns,
   };
}

export function toRoadQuadData(
   data: EyeRoadValue[][],
): EyeRoadQuad[][] {

   const COL_GROUP_SIZE = 2;

   const totalColGroups = Math.ceil(data.length / COL_GROUP_SIZE);
   const totalRowGroups = 3;

   const result = Array.from({ length: totalColGroups }, (_, colGroup) =>
      Array.from({ length: totalRowGroups }, (_, rowGroup) => {
         const colA = colGroup * 2;
         const colB = colA + 1;

         const rowA = rowGroup * 2;
         const rowB = rowA + 1;

         return [
            data[colA]?.[rowA] ?? null,
            data[colB]?.[rowA] ?? null,
            data[colA]?.[rowB] ?? null,
            data[colB]?.[rowB] ?? null,
         ];
      })
   );
   return result;
}