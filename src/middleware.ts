import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  RSS_SOURCES_NEWS,
  RSS_SOURCES_LASTEST_NEWS,
  RSS_SOURCES_WOLD,
  RSS_SOURCES_BUSINESS,
  RSS_SOURCES_EDUCATION,
  RSS_SOURCES_ENTERTAINMENT,
  RSS_SOURCES_LIFE,
  RSS_SOURCES_SCIENCE,
  RSS_SOURCES_TOURSM,
  RSS_SOURCES_confide,
  RSS_SOURCES_Sport,
} from "./service/host";
import { handleRSS } from "./middleware/rssHandler";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  if (pathname === "/api/rss/latest") {
    return handleRSS(RSS_SOURCES_LASTEST_NEWS);
  } else if (pathname === "/api/rss/news") {
    return handleRSS(RSS_SOURCES_NEWS);
  } else if (pathname === "/api/rss/world") {
    return handleRSS(RSS_SOURCES_WOLD);
  } else if (pathname === "/api/rss/business") {
    return handleRSS(RSS_SOURCES_BUSINESS);
  } else if (pathname === "/api/rss/entertainment") {
    return handleRSS(RSS_SOURCES_ENTERTAINMENT);
  } else if (pathname === "/api/rss/toursm") {
    return handleRSS(RSS_SOURCES_TOURSM);
  } else if (pathname === "/api/rss/life") {
    return handleRSS(RSS_SOURCES_LIFE);
  } else if (pathname === "/api/rss/science") {
    return handleRSS(RSS_SOURCES_SCIENCE);
  } else if (pathname === "/api/rss/education") {
    return handleRSS(RSS_SOURCES_EDUCATION);
  } else if (pathname === "/api/rss/confide") {
    return handleRSS(RSS_SOURCES_confide);
  } else if (pathname === "/api/rss/sport") {
    return handleRSS(RSS_SOURCES_Sport);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/rss/:path*","/api/chat/:path*","/api/chat"],
};
