"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

type GameResult = {
   Hand: number;
   Result: "Win" | "Loss" | "-" | "WAIT";
   Bet: number;
};

type Props = {
   userGameResult: GameResult[];
};

export default function PLLineChart({ userGameResult }: Props) {
   const canvasRef = useRef<HTMLCanvasElement | null>(null);
   const chartRef = useRef<Chart | null>(null);

   useEffect(() => {
      if (!canvasRef.current || !userGameResult?.length) return;

      chartRef.current?.destroy();

      const labels: string[] = [];
      const cumulativePL: number[] = [];

      let totalBet = 0;
      for (const item of userGameResult) {
         labels.push(`${item.Hand}`);

         let signedBet = 0;
         if (item.Result === "Win") signedBet = item.Bet;
         else if (item.Result === "Loss") signedBet = -item.Bet;

         totalBet += signedBet;
         cumulativePL.push(totalBet);
      }

      chartRef.current = new Chart(canvasRef.current, {
         type: "line",
         data: {
            labels,
            datasets: [
               {
                  data: cumulativePL,
                  borderWidth: 2,
                  tension: 0.6,
                  fill: true,
                  pointRadius: 1,
                  segment: {
                     borderColor: (ctx) => {
                        const index = ctx.p1DataIndex;
                        const result = userGameResult[index]?.Result;

                        if (result === "Loss") return "#dc2626";
                        return "#597fb4";
                     },
                  },
               },
            ],
         },
         options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
               y: {
                  beginAtZero: false,
               },
               x: {
                  ticks: { maxTicksLimit: 10 },
                  grid: { display: false },
               },
            },
            plugins: {
               legend: { display: false },
               tooltip: {
                  callbacks: {
                     label: (ctx) => `Profit: ${ctx.raw}`,
                  },
               },
            },
         },
      });

      return () => {
         chartRef.current?.destroy();
      };
   }, [userGameResult]);

   return (
      <div className="w-full h-full">
         <canvas ref={canvasRef} />
      </div>
   );
}
