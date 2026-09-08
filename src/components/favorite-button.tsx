import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { fetchFavoriteIds, setFavorite } from "@/lib/marketplace";

export function useFavorites() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: ids = [], isLoading } = useQuery({
    queryKey: ["favorites", user?.id],
    queryFn: () => fetchFavoriteIds(user!.id),
    enabled: !!user,
  });
  const toggle = useMutation({
    mutationFn: ({ productId, on }: { productId: string; on: boolean }) =>
      setFavorite(user!.id, productId, on),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["favorites", user?.id] });
    },
    onError: () => toast.error("😕 Não foi possível atualizar os favoritos."),
  });
  return { ids, isLoading, toggle, user };
}

export function FavoriteButton({
  productId,
  variant = "icon",
  className,
}: {
  productId: string;
  variant?: "icon" | "full";
  className?: string;
}) {
  const navigate = useNavigate();
  const { ids, toggle, user } = useFavorites();
  const active = ids.includes(productId);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.info("🔐 Entre na sua conta para guardar favoritos.");
      void navigate({ to: "/auth" });
      return;
    }
    toggle.mutate(
      { productId, on: !active },
      {
        onSuccess: () =>
          toast.success(active ? "💔 Removido dos favoritos." : "❤️ Guardado nos favoritos!"),
      },
    );
  };

  if (variant === "full") {
    return (
      <Button
        type="button"
        variant="outline"
        onClick={onClick}
        disabled={toggle.isPending}
        className={cn("gap-2", active && "border-primary/60 text-primary", className)}
      >
        <Heart className={cn("h-4 w-4 transition", active && "fill-current scale-110")} />
        {active ? "Nos favoritos" : "Favoritar"}
      </Button>
    );
  }

  return (
    <button
      type="button"
      aria-label={active ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      onClick={onClick}
      disabled={toggle.isPending}
      className={cn(
        "grid h-9 w-9 place-items-center rounded-full border border-border bg-background/80 backdrop-blur transition hover:scale-110 hover:border-primary/60",
        active && "border-primary/60 text-primary",
        className,
      )}
    >
      <Heart className={cn("h-4 w-4 transition", active && "fill-current")} />
    </button>
  );
}
