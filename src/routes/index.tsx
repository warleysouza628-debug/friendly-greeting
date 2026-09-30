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
    const timer = window.setInterval(() => {
      setPs5Seconds(current => current.map((seconds, index) => index === ps5Slide ? Math.max(0, seconds - 1) : seconds));
    }, 1000);
    const slideTimer = window.setInterval(() => setPs5Slide(current => (current + 1) % 3), 2000);
    return () => { window.clearInterval(timer); window.clearInterval(slideTimer); };
  }, [ps5Slide]);

  const formatCountdown = (seconds: number) => {
    const safe = Math.max(0, seconds);
    const hours = Math.floor(safe / 3600).toString().padStart(2, "0");
    const minutes = Math.floor((safe % 3600) / 60).toString().padStart(2, "0");
    const secs = (safe % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}:${secs}`;
  };

  return <div className="min-h-screen bg-[#f6f7f9] text-slate-950">
    <div className="bg-slate-950 px-4 py-2 text-center text-[11px] font-bold tracking-wide text-white">
      Frete grátis acima de R$ 199 <span className="mx-2 text-slate-500">•</span> Compra segura <span className="mx-2 text-slate-500">•</span> Envio rastreado
    </div>

    <StoreHeader cartCount={cartCount} search={search} onSearch={setSearch} onCartClick={() => setCartOpen(true)} />

    <main>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 overflow-x-auto pb-1 text-sm font-bold text-slate-600">
            <button onClick={() => selectCategory("Todos")} className="shrink-0 rounded-full bg-slate-950 px-4 py-2 text-white">Todos</button>
            {categories.map(c => <button key={c.name} onClick={() => selectCategory(c.name)} className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 hover:border-slate-400 hover:text-slate-950">{c.name}</button>)}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[.82fr_1.18fr] lg:px-8 lg:py-12">
          <div className="order-2 lg:order-1">
            <p className="text-xs font-black uppercase tracking-[.2em] text-blue-600">Oferta da semana</p>
            <h1 className="mt-3 max-w-2xl text-4xl font-black leading-[1.03] tracking-tight sm:text-6xl">Tecnologia para deixar seu setup <span className="text-blue-600">mais completo.</span></h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-500">Produtos selecionados, ofertas especiais e uma experiência de compra simples, rápida e segura.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#mais-vendidos" className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-black text-white transition hover:bg-blue-600">Comprar agora <ArrowRight size={17} /></a>
              <a href="#categorias" className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-black text-slate-700 transition hover:border-slate-400">Explorar categorias</a>
            </div>
            <div className="mt-7 grid max-w-xl grid-cols-3 gap-3 border-t border-slate-200 pt-6">
              <div><p className="text-lg font-black">4.9/5</p><p className="text-xs text-slate-500">Avaliações</p></div>
              <div><p className="text-lg font-black">+1.000</p><p className="text-xs text-slate-500">Pedidos</p></div>
              <div><p className="text-lg font-black">Seguro</p><p className="text-xs text-slate-500">Pagamento</p></div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 shadow-2xl ring-1 ring-slate-900/10">
              <div className="absolute left-5 top-5 z-20 inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-500/15 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-red-200"><Flame size={13} /> Oferta relâmpago</div>
              <div className="overflow-hidden">
                <div className="flex transition-transform duration-1000 ease-in-out" style={{ transform: `translateX(-${ps5Slide * 100}%)` }}>
                  {ps5Products.map((product, index) => <div key={product.id} className="w-full shrink-0 p-3 pt-16">
                    <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5">
                      <img src={product.image} alt={product.name} className="aspect-[16/10] w-full object-cover" />
                      <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/10 bg-slate-950/90 p-4 backdrop-blur">
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-300">Oferta PS5 • {index + 1}/3</p>
                        <p className="mt-1 text-lg font-black text-white">{product.name}</p>
                        <div className="mt-2 flex items-center gap-2"><span className="text-sm text-slate-500 line-through">R$ {product.oldPrice.toFixed(2).replace(".", ",")}</span><span className="text-2xl font-black text-white">R$ {product.price.toFixed(2).replace(".", ",")}</span></div>
                        <button onClick={() => add(product)} className="mt-3 w-full rounded-xl bg-white px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-blue-100">Comprar agora</button>
                      </div>
                    </div>
                  </div>)}
                </div>
              </div>
              <div className="mx-3 mb-3 flex items-center justify-between rounded-xl border border-white/10 bg-black/50 px-4 py-3 backdrop-blur">
                <div><p className="text-[10px] font-black uppercase tracking-widest text-blue-300">PRODUTO EM PROMOÇÃO</p><p className="mt-1 font-mono text-lg font-black text-white">{formatCountdown(ps5Seconds[ps5Slide])}</p></div>
                <span className="text-[10px] font-bold text-slate-300">Oferta termina em</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="categorias" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-7 flex items-end justify-between"><div><p className="text-xs font-black uppercase tracking-[.2em] text-blue-600">Categorias</p><h2 className="mt-2 text-3xl font-black tracking-tight">Encontre o que você procura</h2></div><button onClick={() => selectCategory("Todos")} className="hidden items-center gap-2 text-sm font-bold text-slate-600 sm:flex">Ver tudo <ArrowRight size={16} /></button></div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{categories.map(c => <CategoryCard key={c.name} {...c} onSelect={selectCategory} />)}</div>
      </section>

      <section id="ofertas" className="bg-slate-950 py-14 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.2em] text-blue-400">Seleção NexoTech</p><h2 className="mt-2 text-3xl font-black tracking-tight">Ofertas em destaque</h2></div><span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-slate-200"><Timer size={14} /> Por tempo limitado</span></div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{products.filter(p => p.badge === "OFERTA").slice(0,3).map(p => <div key={p.id} className="rounded-2xl bg-white p-1 text-slate-950"><ProductCard product={p} onAdd={add} /></div>)}</div>
        </div>
      </section>

      <section id="mais-vendidos" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div><p className="text-xs font-black uppercase tracking-[.2em] text-blue-600">Catálogo</p><h2 className="mt-2 text-3xl font-black tracking-tight">Mais procurados</h2><p className="mt-2 text-sm text-slate-500">Escolha por categoria ou pesquise diretamente pelo produto.</p></div>
          <div className="flex gap-2 overflow-x-auto pb-1">{["Todos", ...categories.map(c => c.name)].map(c => <button key={c} onClick={() => setCategory(c)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition ${category === c ? "bg-slate-950 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"}`}>{c}</button>)}</div>
        </div>
        {search.trim() && <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-900">Resultados para “{search.trim()}” · {filtered.length} produto{filtered.length === 1 ? "" : "s"}</div>}
        {filtered.length > 0 ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{filtered.map(p => <ProductCard key={p.id} product={p} onAdd={add} />)}</div> : <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center"><SearchX className="mx-auto text-slate-400" size={36} /><h3 className="mt-4 text-lg font-black">Nenhum produto encontrado</h3><p className="mt-2 text-sm text-slate-500">Tente outro termo ou volte para todas as categorias.</p><button onClick={() => { setSearch(""); setCategory("Todos"); }} className="mt-5 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-blue-600">Limpar busca</button></div>}
      </section>

      <section id="beneficios" className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-px bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
          {[{title:"Frete rápido",Icon:Truck,text:"Envio com rastreio do início ao fim."},{title:"Compra protegida",Icon:ShieldCheck,text:"Pagamento seguro e proteção no pedido."},{title:"Pagamento fácil",Icon:CreditCard,text:"Pix, cartão e parcelamento disponível."},{title:"Suporte humano",Icon:Headphones,text:"Atendimento para ajudar quando precisar."}].map(({title,Icon,text}) => <div key={title} className="bg-white p-7"><div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100 text-slate-900"><Icon size={21} /></div><h3 className="mt-5 font-black">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{text}</p></div>)}
        </div>
      </section>

      <section className="bg-slate-950 py-14 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div><p className="text-xs font-black uppercase tracking-[.2em] text-blue-400">NexoTech</p><h2 className="mt-2 text-3xl font-black">Tecnologia que acompanha você.</h2><p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">Uma seleção de produtos para celular, áudio, setup gamer e acessórios em um só lugar.</p></div>
          <a href="#mais-vendidos" className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-black text-slate-950 transition hover:bg-blue-50">Ver produtos <ArrowRight size={17} /></a>
        </div>
      </section>
    </main>

    <footer className="bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div><p className="text-lg font-black">NEXO<span className="text-blue-400">TECH</span></p><p className="mt-2 max-w-xs text-xs leading-5 text-slate-500">Tecnologia que acompanha você.</p></div>
        <div><p className="text-xs font-black uppercase tracking-widest text-slate-300">Comprar</p><div className="mt-3 space-y-2 text-xs text-slate-500">{categories.slice(0,3).map(c => <button key={c.name} onClick={() => selectCategory(c.name)} className="block hover:text-white">{c.name}</button>)}</div></div>
        <div><p className="text-xs font-black uppercase tracking-widest text-slate-300">Atendimento</p><div className="mt-3 space-y-2 text-xs text-slate-500"><p>Compra segura</p><p>Envio rastreado</p><a href="/pedidos" className="block hover:text-white">Meus pedidos</a></div></div>
        <div><p className="text-xs font-black uppercase tracking-widest text-slate-300">Navegação</p><div className="mt-3 space-y-2 text-xs text-slate-500"><a href="#ofertas" className="block hover:text-white">Ofertas</a><a href="#categorias" className="block hover:text-white">Categorias</a><a href="#mais-vendidos" className="block hover:text-white">Produtos</a></div></div>
      </div>
      <div className="mx-auto mt-8 max-w-7xl border-t border-white/10 pt-5 text-xs text-slate-600">© 2026 NexoTech. Todos os direitos reservados.</div>
    </footer>

    <CartDrawer open={cartOpen} items={cartItems} onClose={() => setCartOpen(false)} onChange={change} onRemove={remove} />
  </div>;
}