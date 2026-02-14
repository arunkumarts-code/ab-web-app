import { useState, useEffect } from 'react';

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export function useBreakpoint(): Breakpoint {
   const [breakpoint, setBreakpoint] = useState<Breakpoint>('lg');

   useEffect(() => {
      const updateBreakpoint = () => {
         const width = window.innerWidth;

         if (width < 640) {
            setBreakpoint('xs');
         } else if (width < 768) {
            setBreakpoint('sm');
         } else if (width < 1024) {
            setBreakpoint('md');
         } else if (width < 1280) {
            setBreakpoint('lg');
         } else if (width < 1536) {
            setBreakpoint('xl');
         } else {
            setBreakpoint('2xl');
         }
      };

      updateBreakpoint();
      window.addEventListener('resize', updateBreakpoint);

      return () => window.removeEventListener('resize', updateBreakpoint);
   }, []);

   return breakpoint;
}

export function useIsDesktop(breakpoint: Breakpoint = 'lg'): boolean {
   const currentBreakpoint = useBreakpoint();

   const breakpointOrder: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
   const targetIndex = breakpointOrder.indexOf(breakpoint);
   const currentIndex = breakpointOrder.indexOf(currentBreakpoint);

   return currentIndex >= targetIndex;
}