import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Profile = Tables<"profiles">;
export type Product = Tables<"products">;
export type Category = Tables<"categories">;
export type Order = Tables<"orders">;
export type Review = Tables<"reviews">;
export type Message = Tables<"messages">;
export type Conversation = Tables<"conversations">;
export type Report = Tables<"reports">;
export type Withdrawal = Tables<"withdrawals">;

export type ProductWithSeller = Product & { seller: Profile | null };

const PRODUCT_SELECT = "*, seller:profiles!products_seller_id_fkey(*)";

export async function fetchCategories() {
  const { data, error } = await supabase.from("categories").select("*").order("position");
  if (error) throw error;
  return data;
}

export type ProductFilters = {
  q?: string;
  category?: string;
  sort?: "recentes" | "menor" | "maior" | "vendidos";
  auto?: boolean;
  verified?: boolean;
  max?: number;
  sellerId?: string;
  promotedFirst?: boolean;
  limit?: number;
};

export async function fetchProducts(f: ProductFilters = {}) {
  let query = supabase.from("products").select(PRODUCT_SELECT).eq("status", "active");

  if (f.q) query = query.ilike("title", `%${f.q}%`);
  if (f.category && f.category !== "todas") query = query.eq("category_slug", f.category);
  if (f.auto) query = query.eq("auto_delivery", true);
  if (f.sellerId) query = query.eq("seller_id", f.sellerId);
  if (f.max) query = query.lte("price_cents", f.max);

  if (f.promotedFirst) query = query.order("promoted", { ascending: false });
  if (f.sort === "menor") query = query.order("price_cents", { ascending: true });
  else if (f.sort === "maior") query = query.order("price_cents", { ascending: false });
  else if (f.sort === "vendidos") query = query.order("sales_count", { ascending: false });
  else query = query.order("created_at", { ascending: false });

  const { data, error } = await query.limit(f.limit ?? 60);
  if (error) throw error;
  let rows = (data ?? []) as unknown as ProductWithSeller[];
  if (f.verified) rows = rows.filter((p) => p.seller?.verified);
  return rows;
}

export async function fetchProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as ProductWithSeller) ?? null;
}

export async function fetchSellerByUsername(username: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchSellers() {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("verified", { ascending: false })
    .limit(60);
  if (error) throw error;
  return data;
}

export async function fetchSellerReviews(sellerId: string) {
  const { data, error } = await supabase
    .from("reviews")
    .select("*, buyer:profiles!reviews_buyer_id_fkey(username, display_name, avatar_url)")
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return data ?? [];
}

export async function fetchProductReviews(productId: string) {
  const { data, error } = await supabase
    .from("reviews")
    .select("*, buyer:profiles!reviews_buyer_id_fkey(username, display_name, avatar_url)")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchFollowerCount(sellerId: string) {
  const { count, error } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("seller_id", sellerId);
  if (error) throw error;
  return count ?? 0;
}

export function ratingOf(reviews: { positive: boolean }[]) {
  if (!reviews.length) return null;
  const pos = reviews.filter((r) => r.positive).length;
  return Math.round((pos / reviews.length) * 1000) / 10;
}

export async function uploadMedia(userId: string, file: File) {
  const allowedTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
    "image/svg+xml",
    "image/bmp",
    "image/tiff",
  ]);
  if (file.type === "image/gif" || !allowedTypes.has(file.type)) {
    throw new Error(
      "Formato não suportado. Envie PNG, JPG, WEBP, AVIF, SVG, BMP ou TIFF; GIF não é permitido.",
    );
  }
  if (file.size > 50 * 1024 * 1024) {
    throw new Error("A imagem deve ter no máximo 50 MB.");
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const path = `${userId}/${crypto.randomUUID()}-${safeName}`;
  const { error } = await supabase.storage.from("media").upload(path, file, {
    upsert: false,
    contentType: file.type,
    cacheControl: "31536000",
  });
  if (error) throw error;
  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}

export type ProductVariant = Tables<"product_variants">;
export type SitePage = Tables<"site_pages">;
export type OrderEvent = Tables<"order_events">;

export async function fetchVariants(productId: string) {
  const { data, error } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", productId)
    .eq("active", true)
    .order("position")
    .order("price_cents");
  if (error) throw error;
  return data ?? [];
}

export async function fetchAllVariants(productId: string) {
  const { data, error } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", productId)
    .order("position")
    .order("price_cents");
  if (error) throw error;
  return data ?? [];
}

export async function fetchSitePages() {
  const { data, error } = await supabase
    .from("site_pages")
    .select("*")
    .eq("published", true)
    .order("position");
  if (error) throw error;
  return data ?? [];
}

export async function fetchSitePage(slug: string) {
  const { data, error } = await supabase
    .from("site_pages")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchOrder(orderId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select(
      "*, product:products!orders_product_id_fkey(title, slug, images, auto_delivery), seller:profiles!orders_seller_id_fkey(username, display_name, avatar_url, verified)",
    )
    .eq("id", orderId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchOrderEvents(orderId: string) {
  const { data, error } = await supabase
    .from("order_events")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at");
  if (error) throw error;
  return data ?? [];
}

/* ------------------------------ Favoritos ------------------------------ */

export async function fetchFavoriteIds(userId: string) {
  const { data, error } = await supabase
    .from("favorites")
    .select("product_id")
    .eq("user_id", userId);
  if (error) throw error;
  return (data ?? []).map((r) => r.product_id as string);
}

export async function fetchFavoriteProducts(userId: string) {
  const { data, error } = await supabase
    .from("favorites")
    .select(`product:products!favorites_product_id_fkey(${PRODUCT_SELECT})`)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as unknown as { product: ProductWithSeller | null }[])
    .map((r) => r.product)
    .filter(Boolean) as ProductWithSeller[];
}

export async function setFavorite(userId: string, productId: string, on: boolean) {
  if (on) {
    const { error } = await supabase
      .from("favorites")
      .insert({ user_id: userId, product_id: productId } as never);
    if (error && error.code !== "23505") throw error;
  } else {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", productId);
    if (error) throw error;
  }
}

/* ------------------------------ Advertências ------------------------------ */

export async function fetchMyWarnings(userId: string) {
  const { data, error } = await supabase
    .from("warnings")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

/* ------------------------------ Avaliações recentes ------------------------------ */

export async function fetchRecentReviews(limit = 12) {
  const { data, error } = await supabase
    .from("reviews")
    .select(
      "*, buyer:profiles!reviews_buyer_id_fkey(username, display_name, avatar_url), product:products!reviews_product_id_fkey(title, slug, images)",
    )
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}
