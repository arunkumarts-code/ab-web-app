export default function GlobalLoader() {
   return (
      <div className="fixed inset-0 z-50 gap-2 flex flex-col items-center justify-center bg-background/10 backdrop-blur-xs">
         <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
         <div className="text-center text-sm font-medium select-none">Loading...</div>
      </div>
   );
}
