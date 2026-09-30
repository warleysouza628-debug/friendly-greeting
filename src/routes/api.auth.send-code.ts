import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/auth/send-code")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const email = String(body.email || "").trim().toLowerCase();
          const code = String(body.code || "");
          const name = String(body.name || "cliente").replace(/[<>&"]/g, "");

          if (!email || !code) {
            return Response.json({ ok: false, message: "E-mail e código são obrigatórios." }, { status: 400 });
          }

          const apiKey = process.env.RESEND_API_KEY;
          if (!apiKey) {
            return Response.json({ ok: false, message: "O envio de e-mail ainda não está configurado no servidor." }, { status: 500 });
          }

          const from = process.env.RESEND_FROM_EMAIL || "NexoTech <onboarding@resend.dev>";
          const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + apiKey,
            },
            body: JSON.stringify({
              from,
              to: [email],
              subject: "Seu código de confirmação — NexoTech",
              html: "<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px;color:#0f172a"><div style="font-size:24px;font-weight:900;margin-bottom:24px">NEXO<span style="color:#2563eb">TECH</span></div><h1 style="font-size:24px;margin:0 0 12px">Confirme seu e-mail</h1><p style="color:#64748b;line-height:1.6">Olá, " + name + ". Use o código abaixo para concluir sua criação de conta:</p><div style="font-size:34px;font-weight:900;letter-spacing:8px;background:#f1f5f9;border-radius:14px;padding:18px;text-align:center;margin:24px 0">" + code + "</div><p style="color:#64748b;font-size:13px">Este código é válido por 10 minutos. Se você não solicitou este cadastro, ignore este e-mail.</p></div>",
            }),
          });

          const data = await response.json().catch(() => ({}));
          if (!response.ok) {
            return Response.json({ ok: false, message: data?.message || "Não foi possível enviar o código." }, { status: response.status });
          }

          return Response.json({ ok: true });
        } catch {
          return Response.json({ ok: false, message: "Erro ao conectar ao serviço de e-mail." }, { status: 500 });
        }
      },
    },
  },
});
