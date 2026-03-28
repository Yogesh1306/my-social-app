// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

// 1) Routes that should be PUBLIC (accessible signed in or out)
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/api/webhook/clerk',
]);

// 2) Routes that Clerk should COMPLETELY IGNORE (no auth, no cookies, etc.)
const isIgnoredRoute = createRouteMatcher([
  '/api/webhook/clerk'
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // Ignore routes completely
  if (isIgnoredRoute(req)) {
    return;
  }

  // Allow public routes
  if (isPublicRoute(req)) {
    return;
  }

  // Everything else is protected
  await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};