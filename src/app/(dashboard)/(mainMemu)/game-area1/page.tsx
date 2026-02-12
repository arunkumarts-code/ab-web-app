"use client";

import BeadRoad from "@/components/roads/bead-road/BeadRoad";
import BigRoad from "@/components/roads/big-road/BigRoad";
import EyeRoad from "@/components/roads/big-eye-boad/EyeRoad";
import RoachRoad from "@/components/roads/cockroach-road/RoachRoad";
import SmallRoad from "@/components/roads/small-raod/SmallRoad";
import { Briefcase, Package, TrendingUp } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaUndo, FaTrashAlt, FaWallet } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import GlobalLoader from "@/components/common/GlobalLoader";
import { MM_LISTES } from "@/constants/money-management/mm-lists";
import { updateEyeRoad } from "@/components/roads/generate-road";
import PLLineChart from "@/components/game-area/PLLineChart";
import { addHand, getGameResults, newGame, skipHand, undoHand } from "@/services/game.service";
import { GAME_TYPE } from "@/constants/games/game-types";
import { MM_TYPES } from "@/constants/money-management/mm-types";

const GameArea1Page = () => {
  const [currentGame, setCurrentGame] = useState<any>(null);
  const [openMenuDial, setOpenMenuDial] = useState(false);
  const [convertedResult, setConvertedResult] = useState<any[]>([]);
  const [loadingGame, setLoadingGame] =useState(true);
  const menuRef = useRef<HTMLDivElement>(null);
  const activeStepRef = useRef<HTMLDivElement | null>(null);

  const roadSymbolPrediction = useMemo(() => {
    const bankerRoadData = {
      resultType: 1,
      isBankerPair: false,
      isPlayerPair: false
    };
    const nextBankerResult = [...convertedResult, bankerRoadData];
    const bankerEye = updateEyeRoad(nextBankerResult, 1);
    const bankerSmall = updateEyeRoad(nextBankerResult, 2);
    const bankerRoach = updateEyeRoad(nextBankerResult, 4);
    const bankerEyeLast = bankerEye.compactColumns;
    const bankerSmallLast = bankerSmall.compactColumns;
    const bankerRoachLast = bankerRoach.compactColumns;

    const playerRoadData = {
      resultType: 2,
      isBankerPair: false,
      isPlayerPair: false
    };
    const nextPlayerResult = [...convertedResult, playerRoadData];
    const playerEye = updateEyeRoad(nextPlayerResult, 1);
    const playerSmall = updateEyeRoad(nextPlayerResult, 2);
    const playerRoach = updateEyeRoad(nextPlayerResult, 4);
    const playerEyeLast = playerEye.compactColumns;
    const playerSmallLast = playerSmall.compactColumns;
    const playerRoachLast = playerRoach.compactColumns;

    const bankerResult = {
      "Eye": bankerEyeLast?.at(-1)?.at(-1) || 0,
      "Small": bankerSmallLast?.at(-1)?.at(-1) || 0,
      "Roach": bankerRoachLast?.at(-1)?.at(-1) || 0
    }

    const playerResult = { 
      "Eye": playerEyeLast?.at(-1)?.at(-1) || 0,
      "Small": playerSmallLast?.at(-1)?.at(-1) || 0,
      "Roach": playerRoachLast?.at(-1)?.at(-1) || 0
    }

    return [bankerResult, playerResult]
  }, [convertedResult]);

  const roadRefs = {
    bigRoad: useRef<HTMLDivElement>(null),
    beadRoad: useRef<HTMLDivElement>(null),
    smallRoad: useRef<HTMLDivElement>(null),
    eyeRoad: useRef<HTMLDivElement>(null),
    roachRoad: useRef<HTMLDivElement>(null),
  };
  
  const [widths, setWidths] = useState({
    bigRoad: 0,
    beadRoad: 0,
    smallRoad: 0,
    eyeRoad: 0,
    roachRoad: 0,
  });

  const loadGameResults = async () => {
    try {
      const gameData = await getGameResults();
      setConvertedResult(gameData.convertedResult);
      setCurrentGame(gameData.currentGame);

    } catch (error) {
      console.error("Error loading game results:", error);
    }
  }

  const mmStepList = useMemo(() => {
    if (!currentGame) return [];
    const mmData = MM_LISTES[currentGame.MMId];
    return mmData.mmStepsList || [];
  }, [currentGame]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuDial(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
  const init = async () => {
    try {
      setLoadingGame(true);
      await loadGameResults();
    } finally {
      setLoadingGame(false);
    }
  };

  init();
}, []);
  
  useEffect(() => {
    if (loadingGame) return;
    const observers: ResizeObserver[] = [];

    (Object.keys(roadRefs) as Array<keyof typeof roadRefs>).forEach((key) => {
      const el = roadRefs[key].current;
      if (!el) return;

      const observer = new ResizeObserver(([entry]) => {
        setWidths((prev) => ({
          ...prev,
          [key]: entry.contentRect.width,
        }));
      });

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [loadingGame]);

  const handleAddHand = async (handType: "P" | "B" | "T") => {
    setLoadingGame(true);

    const gameData = await addHand(handType);
    setConvertedResult(gameData.convertedResult);
    setCurrentGame(gameData.currentGame);

    setLoadingGame(false);
  }

  const handleRestart = async () => {
    setLoadingGame(true);
    setOpenMenuDial(false);

    const gameData = await newGame(GAME_TYPE.DARK_SMOKE, MM_TYPES.ORC_III_MM);
    setConvertedResult(gameData.convertedResult);
    setCurrentGame(gameData.currentGame);

    setLoadingGame(false);
  }

  const handleUndo = async () => {
    setLoadingGame(true);
    setOpenMenuDial(false);

    const gameData = await undoHand();
    setConvertedResult(gameData.convertedResult);
    setCurrentGame(gameData.currentGame);

    setLoadingGame(false);
  }

  const handleSkip = async () => {
    setLoadingGame(true);

    const gameData = await skipHand();
    setConvertedResult(gameData.convertedResult);
    setCurrentGame(gameData.currentGame);

    setLoadingGame(false);
  }

  const getStepLabel = (stepIndex: number) => {
    if (stepIndex === -1) return "Pos 1";
    if (stepIndex === 0) return "Base";
    return `Step ${stepIndex + 1}`;
  };

  return (
    <>
    {loadingGame && <GlobalLoader />}

    <div className="space-y-2 flex flex-col h-full w-full">
      {/* Road Tabs */}
      <div className="space-y-3 flex flex-col h-full w-full">
        <div className="flex w-full flex-col md:flex-row gap-2">
          <div className="md:w-50 flex-1 overflow-hidden" ref={roadRefs.bigRoad}>
            <div className="p-1 text-xs bg-primary text-white uppercase tracking-wider font-bold rounded-tl-lg rounded-tr-lg">Big Road</div>
            <BigRoad columns={widths.bigRoad} data={convertedResult} cellSize={25} />
          </div>
          <div className="md:w-100 overflow-hidden" ref={roadRefs.beadRoad}>
            <div className="p-1 text-xs bg-primary text-white uppercase tracking-wider font-bold rounded-tl-lg rounded-tr-lg">Bead Road</div>
            <BeadRoad columns={widths.beadRoad} data={convertedResult} cellSize={25} />
          </div>
        </div>

        <div className="flex w-full flex-col gap-2">
          <div className="w-full overflow-hidden flex flex-row box-border" ref={roadRefs.eyeRoad}>
            <div className="w-50 flex-1">
              <div className="p-1 text-xs bg-primary text-white uppercase tracking-wider font-bold rounded-tl-lg rounded-tr-lg">
                Big Eye Boy Road
              </div>
              <EyeRoad columns={widths.eyeRoad} data={convertedResult} cellSize={25} />
            </div>

            <div className="min-w-[120px] h-full flex flex-col ms-2 rounded-lg overflow-hidden
              border border-border bg-slate-100 dark:bg-slate-900 box-border">
              <div className="p-1 text-xs bg-primary text-white rounded-tl-lg rounded-tr-lg uppercase tracking-wider font-bold text-center">
                Prediction
              </div>

              <div className="bg-slate-100 dark:bg-slate-900 p-1 flex flex-col h-full justify-around">
                <div className="w-full flex gap-[2px]">
                  <div className="w-full aspect-square flex justify-center items-center
                      text-sm font-bold text-white rounded bg-red-600">
                    B
                  </div>

                  <div className="w-full aspect-square flex justify-center items-center rounded bg-white dark:bg-slate-800">
                    {roadSymbolPrediction[0].Eye !== 0 && (
                      <div
                        className={`w-3 h-3 rounded-full border-2
                ${roadSymbolPrediction[0].Eye === 1 ? "border-red-600" : "border-blue-500"}`}
                      />
                    )}
                  </div>

                  <div className="w-full aspect-square flex justify-center items-center rounded bg-white dark:bg-slate-800">
                    {roadSymbolPrediction[0].Small !== 0 && (
                      <div
                        className={`w-3 h-3 rounded-full
                ${roadSymbolPrediction[0].Small === 1 ? "bg-red-600" : "bg-blue-500"}`}
                      />
                    )}
                  </div>

                  <div className="w-full aspect-square flex justify-center items-center rounded bg-white dark:bg-slate-800">
                    {roadSymbolPrediction[0].Roach !== 0 && (
                      <div
                        className={`w-[2px] h-3 rotate-45
                ${roadSymbolPrediction[0].Roach === 1 ? "bg-red-600" : "bg-blue-500"}`}
                      />
                    )}
                  </div>
                </div>

                <div className="w-full flex gap-[2px]">
                  <div className="w-full aspect-square flex justify-center items-center
                        text-sm font-bold text-white rounded bg-blue-600">
                    P
                  </div>

                  <div className="w-full aspect-square flex justify-center items-center rounded bg-white dark:bg-slate-800">
                    {roadSymbolPrediction[1].Eye !== 0 && (
                      <div
                        className={`w-3 h-3 rounded-full border-2
                ${roadSymbolPrediction[1].Eye === 1 ? "border-red-600" : "border-blue-500"}`}
                      />
                    )}
                  </div>

                  <div className="w-full aspect-square flex justify-center items-center rounded bg-white dark:bg-slate-800">
                    {roadSymbolPrediction[1].Small !== 0 && (
                      <div
                        className={`w-3 h-3 rounded-full
                ${roadSymbolPrediction[1].Small === 1 ? "bg-red-600" : "bg-blue-500"}`}
                      />
                    )}
                  </div>

                  <div className="w-full aspect-square flex justify-center items-center rounded bg-white dark:bg-slate-800">
                    {roadSymbolPrediction[1].Roach !== 0 && (
                      <div
                        className={`w-[2px] h-3 rotate-45
                ${roadSymbolPrediction[1].Roach === 1 ? "bg-red-600" : "bg-blue-500"}`}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-1 w-full flex-col md:flex-row gap-2">
            <div className="w-full overflow-hidden" ref={roadRefs.smallRoad}>
              <div className="p-1 text-xs bg-primary text-white uppercase tracking-wider font-bold rounded-tl-lg rounded-tr-lg">Small Road</div>
              <SmallRoad columns={widths.smallRoad} data={convertedResult} cellSize={25} />
            </div>

            <div className="w-full overflow-hidden" ref={roadRefs.roachRoad}>
              <div className="p-1 text-xs bg-primary text-white uppercase tracking-wider font-bold rounded-tl-lg rounded-tr-lg">Cockroach Road</div>
              <RoachRoad columns={widths.roachRoad} data={convertedResult} cellSize={25} />
            </div>
          </div>

        </div>
      </div>

      {/* Prediction */}
      <div className="space-y-2">
        {/* Parity Items */}
        <div className="w-full flex justify-between items-center gap-2">
          {/* Parity */}
          <div className="bg-gray-200 dark:bg-gray-800 px-3 py-1 flex-1  rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="font-bold text-xs text-gray-800 dark:text-gray-400 uppercase tracking-wider">Parity</div>
            <div className=" font-bold text-sm text-gray-900 dark:text-gray-100">1:3:1</div>
          </div>

          {/* Player */}
          <div className="bg-blue-100 dark:bg-blue-500/30 px-3 py-1 flex-1  rounded-md shadow-sm border border-blue-200 dark:border-blue-900">
            <div className="font-bold text-xs text-blue-800 dark:text-white uppercase tracking-wider">Player</div>
            <div className=" font-bold text-sm text-blue-700 dark:text-white">{currentGame?.PlayerCount ?? 0}</div>
          </div>

          {/* Tie */}
          <div className="bg-green-100 dark:bg-green-400/30 px-3 py-1 flex-1  rounded-md shadow-sm border border-green-200 dark:border-green-900">
            <div className="font-bold text-xs text-green-800 dark:text-white uppercase tracking-wider">Tie</div>
            <div className=" font-bold text-sm text-green-700 dark:text-white">{currentGame?.TieCount ?? 0}</div>
          </div>

          {/* Banker */}
          <div className="bg-red-100 dark:bg-red-500/30 px-3 py-1 flex-1  rounded-md shadow-sm border border-red-200 dark:border-pink-900">
            <div className="font-bold text-xs text-red-600 dark:text-white uppercase tracking-wider">Banker</div>
            <div className=" font-bold text-sm text-red-700 dark:text-white">{currentGame?.BankerCount ?? 0}</div>
          </div>

          {/* Hand */}
          <div className="bg-gray-300 dark:bg-gray-800 px-3 py-1 flex-1 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="font-bold text-xs text-gray-800 dark:text-gray-400 uppercase tracking-wider">Hand</div>
            <div className=" font-bold text-sm text-gray-900 dark:text-gray-100">{currentGame?.HandCount ?? 0}</div>
          </div>
        </div>

        {/* Prediction and Stake */}
        <div className="w-full flex overflow-hidden gap-2">
          {/* Active Bet */}
          <div className={`flex flex-1 flex-col justify-center ${currentGame?.Prediction === "Banker" ? "bg-red-400" : currentGame?.Prediction === "Player" ? "bg-blue-500" : "bg-gray-500"} rounded-lg px-2 py-1`}>
            <div className="text-xl text-white font-bold text-center uppercase ">{currentGame?.Prediction ?? "WAIT"}</div>
          </div>

          {/* Stake */}
          <div className="flex flex-1 flex-col items-center justify-center py-1 bg-gray-700 rounded-lg">
            <span className="text-sm uppercase font-semibold text-gray-300">
              Stake
            </span>
            <span className="text-lg font-bold text-white">
              {(currentGame?.BetAmount ?? 0).toFixed(2)}
            </span>
          </div>
        </div>

        {/* MM */}
        <div className="flex w-full justify-between items-center gap-1 overflow-x-auto hideScrollbar-custom">
          {(mmStepList ?? []).map((step, index) => {
            const [amount, unit, stepIndex] = step;
            const isActive = (stepIndex === currentGame?.MMStepIndex - 1 && currentGame?.Prediction !== "Wait" && currentGame?.BetAmount > 0);

            return (
              <div
                key={index}
                ref={isActive ? activeStepRef : null}
                className={`
                flex-shrink-0 min-w-15 rounded-md px-2 py-1 border flex-grow
                ${isActive
                    ? "bg-primary text-white border-primary"
                    : "bg-primary/10 border-border"}
                `}
              >
                <div className="text-xs font-bold text-center">
                  {getStepLabel(stepIndex)}
                </div>

                <div className="text-sm text-center">
                  {(amount * (currentGame?.BaseUnits ?? 0)).toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Current profit */}
        <div className="w-full flex gap-2 overflow-hidden">
          {/* Start */}
          <div className="bg-surface p-2 flex-1 min-w-20 rounded-md shadow-sm border border-border  flex justify-between">
            <div className="pl-1 flex flex flex-col justify-start flex-1">
              <div className="font-bold text-sm text-primary tracking-wider ">Start</div>
              <div className="pt-1 font-bold text-sm text-gray-900 dark:text-gray-100 ">{(currentGame?.StartingBalance ?? 0).toFixed(2)}</div>
            </div>
            <div>
              <div className="p-1 text-primary ">
                <Briefcase className="text-sm w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Now */}
          <div className="bg-surface p-2 flex-1 min-w-20 rounded-md shadow-sm border border-border  flex justify-between">
            <div className="pl-1 flex flex flex-col justify-start flex-1">
              <div className="font-bold text-sm text-gray-400 tracking-wider ">Now</div>
              <div className="pt-1 font-bold text-sm text-gray-900 dark:text-gray-100 ">{(currentGame?.CurrentBalance ?? 0).toFixed(2)}</div>
            </div>
            <div>
              <div className="p-1 text-gray-400 ">
                <FaWallet className="text-sm" />
              </div>
            </div>
          </div>

          {/* Units */}
          <div className="bg-surface p-2 flex-1 min-w-20 rounded-md shadow-sm border border-border  flex justify-between">
            <div className="pl-1 flex flex flex-col justify-start flex-1">
              <div className="font-bold text-sm text-red-400 tracking-wider ">Units</div>
              <div className="pt-1 font-bold text-sm text-gray-900 dark:text-gray-100 ">{currentGame?.Units ?? 0}</div>
            </div>
            <div>
              <div className="p-1 text-red-400 ">
                <Package className="text-sm w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Profit */}
          <div className="bg-surface p-2 flex-1 min-w-20 rounded-md shadow-sm border border-border flex justify-between">
            <div className="pl-1 flex flex flex-col justify-start flex-1">
              <div className="font-bold text-sm text-green-600 tracking-wider ">Profit</div>
              <div className="pt-1 font-bold text-sm text-gray-900 dark:text-gray-100 ">{(currentGame?.ProfitAmount ?? 0).toFixed(2)}</div>
            </div>
            <div>
              <div className="p-1 text-green-500 ">
                <TrendingUp className="text-sm w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Graph */}
        <div className="flex-1 bg-surface rounded-xl border border-border shadow-sm p-3">
          <div className="text-center text-sm font-semibold text-muted mb-2">
            Performance · Last {currentGame?.HandCount || 0} Hands
          </div>
          <div className="h-[120px]">
            <PLLineChart userGameResult={currentGame?.graphData ?? []} />
          </div>
        </div>

        {/* Actions (P B T S Menu) */}
        <div className="flex h-16 gap-3 justify-around items-center select-none">
          <div
            className='flex justify-center items-center
                  w-14 h-14
                  shadow-lg
                  font-bold text-xl
                  rounded-full
                  border-2 border-gray-400
                  bg-blue-500
                  text-white
                  cursor-pointer
                  transition-all duration-200
                  hover:scale-110 hover:shadow-xl
                  active:scale-95'
            onClick={() => handleAddHand("P")}
          >
            P
          </div>
          <div
            className='flex justify-center items-center
                  w-14 h-14
                  shadow-lg
                  font-bold text-xl
                  rounded-full
                  border-2 border-gray-400
                  bg-red-400
                  text-white
                  cursor-pointer
                  transition-all duration-200
                  hover:scale-110 hover:shadow-xl
                  active:scale-95'
            onClick={() => handleAddHand("B")}
          >
            B
          </div>
          <div
            className='flex justify-center items-center
                  w-14 h-14
                  shadow-lg
                  font-bold text-xl
                  rounded-full
                  border-2 border-gray-400
                  bg-green-500
                  text-white
                  cursor-pointer
                  transition-all duration-200
                  hover:scale-110 hover:shadow-xl
                  active:scale-95'
            onClick={() => handleAddHand("T")}
          >
            T
          </div>
          <div
            className='flex justify-center items-center
                  w-14 h-14
                  shadow-lg
                  font-bold text-xl
                  rounded-full
                  border-2 border-gray-400
                  bg-yellow-500
                  text-white
                  cursor-pointer
                  transition-all duration-200
                  hover:scale-110 hover:shadow-xl
                  active:scale-95'
            onClick={handleSkip}
          >
            S
          </div>
          <div className="relative flex flex-col items-center" ref={menuRef}>
            {/* Actions */}
            <div
              className={`absolute bottom-16 flex flex-col gap-3
              transition-all duration-300
              ${openMenuDial
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-4 scale-75 pointer-events-none"
              }`}
            >
              <div className="flex justify-center items-center
                w-14 h-14 rounded-full
                bg-gray-700 text-white
                shadow-md cursor-pointer  
                transition-all duration-200
                hover:scale-110 active:scale-95"
                onClick={handleRestart}
              >
                <FaTrashAlt className="h-5 w-5"/>
              </div>
              <div className="flex justify-center items-center
                w-14 h-14 rounded-full
                bg-gray-700 text-white
                shadow-md cursor-pointer  
                transition-all duration-200
                hover:scale-110 active:scale-95"
                onClick={handleUndo}
              >
                <FaUndo className="h-5 w-5" />
              </div>
            </div>
            <div
              onClick={() => setOpenMenuDial(!openMenuDial)}
              className='flex justify-center items-center
                w-14 h-14 shadow-lg font-bold text-xl
                rounded-full border-2 border-gray-400
                bg-gray-500 text-white cursor-pointer
                transition-all duration-200
                hover:scale-110 hover:shadow-xl
                active:scale-95'
            >
              {openMenuDial ? <IoClose size={24} /> : <BsGrid3X3GapFill />}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default GameArea1Page