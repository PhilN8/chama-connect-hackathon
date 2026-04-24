import { nextMiddleware } from "better-auth/next-js";

export const middleware = nextMiddleware;

export const config = {
  matcher: ["/dashboard/:path*", "/onboard-chama/:path*"],
};
