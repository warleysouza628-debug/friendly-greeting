import { Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, X, ShoppingBag, ShieldCheck } from "lucide-react";
import type { Product } from "../data/products";

export type CartLine = { product: Product; quantity: number };

type Props = {
  open: boolean;
  items: CartLine[];
  onClose: () => void;
  onChange: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
};

export function CartDrawer({ open, items, onClose, onChange, onRemove }: Props) {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const remaining = Math.max(0, 199 - subtotal);
  const progress = Math.min(100, (subtotal / 199) * 100);
  const money = (v: number) => `R$ ${v.toFixed(2).replace(".", ",")}`;

  if (!open) return null;
  return <div className="fixed inset-0 z-[70]">
    <button aria-label="Fechar carrinho" onClick={onClose} className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" />
    <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5">
        <div><p className="text-lg font-black">Seu carrinho</p><p className="text-xs text-slate-500">{items.length} produto{items.length === 1 ? "" : "s"}</p></div>
        <button onClick={onClose} className="rounded-xl p-2 hover:bg-slate-100"><X size={21} /></button>
      </div>
      <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
        {remaining > 0 ? <><p className="text-xs font-bold text-slate-700">Faltam {money(remaining)} para ganhar frete grátis</p><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-blue-600" style={{ width: `${progress}%` }} /></div></> : <p className="flex items-center gap-2 text-xs font-black text-emerald-700"><ShieldCheck size={15} /> Você ganhou frete grátis!</p>}
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        {items.length === 0 ? <div className="flex h-full flex-col items-center justify-center text-center"><ShoppingBag size={42} className="text-slate-300" /><h3 className="mt-4 font-black">Seu carrinho está vazio</h3><p className="mt-2 max-w-xs text-sm text-slate-500">Adicione produtos e eles aparecerão aqui.</p><button onClick={onClose} className="mt-5 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">Continuar comprando</button></div> :
          <div className="space-y-4">{items.map(({ product, quantity }) => <div key={product.id} className="flex gap-3 rounded-2xl border border-slate-200 p-3">
            <img src={product.image} alt="" className="h-20 w-20 rounded-xl object-cover" />
            <div className="min-w-0 flex-1"><div className="flex justify-between gap-2"><p className="text-sm font-bold leading-5">{product.name}</p><button onClick={() => onRemove(product.id)} aria-label="Remover produto"><Trash2 size={16} className="text-slate-400 hover:text-rose-500" /></button></div><p className="mt-1 text-sm font-black">{money(product.price)}</p>
              <div className="mt-2 inline-flex items-center rounded-lg border border-slate-200"><button onClick={() => onChange(product.id, -1)} className="p-1.5"><Minus size={14} /></button><span className="min-w-7 text-center text-xs font-bold">{quantity}</span><button onClick={() => onChange(product.id, 1)} className="p-1.5"><Plus size={14} /></button></div>
            </div>
          </div>)}</div>}
      </div>
      {items.length > 0 && <div className="border-t border-slate-200 p-5">
        <div className="flex items-center justify-between"><span className="text-sm text-slate-500">Subtotal</span><strong className="text-xl">{money(subtotal)}</strong></div>
        <p className="mt-1 text-xs text-slate-400">Frete e descontos são calculados no checkout.</p>
        <Link to="/checkout" onClick={onClose} className="mt-4 flex w-full items-center justify-center rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-black text-white hover:bg-blue-600">Ir para checkout</Link>
        <button onClick={onClose} className="mt-2 w-full py-2 text-sm font-bold text-slate-600">Continuar comprando</button>
      </div>}
    </aside>
  </div>;
}