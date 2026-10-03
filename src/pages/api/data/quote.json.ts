export const prerender = false;

import { getRandomQuote } from "$lib/quotes";
import type { APIRoute } from "astro";

export const GET: APIRoute = () => {
  return new Response(
    JSON.stringify({
      quote: getRandomQuote(),
    }),
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    },
  );
};
