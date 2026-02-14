import React from "react";

interface Hand {
   id: number;
   result: "Win" | "Loss";
   bet: number;
}

interface HandHistoryModalProps {
   open: boolean;
   onClose: () => void;
   loading?: boolean;
   handHistory: Hand[];
}

const HandHistoryModal: React.FC<HandHistoryModalProps> = ({
   open,
   onClose,
   loading,
   handHistory,
}) => {

   if (!open) return null;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
         {/* Overlay */}
         <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
         />

         {/* Modal */}
         <div className="relative z-50 w-full max-w-4xl rounded-2xl bg-surface p-6 shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-2">
               <h3 className="text-lg font-semibold">Hands History</h3>
               <button
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground"
               >
                  ✕
               </button>
            </div>

            <div className="overflow-y-auto pr-2 pt-2 flex-1 flex items-center justify-center scrollbar-custom">
               {loading ? (
                  <div className="flex flex-col items-center justify-center py-8">
                     <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin mb-3" />
                     <p className="text-sm text-muted">Loading hand history...</p>
                  </div>
               ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 w-full">
                     {handHistory?.length > 0 ? (
                        handHistory?.map((hand, index) => (
                           <div
                              key={hand.id}
                              className={`p-3 rounded-lg border-2 ${hand.result === "Win"
                                    ? "border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/30"
                                    : "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/30"
                                 }`}
                           >
                              <div className="text-center">
                                 <p className="text-xs font-bold mb-1">
                                    Hand #{index + 1}
                                 </p>

                                 <p
                                    className={`text-sm font-bold mb-2 ${hand.result === "Win"
                                          ? "text-green-600 dark:text-green-400"
                                          : "text-red-600 dark:text-red-400"
                                       }`}
                                 >
                                    {hand.result}
                                 </p>

                                 <p className="text-xs">
                                    ${hand.bet.toFixed(2)}
                                 </p>
                              </div>
                           </div>
                        ))
                     ) : (
                     <div className="col-span-full text-center py-8 text-muted text-sm">
                        No hand history
                     </div>
                     )}
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};

export default HandHistoryModal;
