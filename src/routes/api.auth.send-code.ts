import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/auth/send-code")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json();
        return Response.json({ ok: true, received: !!body.email });
      },
    },
  },
});
