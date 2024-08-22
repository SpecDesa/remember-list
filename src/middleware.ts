import {
  ClerkMiddlewareAuth,
    clerkMiddleware,
    createRouteMatcher,
  } from '@clerk/nextjs/server';
import { checkViewListPermissionForClerk } from './server/db/queries';
import { NextURL } from 'next/dist/server/web/next-url';
import { NextResponse } from 'next/server';

  const isProtectedRoute = createRouteMatcher([
    '/api/lists(.*)',
    '/liste(.*)',
    '/(.*)'
  ]);
  
  export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) {
      // console.log("Lists in middleware", lists)
      auth().protect();

      // console.log("ha?", req.nextUrl)
      if( !(await allowedListView(req.nextUrl, auth))){
        console.log("Here?")
        return NextResponse.redirect(new URL(req.nextUrl.origin), { status: 303 });
      }
      // const lists = await checkViewListPermissionForClerk(auth);

    }
  });
  
  const allowedListView = async (url: NextURL, auth: ClerkMiddlewareAuth) => {
    const parsedUrl = new URL(url.toString());
    const path = url.pathname;
    
    // Need to just allow paths that does not include liste
    if(path !== '/liste'){return true};
    // Logic for handling list view.
    if(path === '/liste'){
      const lists = await checkViewListPermissionForClerk(auth);
      const queryParams = parsedUrl.searchParams;
      const listIdParam = Number(queryParams.get('listId'));

      if(lists?.some((dbList => dbList.listsId === listIdParam))){
        return true;
      }
      else {
        console.error("No listid matched allowed listIds")
        return false;
      }
    }


  }

  export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
  };