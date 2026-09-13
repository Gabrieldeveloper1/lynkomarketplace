import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/didit-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { verifyDiditSignature, applyDiditDecision } = await import("@/lib/didit.server");
        const raw = await request.text();
        const signature =
          request.headers.get("x-signature-v2") ?? request.headers.get("x-signature");
        const timestamp = request.headers.get("x-timestamp");

        if (!verifyDiditSignature(raw, signature, timestamp)) {
          return new Response("Invalid signature", { status: 401 });
        }

        try {
          const body = JSON.parse(raw) as {
            session_id?: string;
            status?: string;
            event_id?: string;
            decision?: unknown;
          };
          if (body.session_id && body.status) {
            await applyDiditDecision({
              session_id: body.session_id,
              status: body.status,
              decision: body.decision ?? body,
              ...(body.event_id ? { event_id: body.event_id } : {}),
            });
          }
        } catch (error) {
          console.error("[didit-webhook]", error);
        }
        return new Response("ok", { status: 200 });
      },
      GET: async () => new Response("ok"),
    },
  },
});
