import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, ShoppingBag, UserRound, Menu, X, Zap } from "lucide-react";

export function StoreHeader({ cartCount = 0 }: { cartCount?: number }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="bg-slate-950 px-4 py-2 text-center text-xs font-medium text-white">
        Frete grátis acima de R$ 199 <span className="mx-2 text-slate-500">•</span> Pagamento seguro <span className="mx-2 text-slate-500">•</span> 7 dias para troca
      </div>
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-950 text-white shadow-lg shadow-slate-900/10"><Zap size={19} fill="currentColor" /></span>
            <span className="text-xl font-black tracking-tight text-slate-950">NEXO<span className="text-blue-600">TECH</span></span>
          </Link>
          <nav className="hidden items-center gap-7 lg:flex">
            <a href="#ofertas" className="text-sm font-semibold text-slate-600 hover:text-slate-950">Ofertas</a>
            <a href="#categorias" className="text-sm font-semibold text-slate-600 hover:text-slate-950">Categorias</a>
            <a href="#mais-vendidos" className="text-sm font-semibold text-slate-600 hover:text-slate-950">Mais vendidos</a>
            <a href="#beneficios" className="text-sm font-semibold text-slate-600 hover:text-slate-950">Por que comprar</a>
          </nav>
          <div className="ml-auto hidden min-w-48 flex-1 max-w-sm items-center rounded-xl border border-slate-200 bg-slate-50 px-3 md:flex">
            <Search size={18} className="text-slate-400" />
            <input aria-label="Buscar produtos" className="w-full bg-transparent px-2 py-2.5 text-sm outline-none placeholder:text-slate-400" placeholder="Buscar tecnologia..." />
          </div>
          <button aria-label="Minha conta" className="hidden rounded-xl p-2.5 text-slate-600 hover:bg-slate-100 md:block"><UserRound size={21} /></button>
          <button aria-label="Carrinho" className="relative rounded-xl bg-slate-950 p-2.5 text-white shadow-lg shadow-slate-900/10">
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-blue-600 px-1 text-[10px] font-bold">{cartCount}</span>}
          </button>
          <button aria-label="Abrir menu" className="rounded-xl p-2.5 text-slate-700 hover:bg-slate-100 lg:hidden" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
        </div>
        {open && <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
          <div className="mb-3 flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3"><Search size={18} className="text-slate-400" /><input className="w-full bg-transparent px-2 py-3 text-sm outline-none" placeholder="Buscar tecnologia..." /></div>
          <div className="grid gap-1">{["Ofertas","Categorias","Mais vendidos","Por que comprar"].map((item) => <a key={item} href={item === "Ofertas" ? "#ofertas" : item === "Categorias" ? "#categorias" : item === "Mais vendidos" ? "#mais-vendidos" : "#beneficios"} className="rounded-lg px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50" onClick={() => setOpen(false)}>{item}</a>)}</div>
        </div>}
      </header>
    </>
  );
}