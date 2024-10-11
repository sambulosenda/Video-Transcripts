import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware((auth, req) => {
  const isAuthenticated = auth().userId !== null;
  const url = new URL(req.url);

  // If the user is authenticated and trying to access the root page
  if (isAuthenticated && url.pathname === "/") {
    // Redirect to the dashboard
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Restrict dashboard routes to signed in users
  if (isDashboardRoute(req)) {
    auth().protect();
  }

  // For all other cases, continue with the request
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
