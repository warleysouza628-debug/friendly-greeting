import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, LockKeyhole, Mail, UserRound, Zap, ShieldCheck } from "lucide-react";
import { beginRegistration, getSession, isUsernameAvailable, loginUser, resendRegistrationCode, suggestUsername, verifyRegistration } from "../lib/auth";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [step, setStep] = useState<"form" | "code">("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [suggestion, setSuggestion] = useState("");

  useEffect(() => { if (getSession()) navigate({ to: "/conta" }); }, [navigate]);

  const chooseSuggestion = (value: string) => {
    setName(value);
    setSuggestion("");
    setMessage("");
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");
    setSuccess(false);
    setSuggestion("");

    if (mode === "login") {
      const result = loginUser(email, password);
      if (!result.ok) { setMessage(result.message); return; }
      setSuccess(true);
      window.setTimeout(() => navigate({ to: "/conta" }), 400);
      return;
    }

    if (step === "code") {
      const result = verifyRegistration(code);
      if (!result.ok) { setMessage(result.message); return; }
      setSuccess(true);
      window.setTimeout(() => navigate({ to: "/conta" }), 400);
      return;
    }

    if (!isUsernameAvailable(name)) {
      const suggested = suggestUsername(name);
      setSuggestion(suggested);
      setMessage(`O nome "${name.trim()}" está indisponível.`);
      return;
    }

    const result = beginRegistration(name, email, password);
    if (!result.ok) {
      setMessage(result.message);
      if ("suggestion" in result && result.suggestion) setSuggestion(result.suggestion);
      return;
    }

    fetch("/api/auth/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: result.pending.email, code: result.pending.code, name: result.pending.name }),
    })
      .then(async response => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data.ok) throw new Error(data.message || "Não foi possível enviar o código.");
        setStep("code");
        setMessage("");
      })
      .catch(error => setMessage(error.message));
  };

  const resend = () => {
    const result = resendRegistrationCode();
    if (!result.ok) { setMessage(result.message); return; }
    fetch("/api/auth/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: result.pending.email, code: result.pending.code, name: result.pending.name }),
    })
      .then(async response => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data.ok) throw new Error(data.message || "Não foi possível enviar o código.");
        setMessage("Um novo código foi enviado para seu e-mail.");
      })
      .catch(error => setMessage(error.message));
  };

  return <div className="min-h-screen bg-[#f6f7f9] text-slate-950">
    <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"><Link to="/" className="flex items-center gap-2.5"><span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-950 text-white"><Zap size={19} fill="currentColor" /></span><span className="text-xl font-black">NEXO<span className="text-blue-600">TECH</span></span></Link><Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-950"><ArrowLeft size={16} /> Voltar à loja</Link></div></header>
    <main className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-12 px-4 py-10 lg:grid-cols-2 lg:px-8">
      <div className="hidden lg:block"><p className="text-xs font-black uppercase tracking-[.2em] text-blue-600">Minha conta</p><h1 className="mt-3 max-w-xl text-5xl font-black leading-tight">Tudo da sua compra em um só lugar.</h1><p className="mt-5 max-w-lg leading-7 text-slate-500">Acompanhe seus pedidos, mantenha seus dados organizados e agilize suas próximas compras na NexoTech.</p><div className="mt-8 space-y-4">{["Acompanhe seus pedidos","Salve seus dados de entrega","Tenha uma experiência de compra mais rápida"].map(item => <div key={item} className="flex items-center gap-3 text-sm font-bold"><span className="grid h-8 w-8 place-items-center rounded-full bg-blue-50 text-blue-600"><CheckCircle2 size={17} /></span>{item}</div>)}</div></div>
      <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8">
        <div className="mb-7"><p className="text-xs font-black uppercase tracking-[.2em] text-blue-600">NexoTech</p><h2 className="mt-2 text-3xl font-black">{step === "code" ? "Confirmar e-mail" : mode === "login" ? "Entrar na sua conta" : "Criar sua conta"}</h2><p className="mt-2 text-sm text-slate-500">{step === "code" ? `Digite o código de 6 dígitos enviado para ${email}.` : mode === "login" ? "Entre para acessar seus pedidos e dados." : "Cadastre-se gratuitamente e confirme seu e-mail para proteger sua conta."}</p></div>
        {step === "form" && <div className="mb-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1"><button onClick={() => { setMode("login"); setMessage(""); setSuggestion(""); }} className={mode === "login" ? "rounded-lg bg-white py-2.5 text-sm font-black shadow-sm" : "rounded-lg py-2.5 text-sm font-black text-slate-500"}>Entrar</button><button onClick={() => { setMode("register"); setMessage(""); setSuggestion(""); }} className={mode === "register" ? "rounded-lg bg-white py-2.5 text-sm font-black shadow-sm" : "rounded-lg py-2.5 text-sm font-black text-slate-500"}>Criar conta</button></div>}
        {step === "code" ? <form onSubmit={submit} className="space-y-4">
          <label className="block"><span className="mb-1.5 block text-xs font-bold text-slate-600">Código de confirmação</span><div className="flex items-center rounded-xl border border-slate-200 px-3"><ShieldCheck size={17} className="text-slate-400" /><input required inputMode="numeric" maxLength={6} value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ""))} className="w-full px-3 py-3 text-center text-lg font-black tracking-[.35em] outline-none" placeholder="000000" /></div></label>
          
          {message && <p className="rounded-xl bg-red-50 px-3 py-2.5 text-xs font-bold text-red-700">{message}</p>}
          {success && <p className="rounded-xl bg-emerald-50 px-3 py-2.5 text-xs font-bold text-emerald-700">Conta confirmada. Redirecionando...</p>}
          <button type="submit" className="w-full rounded-xl bg-slate-950 py-3.5 text-sm font-black text-white transition hover:bg-blue-600">Confirmar e criar conta</button>
          <button type="button" onClick={resend} className="w-full text-xs font-bold text-blue-600 hover:underline">Enviar novo código</button>
          <button type="button" onClick={() => { setStep("form"); setCode(""); setMessage(""); }} className="w-full text-xs font-bold text-slate-500 hover:underline">Voltar e corrigir dados</button>
        </form> : <form onSubmit={submit} className="space-y-4">
          {mode === "register" && <label className="block"><span className="mb-1.5 block text-xs font-bold text-slate-600">Nome de usuário</span><div className={`flex items-center rounded-xl border px-3 ${message && suggestion ? "border-red-300" : "border-slate-200"}`}><UserRound size={17} className="text-slate-400" /><input required value={name} onChange={e => { setName(e.target.value); setMessage(""); setSuggestion(""); }} className="w-full px-3 py-3 text-sm outline-none" placeholder="Ex.: blessed" /></div></label>}
          {mode === "register" && suggestion && <div className="rounded-xl border border-blue-100 bg-blue-50 px-3 py-3"><p className="text-xs font-bold text-blue-800">Esse nome já está em uso. Sugestão automática:</p><button type="button" onClick={() => chooseSuggestion(suggestion)} className="mt-1 text-sm font-black text-blue-700 underline">{suggestion}</button></div>}
          <label className="block"><span className="mb-1.5 block text-xs font-bold text-slate-600">E-mail</span><div className="flex items-center rounded-xl border border-slate-200 px-3"><Mail size={17} className="text-slate-400" /><input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-3 text-sm outline-none" placeholder="voce@email.com" /></div></label>
          <label className="block"><span className="mb-1.5 block text-xs font-bold text-slate-600">Senha</span><div className="flex items-center rounded-xl border border-slate-200 px-3"><LockKeyhole size={17} className="text-slate-400" /><input required minLength={6} type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-3 text-sm outline-none" placeholder="Mínimo de 6 caracteres" /></div></label>
          {mode === "login" && <button type="button" onClick={() => setMessage("A recuperação de senha será conectada ao e-mail quando o backend de autenticação for configurado.")} className="text-xs font-bold text-blue-600 hover:underline">Esqueci minha senha</button>}
          {message && <p className="rounded-xl bg-red-50 px-3 py-2.5 text-xs font-bold text-red-700">{message}</p>}
          {success && <p className="rounded-xl bg-emerald-50 px-3 py-2.5 text-xs font-bold text-emerald-700">Conta autenticada. Redirecionando...</p>}
          <button type="submit" className="w-full rounded-xl bg-slate-950 py-3.5 text-sm font-black text-white transition hover:bg-blue-600">{mode === "login" ? "Entrar" : "Continuar e confirmar e-mail"}</button>
        </form>}
        <p className="mt-6 text-center text-[11px] leading-5 text-slate-400">A confirmação de e-mail protege sua conta. O código é enviado para o endereço informado e expira em 10 minutos.</p>
      </div>
    </main>
  </div>;
}
