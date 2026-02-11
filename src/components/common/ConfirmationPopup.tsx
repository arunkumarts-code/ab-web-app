type ConfirmationPopupProps = {
   open: boolean;
   title?: string;
   description?: React.ReactNode;
   warning?: string;
   onConfirm: () => void;
   onCancel: () => void;
   confirmText?: string;
   cancelText?: string;
};

const ConfirmationPopup = ({
   open,
   title = "Confirmation",
   description,
   warning,
   onConfirm,
   onCancel,
   confirmText = "Yes",
   cancelText = "No",
}: ConfirmationPopupProps) => {
   if (!open) return null;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
         {/* Backdrop */}
         <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            onClick={onCancel}
         />

         {/* Modal */}
         <div className="relative z-50 w-full max-w-md rounded-2xl bg-surface overflow-hidden shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between bg-primary p-4">
               <h3 className="text-lg font-semibold text-white">{title}</h3>
               <button
                  onClick={onCancel}
                  className="text-white text-lg cursor-pointer"
               >
                  ✕
               </button>
            </div>

            {/* Content */}
            <div className="text-sm text-muted-foreground space-y-2 px-4 py-3">
               {description}
               {warning && (
                  <p className="text-red-500 font-medium">{warning}</p>
               )}
            </div>

            {/* Actions */}
            <div className="mt-4 flex justify-end gap-3 px-4 pb-4">
               <button
                  onClick={onCancel}
                  className="px-6 py-2 border border-border text-foreground text-sm font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
               >
                  {cancelText}
               </button>

               <button
                  onClick={onConfirm}
                  className="px-6 py-2 text-white text-sm font-semibold rounded-lg bg-primary/90 transition"
               >
                  {confirmText}
               </button>
            </div>
         </div>
      </div>
   );
};

export default ConfirmationPopup;
