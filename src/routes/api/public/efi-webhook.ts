import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/efi-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { getEfiNotification, EFI_PAID_STATUSES, efiConfigured } = await import("@/lib/efi.server");
        const { fulfillOrder } = await import("@/lib/fulfillment.server");
        if (!efiConfigured()) return new Response("not configured", { status: 200 });

        let token: string | undefined;
        const raw = await request.text();
        try {
          token = (JSON.parse(raw) as { notification?: string }).notification;
        } catch {
          token = new URLSearchParams(raw).get("notification") ?? undefined;
        }
        if (!token) return new Response("ok", { status: 200 });

        try {
          const events = await getEfiNotification(token);
          for (const event of events) {
            const status = event.status?.current ?? "";
            const orderId = event.custom_id;
            if (orderId && EFI_PAID_STATUSES.includes(status)) {
              await fulfillOrder(orderId);
            }
          }
        } catch (error) {
          console.error("[efi-webhook]", error);
        }
        return new Response("ok", { status: 200 });
      },
      GET: async () => new Response("ok"),
    },
  },
});
