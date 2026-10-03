import { createFileRoute } from "@tanstack/react-router";

const SITE_URL = "https://www.lynkomarketplace.online";

function xmlEscape(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export const Route = createFileRoute("/api/public/sitemap")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const [{ data: products }, { data: sellers }] = await Promise.all([
          supabaseAdmin
            .from("products")
            .select("slug, updated_at")
            .eq("status", "active")
            .limit(5000),
          supabaseAdmin
            .from("profiles")
            .select("username, updated_at")
            .eq("banned", false)
            .limit(5000),
        ]);
        const staticUrls = [
          "/",
          "/produtos",
          "/vendedores",
          "/protecao",
          "/status",
          "/p/termos",
          "/p/privacidade",
          "/p/reembolsos",
          "/p/taxas",
        ];
        const urls = [
          ...staticUrls.map(
            (path) =>
              `<url><loc>${SITE_URL}${path}</loc><changefreq>daily</changefreq><priority>${path === "/" ? "1.0" : "0.8"}</priority></url>`,
          ),
          ...(products ?? []).map(
            (product) =>
              `<url><loc>${SITE_URL}/produto/${xmlEscape(product.slug)}</loc><lastmod>${new Date(product.updated_at).toISOString()}</lastmod><changefreq>daily</changefreq><priority>0.8</priority></url>`,
          ),
          ...(sellers ?? []).map(
            (seller) =>
              `<url><loc>${SITE_URL}/vendedor/${xmlEscape(seller.username)}</loc><lastmod>${new Date(seller.updated_at).toISOString()}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`,
          ),
        ];
        return new Response(
          `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}</urlset>`,
          {
            headers: {
              "Content-Type": "application/xml; charset=utf-8",
              "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
            },
          },
        );
      },
    },
  },
});
