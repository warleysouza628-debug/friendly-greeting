import { Heart, Plus, Star, Truck } from "lucide-react";
import type { Product } from "../data/products";

export function ProductCard({ product, onAdd }: { product: Product; onAdd?: () => void }) {
  const discount = Math.round((1 - product.price / product.oldPrice) * 100);
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-2xl hover:shadow-slate-900/10">
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute left-3 top-3 flex gap-2">
          {product.badge && <span className="rounded-full bg-slate-950 px-3 py-1.5 text-[10px] font-black tracking-wider text-white">{product.badge}</span>}
          <span className="rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-black text-blue-700 shadow-sm">-{discount}%</span>
        </div>
        <button aria-label="Favoritar" className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-slate-600 shadow-sm backdrop-blur hover:text-rose-500"><Heart size={17} /></button>
      </div>
      <div className="p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">{product.category}</p>
        <h3 className="mt-2 min-h-12 text-base font-bold leading-6 text-slate-950">{product.name}</h3>
        <div className="mt-2 flex items-center gap-1.5"><Star size={15} className="fill-amber-400 text-amber-400" /><span className="text-sm font-bold">{product.rating}</span><span className="text-xs text-slate-400">({product.reviews})</span></div>
        <div className="mt-4"><span className="text-xs text-slate-400 line-through">R$ {product.oldPrice.toFixed(2).replace(".", ",")}</span><div className="flex items-end justify-between gap-2"><strong className="text-2xl font-black tracking-tight text-slate-950">R$ {product.price.toFixed(2).replace(".", ",")}</strong><span className="pb-1 text-[11px] font-semibold text-emerald-600">ou 12x sem juros</span></div></div>
        <button onClick={onAdd} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-600"><Plus size={17} /> Adicionar ao carrinho</button>
        <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-slate-500"><Truck size={14} /> Envio rápido e rastreado</div>
      </div>
    </article>
  );
}