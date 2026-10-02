import { createFileRoute } from "@tanstack/react-router";

const MODEL = "wan-video/wan-2.6-t2v";
const MODEL_URL = "https://api.replicate.com/v1/models/wan-video/wan-2.6-t2v/predictions";
const PREDICTIONS_URL = "https://api.replicate.com/v1/predictions";
const MERGE_VERSION = "lucataco/video-merge:14273448a57117b5d424410e2e79700ecde6cc7d60bf522a769b9c7cf989eba7";

const json = (data: unknown, status = 200) => Response.json(data, { status });

function scenePrompt(prompt: string, index: number) {
  const acts = [
    "ACT 1/4 — HOOK E APRESENTAÇÃO: estabeleça personagens, cenário e conflito imediatamente. Comece com uma imagem visual muito forte.",
    "ACT 2/4 — DESENVOLVIMENTO: continue a mesma história, personagens e estilo. Aumente a tensão e avance a ação sem reiniciar a narrativa.",
    "ACT 3/4 — CLÍMAX: leve o conflito ao ponto mais intenso e emocional. Preserve rigorosamente identidade, cenário e direção visual.",
    "ACT 4/4 — RESOLUÇÃO E REVELAÇÃO: conclua a história com uma reviravolta ou payoff emocional memorável e um último plano forte.",
  ];
  return `${acts[index]}\n\nHISTÓRIA ORIGINAL:\n${prompt}\n\nEsta é uma sequência de um vídeo vertical de 60 segundos. Não recomece a história; produza somente este trecho de aproximadamente 15 segundos. Mantenha personagens, cores, roupas, proporções, iluminação, ambiente e estilo consistentes. Movimento natural, física convincente, câmera cinematográfica e aparência de produção profissional, sem aparência de vídeo gerado por IA.`;
}

async function replicate(token: string, url: string, init: RequestInit) {
  return fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
}

export const Route = createFileRoute("/api/generate-video")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const token = process.env.REPLICATE_API_TOKEN;
        if (!token) return json({ error: "REPLICATE_API_TOKEN não configurado no servidor." }, 503);

        try {
          const body = await request.json();
          const prompt = String(body?.prompt ?? "").trim();
          const requestedDuration = Number(body?.duration ?? 8);
          const aspect = String(body?.aspect ?? "9:16");

          if (!prompt) return json({ error: "Digite um prompt antes de gerar." }, 400);

          const size = aspect === "16:9" ? "1280*720" : aspect === "1:1" ? "720*720" : "720*1280";

          // O modelo gera takes curtos. O modo de 1 minuto cria 4 takes de 15s
          // e depois os concatena em um único MP4.
          if (requestedDuration >= 60) {
            const requests = Array.from({ length: 4 }, (_, index) =>
              replicate(token, MODEL_URL, {
                method: "POST",
                body: JSON.stringify({
                  input: {
                    prompt: scenePrompt(prompt, index),
                    duration: 15,
                    size,
                    multi_shots: true,
                    enable_prompt_expansion: true,
                    negative_prompt:
                      "deformed characters, extra limbs, flickering, morphing, plastic skin, robotic movement, inconsistent character identity, changing clothes, changing face, text, watermark",
                  },
                }),
              }),
            );

            const responses = await Promise.all(requests);
            const results = await Promise.all(responses.map((r) => r.json()));
            const failed = results.find((item) => item?.error || item?.detail);
            if (failed) return json({ error: failed.detail || failed.error || "Falha ao criar uma das cenas." }, 502);

            return json({
              mode: "long",
              duration: 60,
              sceneIds: results.map((item) => item.id),
              statuses: results.map((item) => item.status),
              message: "As 4 cenas de 15s foram iniciadas.",
            }, 202);
          }

          const duration = Math.min(15, Math.max(5, requestedDuration));
          const response = await replicate(token, MODEL_URL, {
            method: "POST",
            headers: { Prefer: "wait=60" },
            body: JSON.stringify({
              input: {
                prompt,
                duration,
                size,
                multi_shots: true,
                enable_prompt_expansion: true,
                negative_prompt:
                  "deformed characters, extra limbs, flickering, morphing, plastic skin, robotic movement, inconsistent character identity, text, watermark",
              },
            }),
          });

          const data = await response.json();
          if (!response.ok) return json({ error: data?.detail || data?.error || "A API recusou a geração." }, response.status);

          return json({
            mode: "single",
            id: data.id,
            status: data.status,
            videoUrl: typeof data.output === "string" ? data.output : null,
            model: MODEL,
            duration,
            aspect,
          });
        } catch (error) {
          return json({ error: error instanceof Error ? error.message : "Erro ao iniciar a geração." }, 500);
        }
      },

      GET: async ({ request }) => {
        const token = process.env.REPLICATE_API_TOKEN;
        if (!token) return json({ error: "REPLICATE_API_TOKEN não configurado no servidor." }, 503);

        try {
          const url = new URL(request.url);
          const ids = (url.searchParams.get("ids") || "").split(",").filter(Boolean);
          const mergeId = url.searchParams.get("mergeId") || "";

          if (!ids.length) return json({ error: "Nenhuma geração informada." }, 400);

          const predictions = await Promise.all(ids.map(async (id) => {
            const r = await replicate(token, `https://api.replicate.com/v1/predictions/${encodeURIComponent(id)}`, { method: "GET" });
            return r.json();
          }));

          const failed = predictions.find((p) => p.status === "failed" || p.status === "canceled");
          if (failed) return json({ status: "failed", error: failed.error || "Uma das cenas falhou." }, 500);

          if (predictions.some((p) => p.status !== "succeeded")) {
            return json({
              status: "processing",
              progress: Math.round((predictions.filter((p) => p.status === "succeeded").length / predictions.length) * 80),
              scenes: predictions.map((p) => ({ id: p.id, status: p.status })),
            });
          }

          const videos = predictions.map((p) => typeof p.output === "string" ? p.output : p.output?.[0]).filter(Boolean);
          if (videos.length !== 4) return json({ status: "processing", progress: 80 });

          if (!mergeId) {
            const mergeResponse = await replicate(token, PREDICTIONS_URL, {
              method: "POST",
              headers: { Prefer: "wait=60" },
              body: JSON.stringify({
                version: MERGE_VERSION,
                input: { video_files: videos, keep_audio: true },
              }),
            });
            const merge = await mergeResponse.json();
            if (!mergeResponse.ok) return json({ status: "failed", error: merge?.detail || merge?.error || "Falha ao montar o vídeo final." }, 502);
            return json({ status: "merging", progress: 90, mergeId: merge.id });
          }

          const mergeResponse = await replicate(token, `https://api.replicate.com/v1/predictions/${encodeURIComponent(mergeId)}`, { method: "GET" });
          const merge = await mergeResponse.json();
          if (merge.status === "failed" || merge.status === "canceled") {
            return json({ status: "failed", error: merge.error || "Falha na montagem do vídeo final." }, 500);
          }
          if (merge.status !== "succeeded") return json({ status: "merging", progress: 90, mergeId });

          const videoUrl = typeof merge.output === "string" ? merge.output : merge.output?.[0];
          return json({ status: "succeeded", progress: 100, videoUrl, duration: 60 });
        } catch (error) {
          return json({ error: error instanceof Error ? error.message : "Erro ao consultar a geração." }, 500);
        }
      },
    },
  },
});
