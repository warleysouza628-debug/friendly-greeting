import { createFileRoute } from "@tanstack/react-router";

const MODEL = "wan-video/wan-2.6-t2v";
const REPLICATE_URL = "https://api.replicate.com/v1/models/wan-video/wan-2.6-t2v/predictions";

export const Route = createFileRoute("/api/generate-video")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const token = process.env.REPLICATE_API_TOKEN;
        if (!token) {
          return Response.json(
            { error: "REPLICATE_API_TOKEN não configurado no servidor." },
            { status: 503 },
          );
        }

        try {
          const body = await request.json();
          const prompt = String(body?.prompt ?? "").trim();
          const duration = Math.min(15, Math.max(5, Number(body?.duration ?? 8)));
          const aspect = String(body?.aspect ?? "9:16");
          const audio = Boolean(body?.audio ?? true);

          if (!prompt) {
            return Response.json({ error: "Digite um prompt antes de gerar." }, { status: 400 });
          }

          const size = aspect === "16:9" ? "1280*720" : aspect === "1:1" ? "720*720" : "720*1280";
          const input = {
            prompt,
            duration,
            size,
            multi_shots: true,
            enable_prompt_expansion: true,
            negative_prompt:
              "deformed characters, extra limbs, flickering, morphing, plastic skin, robotic movement, inconsistent character identity, text, watermark",
            ...(audio ? {} : {}),
          };

          const response = await fetch(REPLICATE_URL, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Prefer: "wait=60",
            },
            body: JSON.stringify({ input }),
          });

          const data = await response.json();
          if (!response.ok) {
            return Response.json(
              { error: data?.detail || data?.error || "A API de vídeo recusou a geração." },
              { status: response.status },
            );
          }

          return Response.json({
            id: data.id,
            status: data.status,
            videoUrl: typeof data.output === "string" ? data.output : null,
            model: MODEL,
            duration,
            aspect,
          });
        } catch (error) {
          return Response.json(
            { error: error instanceof Error ? error.message : "Erro ao iniciar a geração." },
            { status: 500 },
          );
        }
      },
    },
  },
});
