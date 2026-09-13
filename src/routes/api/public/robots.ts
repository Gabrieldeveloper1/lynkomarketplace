import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/robots")({
  server: {
    handlers: {
      GET: async () =>
        new Response(
          "User-agent: *\nAllow: /\nDisallow: /dashboard\nDisallow: /auth\nDisallow: /admin\nDisallow: /mensagens\nDisallow: /api/\nSitemap: https://www.lynkomarketplace.online/sitemap.xml\n",
          {
            headers: {
              "Content-Type": "text/plain; charset=utf-8",
              "Cache-Control": "public, max-age=3600",
            },
          },
        ),
    },
  },
});
