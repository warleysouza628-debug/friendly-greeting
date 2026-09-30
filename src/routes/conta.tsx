import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ClipboardList, LogOut, MapPin, UserRound, Zap } from "lucide-react";
import { getSession, logoutUser, type NexoUser } from "../lib/auth";

export const Route = createFileRoute("/conta")({ component: Account });

function Account() {
  const navigate = useNavigate(); const [user, setUser] = useState<NexoUser | null>(null);
  useEffect(() => { const session = getSession(); if (!session) navigate({ to: "/login" }); else setUser(session); }, [navigate]);
  if (!user) return null;
  const logout = () => { logoutUser(); navigate({ to: "/" }); };
  return <div className="min-h-screen bg-[#f6f7f9] text-slate-950">
    <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"><Link to="/" className="flex items-center gap-2.5"><span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-950 text-white"><Zap size={19} fill="currentColor" /></span><span className="text-xl font-black">NEXO<span className="text-blue-600">TECH</span></span></Link><Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-950"><ArrowLeft size={16} /> Voltar à loja</Link></div></header>
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8"><p className="text-xs font-black uppercase tracking-[.2em] text-blue-600">Minha conta</p><h1 className="mt-2 text-4xl font-black">Olá, {user.name.split(" ")[0]}.</h1><p className="mt-2 text-slate-500">Gerencie seus dados e acompanhe sua experiência na NexoTech.</p>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100"><UserRound size={20} /></span><div><h2 className="font-black">Dados da conta</h2><p className="text-xs text-slate-500">Informações cadastradas</p></div></div><div className="mt-6 space-y-3 text-sm"><div><p className="text-xs font-bold text-slate-400">Nome</p><p className="font-semibold">{user.name}</p></div><div><p className="text-xs font-bold text-slate-400">E-mail</p><p className="font-semibold">{user.email}</p></div></div></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-600"><ClipboardList size={20} /></span><div><h2 className="font-black">Meus pedidos</h2><p className="text-xs text-slate-500">Acompanhe suas compras</p></div></div><Link to="/pedidos" className="mt-6 inline-flex rounded-xl bg-slate-950 px-4 py-3 text-sm font-black text-white hover:bg-blue-600">Ver meus pedidos</Link></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 md:col-span-2"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100"><MapPin size={20} /></span><div><h2 className="font-black">Endereços</h2><p className="text-xs text-slate-500">Os endereços podem ser salvos junto ao checkout.</p></div></div></div>
      </div>
      <button onClick={logout} className="mt-6 inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-black text-red-600 hover:bg-red-50"><LogOut size={17} /> Sair da conta</button>
    </main>
  </div>;
}
