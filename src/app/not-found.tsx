"use client";

import Link from "next/link";

export default function NotFound() {
   return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-center bg-background">
         <h1 className="text-6xl font-extrabold text-gray-900 dark:text-white">
            404
         </h1>

         <p className="text-lg text-gray-600 dark:text-gray-400">
            Sorry, the page you’re looking for doesn’t exist.
         </p>

         <Link
            href="/"
            className="mt-4 rounded-md bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
         >
            Go back home
         </Link>
      </div>
   );
}
