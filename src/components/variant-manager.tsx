import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2, Layers, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/format";
import { useAuth } from "@/hooks/use-auth";

/** Gestão de variações de um anúncio (ex.: Netflix 1 dia / 2 dias / 3 dias). */
export function VariantManager({
  productId,
  autoDelivery,
  onChange,
}: {
  productId: string;
  autoDelivery: boolean;
  onChange: () => void;
}) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("0");
  const [keysFor, setKeysFor] = useState<string | null>(null);
  const [keys, setKeys] = useState("");

  const { data: variants = [], refetch } = useQuery({
    queryKey: ["variants", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_variants")
        .select("*")
        .eq("product_id", productId)
        .order("position");
      if (error) throw error;
      return data;
    },
  });

  const add = async () => {
    const cents = Math.round(Number(price.replace(",", ".")) * 100);
    if (!name.trim() || !Number.isFinite(cents) || cents <= 0) {
      return toast.error("Indique nome e preço válidos.");
    }
    const { error } = await supabase.from("product_variants").insert({
      product_id: productId,
      seller_id: user!.id,
      name: name.trim(),
      price_cents: cents,
      stock: autoDelivery ? 0 : Number(stock) || 0,
      position: variants.length,
    });
    if (error) return toast.error(error.message);
    setName("");
    setPrice("");
    setStock("0");
    toast.success("Variação criada.");
    refetch();
    onChange();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("product_variants").delete().eq("id", id);
    if (error) return toast.error(error.message);
    refetch();
    onChange();
  };

  const addKeys = async (variantId: string) => {
    const lines = keys
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (!lines.length) return;
    const { error } = await supabase.from("delivery_items").insert(
      lines.map((content) => ({
        product_id: productId,
        variant_id: variantId,
        seller_id: user!.id,
        content,
      })),
    );
    if (error) return toast.error(error.message);
    const { data: available } = await supabase
      .from("delivery_items")
      .select("id")
      .eq("variant_id", variantId)
      .eq("sold", false);
    await supabase
      .from("product_variants")
      .update({ stock: available?.length ?? lines.length })
      .eq("id", variantId);
    setKeys("");
    setKeysFor(null);
    toast.success(`${lines.length} itens adicionados.`);
    refetch();
    onChange();
  };

  return (
    <div className="mt-4 rounded-xl border border-border bg-background/60 p-4">
      <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <Layers className="h-4 w-4 text-primary" /> Variações do anúncio
      </p>

      <div className="grid gap-2">
        {variants.map((v) => (
          <div key={v.id} className="rounded-lg border border-border bg-card p-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{v.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatPrice(v.price_cents)} · estoque {v.stock}
                </p>
              </div>
              {autoDelivery && (
                <Badge variant="outline" className="gap-1">
                  <Zap className="h-3 w-3 text-primary" /> Auto
                </Badge>
              )}
              {autoDelivery && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setKeysFor(keysFor === v.id ? null : v.id)}
                >
                  Estoque
                </Button>
              )}
              <Button size="sm" variant="ghost" onClick={() => remove(v.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
            {keysFor === v.id && (
              <div className="mt-3 grid gap-2">
                <Label>Um item por linha (chaves, contas, links)</Label>
                <Textarea rows={4} value={keys} onChange={(e) => setKeys(e.target.value)} />
                <Button className="w-fit" size="sm" onClick={() => addKeys(v.id)}>
                  Adicionar ao estoque
                </Button>
              </div>
            )}
          </div>
        ))}
        {!variants.length && (
          <p className="text-xs text-muted-foreground">
            Sem variações o anúncio é vendido com o preço e estoque principais.
          </p>
        )}
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_8rem_7rem_auto]">
        <Input
          placeholder="Ex.: Netflix 1 dia"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input placeholder="Preço 9,90" value={price} onChange={(e) => setPrice(e.target.value)} />
        <Input
          placeholder="Estoque"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          disabled={autoDelivery}
        />
        <Button onClick={add} className="gap-1.5">
          <Plus className="h-4 w-4" /> Adicionar
        </Button>
      </div>
    </div>
  );
}
