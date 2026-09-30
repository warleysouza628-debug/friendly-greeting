import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check, ShieldCheck, Sparkles, Truck, CreditCard, Headphones, SearchX, Timer, Clock3, Flame } from "lucide-react";
import { categories, products, type Product } from "../data/products";
import { StoreHeader } from "../components/StoreHeader";
import { ProductCard } from "../components/ProductCard";
import { CategoryCard } from "../components/CategoryCard";
import { CartDrawer, type CartLine } from "../components/CartDrawer";

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [category, setCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    try { setCart(JSON.parse(localStorage.getItem("nexotech-cart") || "{}")); } catch { setCart({}); }
  }, []);
  useEffect(() => { localStorage.setItem("nexotech-cart", JSON.stringify(cart)); }, [cart]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter(p => {
      const matchesCategory = category === "Todos" || p.category === category;
      const matchesSearch = !term || `${p.name} ${p.category}`.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  const cartItems: CartLine[] = Object.entries(cart).map(([id, quantity]) => {
    const product = products.find(p => p.id === id);
    return product ? { product, quantity } : null;
  }).filter(Boolean) as CartLine[];
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const add = (product: Product) => {
    setCart(v => ({ ...v, [product.id]: (v[product.id] || 0) + 1 }));
    setCartOpen(true);
  };
  const change = (id: string, delta: number) => setCart(v => {
    const next = Math.max(0, (v[id] || 0) + delta);
    if (!next) { const copy = { ...v }; delete copy[id]; return copy; }
    return { ...v, [id]: next };
  });
  const remove = (id: string) => setCart(v => { const copy = { ...v }; delete copy[id]; return copy; });
  const selectCategory = (name: string) => {
    setCategory(name);
    document.getElementById("mais-vendidos")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const ps5Products = products.filter(p => p.category === "PS5 & PlayStation").slice(0, 3);
  const [ps5Slide, setPs5Slide] = useState(0);
  const [ps5Seconds, setPs5Seconds] = useState([23 * 3600, 18 * 3600 + 42 * 60 + 10, 7 * 3600 + 15 * 60 + 30]);

  useEffect(() => {
    if (category !== "PS5 & PlayStation") return;
    const timer = window.setInterval(() => {
      setPs5Seconds(current => current.map((seconds, index) => index === ps5Slide ? Math.max(0, seconds - 1) : seconds));
    }, 1000);
    const slideTimer = window.setInterval(() => setPs5Slide(current => (current + 1) % 3), 2000);
    return () => { window.clearInterval(timer); window.clearInterval(slideTimer); };
  }, [category, ps5Slide]);

  const formatCountdown = (seconds: number) => {
    const safe = Math.max(0, seconds);
    const hours = Math.floor(safe / 3600).toString().padStart(2, "0");
    const minutes = Math.floor((safe % 3600) / 60).toString().padStart(2, "0");
    const secs = (safe % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}:${secs}`;
  };

  return <div className="min-h-screen bg-[#f7f8fa] text-slate-950">
    <StoreHeader cartCount={cartCount} search={search} onSearch={setSearch} onCartClick={() => setCartOpen(true)} />
    <main>
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-blue-600/30 blur-3xl" /><div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-24">
          <div><div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-blue-200"><Sparkles size={14} /> Tecnologia selecionada para você</div>
            <h1 className="max-w-3xl text-4xl font-black leading-[1.02] tracking-tight sm:text-6xl">Tecnologia que acompanha <span className="text-blue-400">seu ritmo.</span></h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">Produtos modernos, preços competitivos e uma experiência de compra simples do começo ao fim.</p>
            <div className="mt-8 flex flex-wrap gap-3"><a href="#mais-vendidos" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-black text-slate-950 hover:bg-blue-50">Ver produtos <ArrowRight size={17} /></a><a href="#ofertas" className="inline-flex items-center rounded-xl border border-white/15 bg-white/5 px-5 py-3.5 text-sm font-bold text-white hover:bg-white/10">Ver ofertas</a></div>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-slate-300"><span className="flex items-center gap-2"><Check size={15} className="text-emerald-400" /> Compra segura</span><span className="flex items-center gap-2"><Check size={15} className="text-emerald-400" /> Envio rastreado</span><span className="flex items-center gap-2"><Check size={15} className="text-emerald-400" /> Suporte humanizado</span></div>
          </div>
          <div className="relative mx-auto w-full max-w-xl"><div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-r from-blue-500/30 to-cyan-400/20 blur-2xl" /><div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur"><img src="https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1200&q=85" alt="Produtos de tecnologia" className="aspect-[4/3] w-full rounded-[1.4rem] object-cover" /><div className="absolute bottom-7 left-7 right-7 flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 backdrop-blur"><div><p className="text-[10px] font-bold uppercase tracking-widest text-blue-300">Destaque da semana</p><p className="mt-1 text-sm font-bold">Tecnologia sem complicação</p></div><ArrowRight size={18} className="text-white/60" /></div></div></div>
        </div>
      </section>

      <section id="categorias" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-7 flex items-end justify-between"><div><p className="text-xs font-black uppercase tracking-[.2em] text-blue-600">Explore</p><h2 className="mt-2 text-3xl font-black tracking-tight">Compre por categoria</h2></div><button onClick={() => selectCategory("Todos")} className="hidden items-center gap-2 text-sm font-bold text-slate-600 sm:flex">Ver tudo <ArrowRight size={16} /></button></div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{categories.map(c => <CategoryCard key={c.name} {...c} onSelect={selectCategory} />)}</div>
      </section>

      <section id="ofertas" className="bg-white py-16"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.2em] text-blue-600">Preço especial</p><h2 className="mt-2 text-3xl font-black tracking-tight">Ofertas em destaque</h2></div><span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700"><Timer size={14} /> Descontos por tempo limitado</span></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{products.filter(p => p.badge === "OFERTA").slice(0,3).map(p => <ProductCard key={p.id} product={p} onAdd={add} />)}</div></div></section>

      <section id="mais-vendidos" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8"><p className="text-xs font-black uppercase tracking-[.2em] text-blue-600">Catálogo</p><h2 className="mt-2 text-3xl font-black tracking-tight">Produtos por categoria</h2>
          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">{["Todos", ...categories.map(c => c.name)].map(c => <button key={c} onClick={() => setCategory(c)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition ${category === c ? "bg-slate-950 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"}`}>{c}</button>)}</div>
        </div>
        {category === "PS5 & PlayStation" && ps5Products.length > 0 && <section className="mb-10 overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-2xl">
          <div className="relative min-h-[430px] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-slate-950/95 to-indigo-950/80" />
            <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="relative grid min-h-[430px] items-center gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_.9fr] lg:p-12">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-500/15 px-3 py-1.5 text-[11px] font-black uppercase tracking-[.18em] text-red-300"><Flame size={14} /> Oferta relâmpago</div>
                <p className="mt-6 text-sm font-black uppercase tracking-[.25em] text-blue-300">PS5 • OFERTA EXCLUSIVA</p>
                <h2 className="mt-3 text-4xl font-black leading-none tracking-tight sm:text-6xl">PRODUTO EM<br/><span className="text-blue-400">PROMOÇÃO</span></h2>
                <p className="mt-5 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">Uma oferta especial por tempo limitado. Se você estava esperando para comprar, essa é a hora de aproveitar.</p>
                <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
                  <Clock3 size={19} className="text-red-300" />
                  <div><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Oferta termina em</p><p className="mt-0.5 font-mono text-xl font-black tracking-wider">{formatCountdown(ps5Seconds[ps5Slide])}</p></div>
                </div>
                <div className="mt-7 flex items-center gap-3">
                  <button onClick={() => add(ps5Products[ps5Slide])} className="rounded-xl bg-white px-5 py-3.5 text-sm font-black text-slate-950 transition hover:bg-blue-100">Aproveitar oferta</button>
                  <span className="text-xs font-bold text-slate-400">Oferta {ps5Slide + 1} de 3</span>
                </div>
              </div>
              <div className="relative mx-auto w-full max-w-md">
                <div className="absolute -inset-5 rounded-[2rem] bg-blue-500/20 blur-2xl" />
                <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 p-3 shadow-2xl">
                  <img src={ps5Products[ps5Slide].image} alt={ps5Products[ps5Slide].name} className="aspect-square w-full rounded-2xl object-cover transition duration-500" />
                  <div className="absolute bottom-6 left-6 right-6 rounded-xl border border-white/10 bg-slate-950/90 p-4 backdrop-blur">
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-300">Oferta PS5</p>
                    <p className="mt-1 text-lg font-black">{ps5Products[ps5Slide].name}</p>
                    <div className="mt-2 flex items-end gap-2"><span className="text-sm text-slate-500 line-through">R$ {ps5Products[ps5Slide].oldPrice.toFixed(2).replace(".", ",")}</span><span className="text-2xl font-black text-white">R$ {ps5Products[ps5Slide].price.toFixed(2).replace(".", ",")}</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-2 border-t border-white/10 bg-white/[.03] px-6 py-4">
            {[0,1,2].map(i => <button key={i} aria-label={`Ir para oferta ${i + 1}`} onClick={() => setPs5Slide(i)} className={`h-1.5 rounded-full transition-all ${i === ps5Slide ? "w-10 bg-blue-400" : "w-5 bg-white/20"}`} />)}
          </div>
        </section>}

        {search.trim() && <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-900">Resultados para “{search.trim()}” · {filtered.length} produto{filtered.length === 1 ? "" : "s"}</div>}
        {filtered.length > 0 ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.map(p => <ProductCard key={p.id} product={p} onAdd={add} />)}</div> : <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center"><SearchX className="mx-auto text-slate-400" size={36} /><h3 className="mt-4 text-lg font-black">Nenhum produto encontrado</h3><p className="mt-2 text-sm text-slate-500">Tente outro termo ou volte para todas as categorias.</p><button onClick={() => { setSearch(""); setCategory("Todos"); }} className="mt-5 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-blue-600">Limpar busca</button></div>}
      </section>

      <section className="bg-slate-950 py-14 text-white"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center"><div><p className="text-xs font-black uppercase tracking-[.2em] text-blue-400">Compra protegida</p><h2 className="mt-2 text-2xl font-black">Seu pedido acompanhado em cada etapa.</h2><p className="mt-2 text-sm text-slate-400">Depois da aprovação, o código de rastreio fica disponível em Meus pedidos.</p></div><a href="#categorias" className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-black text-slate-950">Explorar produtos <ArrowRight size={17} /></a></div></div></section>

      <section id="beneficios" className="border-y border-slate-200 bg-white"><div className="mx-auto grid max-w-7xl gap-px bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">{[{title:"Frete rápido",Icon:Truck,text:"Envio com rastreio do início ao fim."},{title:"Compra protegida",Icon:ShieldCheck,text:"Pagamento seguro e proteção no pedido."},{title:"Pagamento fácil",Icon:CreditCard,text:"Pix, cartão e parcelamento disponível."},{title:"Suporte humano",Icon:Headphones,text:"Atendimento para ajudar quando precisar."}].map(({title,Icon,text}) => <div key={title} className="bg-white p-7"><div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100 text-slate-900"><Icon size={21} /></div><h3 className="mt-5 font-black">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{text}</p></div>)}</div></section>
    </main>
    <footer className="bg-slate-950 px-4 py-10 text-white"><div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-lg font-black">NEXO<span className="text-blue-400">TECH</span></p><p className="mt-1 text-xs text-slate-500">Tecnologia que acompanha você.</p></div><div className="flex gap-5 text-xs text-slate-500"><a href="#categorias" className="hover:text-white">Categorias</a><a href="#beneficios" className="hover:text-white">Atendimento</a><a href="/pedidos" className="hover:text-white">Meus pedidos</a></div><p className="text-xs text-slate-500">© 2026 NexoTech.</p></div></footer>
    <CartDrawer open={cartOpen} items={cartItems} onClose={() => setCartOpen(false)} onChange={change} onRemove={remove} />
  </div>;
}