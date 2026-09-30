import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, ShoppingBag, UserRound, Menu, X, Zap, ClipboardList } from "lucide-react";

type StoreHeaderProps = {
  cartCount?: number;
  search?: string;
  onSearch?: (value: string) => void;
  onCartClick?: () => void;
};

export function StoreHeader({ cartCount = 0, search = "", onSearch, onCartClick }: StoreHeaderProps) {
  const [open, setOpen] = useState(false);
  const links = [["Ofertas","#ofertas"],["Categorias","#categorias"],["Mais vendidos","#mais-vendidos"],["Por que comprar","#beneficios"]];

  const focusSearch = () => {
    if (window.innerWidth < 768) {
      setOpen(true);
      window.setTimeout(() => document.getElementById("store-search-mobile")?.focus(), 50);
    } else {
      document.getElementById("store-search")?.focus();
    }
  };

  const handleSearch = (value: string) => {
    onSearch?.(value);
    if (value.trim()) document.getElementById("mais-vendidos")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return <>
    <div className="bg-slate-950 px-4 py-2 text-center text-xs font-medium text-white">Frete grátis acima de R$ 199 <span className="mx-2 text-slate-500">•</span> Pagamento seguro <span className="mx-2 text-slate-500">•</span> 7 dias para troca</div>
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-3 px-4 sm:gap-6 sm:px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2.5"><span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-950 text-white shadow-lg"><Zap size={19} fill="currentColor" /></span><span className="text-xl font-black tracking-tight text-slate-950">NEXO<span className="text-blue-600">TECH</span></span></Link>
        <nav className="hidden items-center gap-7 lg:flex">{links.map(([label,href]) => <a key={label} href={href} className="text-sm font-semibold text-slate-600 hover:text-slate-950">{label}</a>)}</nav>
        <div className="ml-auto hidden min-w-48 max-w-sm flex-1 items-center rounded-xl border border-slate-200 bg-slate-50 px-3 md:flex"><Search size={18} className="shrink-0 text-slate-400" /><input id="store-search" value={search} onChange={e => handleSearch(e.target.value)} aria-label="Buscar produtos" className="w-full bg-transparent px-2 py-2.5 text-sm outline-none placeholder:text-slate-400" placeholder="Buscar tecnologia..." /></div>
        <button aria-label="Buscar produtos" onClick={focusSearch} className="rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-blue-600"><Search size={21} /></button>
        <Link to="/pedidos" aria-label="Meus pedidos" className="hidden rounded-xl p-2.5 text-slate-600 hover:bg-slate-100 md:block"><ClipboardList size={21} /></Link>
        <button aria-label="Minha conta" className="hidden rounded-xl p-2.5 text-slate-600 hover:bg-slate-100 md:block"><UserRound size={21} /></button>
        <button aria-label="Carrinho" onClick={onCartClick} className="relative rounded-xl bg-slate-950 p-2.5 text-white shadow-lg shadow-slate-900/10"><ShoppingBag size={20} />{cartCount > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-blue-600 px-1 text-[10px] font-bold">{cartCount}</span>}</button>
        <button aria-label="Abrir menu" className="rounded-xl p-2.5 text-slate-700 hover:bg-slate-100 lg:hidden" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
        <div className="mb-3 flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3"><Search size={18} className="text-slate-400" /><input id="store-search-mobile" value={search} onChange={e => handleSearch(e.target.value)} className="w-full bg-transparent px-2 py-3 text-sm outline-none" placeholder="Buscar tecnologia..." /></div>
        <div className="grid gap-1">
          <Link to="/pedidos" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"><ClipboardList size={17} /> Meus pedidos</Link>
          {links.map(([label,href]) => <a key={label} href={href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">{label}</a>)}
        </div>
      </div>}
    </header>
  </>;
}